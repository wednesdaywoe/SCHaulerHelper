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
import { travelCost, getSystem, findGateway } from '@/data/location-graph';

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
          const LOOKAHEAD_PENALTY = 0.15; // Penalty for being far from remaining destinations

          // --- Gateway-aware routing setup ---
          // Identify if there are interstellar destinations requiring gateway travel
          const allDestinations = [...new Set(allDeliveries.map(d => d.location))];
          const allPickupLocs = [...new Set(allPickups.map(p => p.location))];
          const startSystem = allPickupLocs.length > 0 ? getSystem(allPickupLocs[0]) : null;

          // Find destinations in other systems and their gateways
          const interstellarGateways = new Map<string, string>(); // destSystem -> gateway in startSystem
          if (startSystem) {
            for (const dest of allDestinations) {
              const destSystem = getSystem(dest);
              if (destSystem && destSystem !== startSystem && !interstellarGateways.has(destSystem)) {
                const gateway = findGateway(startSystem, destSystem);
                if (gateway) {
                  interstellarGateways.set(destSystem, gateway);
                }
              }
            }
          }

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

            // Get all remaining destination locations for look-ahead
            const remainingDestinations = new Set<string>();
            for (const deliveryId of pendingDeliveries) {
              const delivery = allDeliveries.find(d => d.id === deliveryId)!;
              remainingDestinations.add(delivery.location);
            }

            // Score each candidate location
            for (const [location, data] of candidates) {
              const pickupSCU = data.pickups.reduce((sum, p) => sum + p.scu, 0);
              const deliverySCU = data.deliveries.reduce((sum, d) => sum + d.scu, 0);

              // Base score: deliveries worth more (free up cargo space)
              const deliveryScore = deliverySCU * 3;
              const pickupScore = pickupSCU * 2;
              const comboBonus = (deliverySCU > 0 && pickupSCU > 0) ? 200 : 0;

              // Distance penalty from current location
              let distancePenalty = 0;
              if (currentLocation) {
                const cost = travelCost(currentLocation, location);
                distancePenalty = cost * DISTANCE_PENALTY;
              }

              // --- Look-ahead penalty ---
              // Penalize locations that are far from remaining same-system destinations
              // (interstellar destinations are handled via gateway routing)
              let lookaheadPenalty = 0;
              const locationSystem = getSystem(location);
              const sameSystemDestinations = [...remainingDestinations].filter(d => {
                if (d === location) return false;
                const dSys = getSystem(d);
                return dSys === locationSystem;
              });

              // If there are interstellar destinations, include the gateway as a "destination"
              // so we prefer routes that move toward the exit point
              const gatewaysToInclude: string[] = [];
              if (locationSystem === startSystem && interstellarGateways.size > 0) {
                for (const [destSystem, gateway] of interstellarGateways) {
                  const hasInterstellarPending = [...remainingDestinations].some(d => {
                    const dSys = getSystem(d);
                    return dSys === destSystem;
                  });
                  if (hasInterstellarPending) {
                    gatewaysToInclude.push(gateway);
                  }
                }
              }

              const lookaheadTargets = [...sameSystemDestinations, ...gatewaysToInclude];
              if (lookaheadTargets.length > 0) {
                let totalDistToRemaining = 0;
                for (const dest of lookaheadTargets) {
                  totalDistToRemaining += travelCost(location, dest);
                }
                const avgDistToRemaining = totalDistToRemaining / lookaheadTargets.length;
                lookaheadPenalty = avgDistToRemaining * LOOKAHEAD_PENALTY;
              }

              // --- Gateway-aware routing ---
              // When we have interstellar destinations, calculate the TOTAL remaining
              // journey: from candidate → other same-system stops → gateway
              // This naturally penalizes routes that backtrack
              let gatewayPenalty = 0;
              if (locationSystem === startSystem && gatewaysToInclude.length > 0) {
                // For each gateway we need to reach, estimate the journey
                for (const gateway of gatewaysToInclude) {
                  // Penalty based on: distance from candidate to gateway
                  // PLUS sum of how far same-system destinations are from the gateway
                  // This favors routes that visit stops "on the way" to the gateway
                  const distToGateway = travelCost(location, gateway);

                  // How much do we deviate from the path to gateway?
                  // Calculate: (dist from here to dest) + (dist from dest to gateway) - (dist from here to gateway)
                  // Positive values mean the destination is NOT on the way
                  let deviationPenalty = 0;
                  for (const dest of sameSystemDestinations) {
                    const distToDest = travelCost(location, dest);
                    const destToGateway = travelCost(dest, gateway);
                    const deviation = (distToDest + destToGateway) - distToGateway;
                    deviationPenalty += Math.max(0, deviation);
                  }

                  gatewayPenalty = deviationPenalty * 0.1;
                  break; // Only consider first gateway
                }
              }

              data.score = deliveryScore + pickupScore + comboBonus - distancePenalty - lookaheadPenalty - gatewayPenalty;
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

          // --- 2-opt improvement ---
          // Try swapping pairs of delivery stops to reduce total route distance
          // Only swap deliveries (not pickups) to maintain pickup-before-delivery constraint
          const deliveryStopIndices = stops
            .map((s, i) => ({ stop: s, index: i }))
            .filter(({ stop }) => stop.type === 'delivery')
            .map(({ index }) => index);

          if (deliveryStopIndices.length >= 2) {
            let improved = true;
            let iterations = 0;
            const MAX_ITERATIONS = 50; // Prevent infinite loops

            while (improved && iterations < MAX_ITERATIONS) {
              improved = false;
              iterations++;

              for (let i = 0; i < deliveryStopIndices.length - 1; i++) {
                for (let j = i + 1; j < deliveryStopIndices.length; j++) {
                  const idxA = deliveryStopIndices[i];
                  const idxB = deliveryStopIndices[j];

                  // Calculate current route cost around these stops
                  const prevA = idxA > 0 ? stops[idxA - 1].location : '';
                  const locA = stops[idxA].location;
                  const nextA = idxA < stops.length - 1 ? stops[idxA + 1].location : '';
                  const prevB = idxB > 0 ? stops[idxB - 1].location : '';
                  const locB = stops[idxB].location;
                  const nextB = idxB < stops.length - 1 ? stops[idxB + 1].location : '';

                  // Current cost (edges touching A and B)
                  let currentCost = 0;
                  if (prevA) currentCost += travelCost(prevA, locA);
                  if (nextA && idxA + 1 !== idxB) currentCost += travelCost(locA, nextA);
                  if (prevB && idxB - 1 !== idxA) currentCost += travelCost(prevB, locB);
                  if (nextB) currentCost += travelCost(locB, nextB);
                  // Handle adjacent case
                  if (idxA + 1 === idxB) {
                    currentCost = 0;
                    if (prevA) currentCost += travelCost(prevA, locA);
                    currentCost += travelCost(locA, locB);
                    if (nextB) currentCost += travelCost(locB, nextB);
                  }

                  // Cost after swap
                  let swapCost = 0;
                  if (idxA + 1 === idxB) {
                    // Adjacent: A-B becomes B-A
                    if (prevA) swapCost += travelCost(prevA, locB);
                    swapCost += travelCost(locB, locA);
                    if (nextB) swapCost += travelCost(locA, nextB);
                  } else {
                    // Non-adjacent swap
                    if (prevA) swapCost += travelCost(prevA, locB);
                    if (nextA) swapCost += travelCost(locB, nextA);
                    if (prevB) swapCost += travelCost(prevB, locA);
                    if (nextB) swapCost += travelCost(locA, nextB);
                  }

                  // If swap improves route, do it
                  if (swapCost < currentCost) {
                    const temp = stops[idxA];
                    stops[idxA] = stops[idxB];
                    stops[idxB] = temp;
                    improved = true;
                  }
                }
              }
            }
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
