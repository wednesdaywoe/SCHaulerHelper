import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RouteStop,
  RouteItem,
  CargoGroup,
  CargoGridLayout,
  RouteViewMode,
  Mission,
} from '@/types';
import { travelCost } from '@/data/location-graph';

let nextStopId = 0;

interface DeliveryState {
  routeStops: RouteStop[];
  routeStepCompletion: Record<string, boolean>;
  routeViewMode: RouteViewMode;
  cargoGroups: Record<string, CargoGroup>;
  cargoGroupPositions: Record<string, number>; // location → cell index
  cargoGridLayout: CargoGridLayout;

  // Route actions
  generateRoute: (missions: Mission[]) => void;
  reorderStops: (orderedIds: string[]) => void;
  completeStep: (stopId: string) => void;
  resetSteps: () => void;
  setRouteViewMode: (mode: RouteViewMode) => void;

  // Cargo actions
  updateCargoGroupColor: (location: string, color: string) => void;
  updateCargoGroupLabel: (location: string, label: string) => void;
  moveCargoGroup: (location: string, toCellIndex: number) => void;
  setGridLayout: (layout: CargoGridLayout) => void;
}

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      routeStops: [],
      routeStepCompletion: {},
      routeViewMode: 'all',
      cargoGroups: {},
      cargoGroupPositions: {},
      cargoGridLayout: { cols: 2, rows: 4 },

      generateRoute: (missions) =>
        set((state) => {
          // Build detailed pickup/delivery data with tracking IDs
          interface PickupAction {
            id: string; // Unique ID for tracking
            location: string;
            destination: string;
            item: RouteItem;
            scu: number;
          }
          interface DeliveryAction {
            id: string;
            location: string;
            pickupId: string; // Must pick up before delivering
            item: RouteItem;
            scu: number;
          }

          const allPickups: PickupAction[] = [];
          const allDeliveries: DeliveryAction[] = [];

          missions.forEach((mission) => {
            mission.commodities.forEach((c, idx) => {
              if (!c.commodity || !c.quantity || !c.pickup || !c.destination) return;

              const pickupId = `${mission.id}_${idx}`;
              const scu = c.quantity || 0;

              const item: RouteItem = {
                missionId: mission.id,
                commodity: c.commodity,
                quantity: c.quantity,
                maxBoxSize: c.maxBoxSize,
              };

              allPickups.push({
                id: pickupId,
                location: c.pickup,
                destination: c.destination,
                item,
                scu,
              });

              allDeliveries.push({
                id: `${pickupId}_delivery`,
                location: c.destination,
                pickupId,
                item,
                scu,
              });
            });
          });

          // Track state during route building
          const pendingPickups = new Set(allPickups.map(p => p.id));
          const pendingDeliveries = new Set(allDeliveries.map(d => d.id));
          const pickedUpCargo = new Set<string>(); // Pickup IDs that are on board

          const stops: RouteStop[] = [];
          let currentLocation = '';

          // Distance penalty multiplier (higher = stronger preference for nearby locations)
          const DISTANCE_PENALTY = 0.5;

          // Greedy algorithm: pick best next stop until done
          while (pendingPickups.size > 0 || pendingDeliveries.size > 0) {
            // Build candidate locations with scores
            const candidates = new Map<string, {
              pickups: PickupAction[];
              deliveries: DeliveryAction[];
              score: number;
            }>();

            // Add pickup locations
            for (const pickupId of pendingPickups) {
              const pickup = allPickups.find(p => p.id === pickupId)!;
              if (!candidates.has(pickup.location)) {
                candidates.set(pickup.location, { pickups: [], deliveries: [], score: 0 });
              }
              candidates.get(pickup.location)!.pickups.push(pickup);
            }

            // Add deliverable locations (only if cargo has been picked up)
            for (const deliveryId of pendingDeliveries) {
              const delivery = allDeliveries.find(d => d.id === deliveryId)!;
              if (!pickedUpCargo.has(delivery.pickupId)) continue; // Can't deliver yet

              if (!candidates.has(delivery.location)) {
                candidates.set(delivery.location, { pickups: [], deliveries: [], score: 0 });
              }
              candidates.get(delivery.location)!.deliveries.push(delivery);
            }

            if (candidates.size === 0) break;

            // Score each candidate location
            for (const [location, data] of candidates) {
              const pickupSCU = data.pickups.reduce((sum, p) => sum + p.scu, 0);
              const deliverySCU = data.deliveries.reduce((sum, d) => sum + d.scu, 0);

              // Base score: deliveries worth more (free up cargo space)
              const deliveryScore = deliverySCU * 3;
              const pickupScore = pickupSCU * 2;
              const comboBonus = (deliverySCU > 0 && pickupSCU > 0) ? 200 : 0;

              // Distance penalty
              let distancePenalty = 0;
              if (currentLocation) {
                const cost = travelCost(currentLocation, location);
                distancePenalty = cost * DISTANCE_PENALTY;
              }

              data.score = deliveryScore + pickupScore + comboBonus - distancePenalty;
            }

            // Pick best location
            let bestLocation = '';
            let bestScore = -Infinity;
            for (const [location, data] of candidates) {
              if (data.score > bestScore) {
                bestScore = data.score;
                bestLocation = location;
              }
            }

            if (!bestLocation) break;

            const chosen = candidates.get(bestLocation)!;

            // Process deliveries at this location
            if (chosen.deliveries.length > 0) {
              const deliveryItems = chosen.deliveries.map(d => d.item);
              stops.push({
                id: `stop_${++nextStopId}`,
                type: 'delivery',
                location: bestLocation,
                items: deliveryItems,
              });

              // Mark deliveries complete and remove cargo from ship
              for (const delivery of chosen.deliveries) {
                pendingDeliveries.delete(delivery.id);
                pickedUpCargo.delete(delivery.pickupId);
              }
            }

            // Process pickups at this location
            if (chosen.pickups.length > 0) {
              const pickupItems = chosen.pickups.map(p => p.item);
              stops.push({
                id: `stop_${++nextStopId}`,
                type: 'pickup',
                location: bestLocation,
                items: pickupItems,
              });

              // Mark pickups complete and add cargo to ship
              for (const pickup of chosen.pickups) {
                pendingPickups.delete(pickup.id);
                pickedUpCargo.add(pickup.id);
              }
            }

            currentLocation = bestLocation;
          }

          // Build delivery-only map for cargo groups (unchanged logic)
          const deliveries = new Map<string, RouteItem[]>();
          missions.forEach((mission) => {
            mission.commodities.forEach((c) => {
              if (!c.commodity || !c.quantity || !c.destination) return;
              const item: RouteItem = {
                missionId: mission.id,
                commodity: c.commodity,
                quantity: c.quantity,
                maxBoxSize: c.maxBoxSize,
              };
              const existing = deliveries.get(c.destination) ?? [];
              existing.push(item);
              deliveries.set(c.destination, existing);
            });
          });

          // Build cargo groups from deliveries
          const palette = [
            '#4dd4ac', '#ec4899', '#fbbf24', '#8b5cf6',
            '#3b82f6', '#f97316', '#84cc16', '#06b6d4',
          ];
          const newGroups: Record<string, CargoGroup> = {};
          const newPositions: Record<string, number> = {};
          let colorIndex = 0;
          // Track which cells are already taken by preserved positions
          const occupiedCells = new Set<number>();

          deliveries.forEach((items, location) => {
            const existing = state.cargoGroups[location];
            newGroups[location] = {
              color: existing?.color ?? palette[colorIndex % palette.length],
              label: existing?.label ?? location,
              items: items.map((i) => ({
                missionId: i.missionId,
                commodity: i.commodity,
                quantity: i.quantity,
              })),
            };
            // Preserve existing position if it exists
            if (location in state.cargoGroupPositions) {
              newPositions[location] = state.cargoGroupPositions[location];
              occupiedCells.add(state.cargoGroupPositions[location]);
            }
            colorIndex++;
          });

          // Assign positions to new groups that don't have one yet
          let nextCell = 0;
          for (const location of Object.keys(newGroups)) {
            if (!(location in newPositions)) {
              while (occupiedCells.has(nextCell)) nextCell++;
              newPositions[location] = nextCell;
              occupiedCells.add(nextCell);
              nextCell++;
            }
          }

          return {
            routeStops: stops,
            cargoGroups: newGroups,
            cargoGroupPositions: newPositions,
            routeStepCompletion: {},
          };
        }),

      reorderStops: (orderedIds) =>
        set((state) => {
          const byId = new Map(state.routeStops.map((s) => [s.id, s]));
          const reordered = orderedIds
            .map((id) => byId.get(id))
            .filter((s): s is RouteStop => s !== undefined);
          return { routeStops: reordered };
        }),

      completeStep: (stopId) =>
        set((state) => ({
          routeStepCompletion: {
            ...state.routeStepCompletion,
            [stopId]: !state.routeStepCompletion[stopId],
          },
        })),

      resetSteps: () => set({ routeStepCompletion: {} }),

      setRouteViewMode: (mode) => set({ routeViewMode: mode }),

      updateCargoGroupColor: (location, color) =>
        set((state) => ({
          cargoGroups: {
            ...state.cargoGroups,
            [location]: { ...state.cargoGroups[location], color },
          },
        })),

      updateCargoGroupLabel: (location, label) =>
        set((state) => ({
          cargoGroups: {
            ...state.cargoGroups,
            [location]: { ...state.cargoGroups[location], label },
          },
        })),

      moveCargoGroup: (location, toCellIndex) =>
        set((state) => {
          const newPositions = { ...state.cargoGroupPositions };
          // If the target cell is occupied, swap positions
          const occupant = Object.entries(newPositions).find(
            ([, idx]) => idx === toCellIndex
          );
          if (occupant) {
            newPositions[occupant[0]] = newPositions[location];
          }
          newPositions[location] = toCellIndex;
          return { cargoGroupPositions: newPositions };
        }),

      setGridLayout: (layout) => set({ cargoGridLayout: layout }),
    }),
    {
      name: 'haulerHelperDelivery',
      partialize: (state) => ({
        routeViewMode: state.routeViewMode,
        cargoGridLayout: state.cargoGridLayout,
        cargoGroups: state.cargoGroups,
        cargoGroupPositions: state.cargoGroupPositions,
      }),
    }
  )
);
