import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { calculateBoxBreakdown } from '@/utils/box-breakdown';
import type { RouteStop, RouteViewMode } from '@/types';

// Container icon component
function ContainerIcon({ size }: { size: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icons/${size}.svg`}
      alt={`${size} SCU`}
      className="inline-block w-6 h-6"
      style={{ filter: 'var(--icon-filter, none)' }}
    />
  );
}

// Box breakdown display with icons
function BoxBreakdownDisplay({ breakdown }: { breakdown: Record<string, number> }) {
  const entries = Object.entries(breakdown).filter(([, count]) => count > 0);
  if (entries.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-end">
      {entries.map(([size, count], i) => (
        <span key={size} className="flex items-center gap-0.5">
          {i > 0 && <span className="text-[var(--text-tertiary)] mx-0.5">+</span>}
          <span>{count}x</span>
          <ContainerIcon size={parseInt(size)} />
        </span>
      ))}
    </div>
  );
}

interface SortableRouteStopProps {
  stop: RouteStop;
  completed: boolean;
  onComplete: (id: string) => void;
}

function SortableRouteStop({ stop, completed, onComplete }: SortableRouteStopProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-[var(--border-color)] rounded-lg p-3 transition-opacity ${
        completed ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-1 py-0.5 touch-none"
            title="Drag to reorder"
          >
            &#x2630;
          </button>
          <span
            className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
              stop.type === 'pickup'
                ? 'bg-blue-600/20 text-blue-400'
                : 'bg-green-600/20 text-green-400'
            }`}
          >
            {stop.type}
          </span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {stop.location}
          </span>
        </div>
        <button
          onClick={() => onComplete(stop.id)}
          className={`w-5 h-5 rounded border-2 transition-colors cursor-pointer ${
            completed
              ? 'bg-[var(--color-success)] border-[var(--color-success)]'
              : 'border-[var(--border-color)] hover:border-[var(--color-primary)]'
          }`}
        />
      </div>
      <div className="space-y-1.5">
        {stop.items.map((item, i) => {
          const breakdown = calculateBoxBreakdown(
            item.quantity,
            item.maxBoxSize
          );
          return (
            <div
              key={i}
              className="text-xs text-[var(--text-secondary)]"
            >
              <div className="flex justify-between items-center">
                <span>{item.commodity}</span>
                <span>{item.quantity} SCU</span>
              </div>
              <BoxBreakdownDisplay breakdown={breakdown} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RoutePlanner() {
  const routeStops = useDeliveryStore((s) => s.routeStops);
  const routeStepCompletion = useDeliveryStore((s) => s.routeStepCompletion);
  const routeViewMode = useDeliveryStore((s) => s.routeViewMode);
  const completeStep = useDeliveryStore((s) => s.completeStep);
  const resetSteps = useDeliveryStore((s) => s.resetSteps);
  const setRouteViewMode = useDeliveryStore((s) => s.setRouteViewMode);
  const reorderStops = useDeliveryStore((s) => s.reorderStops);

  // Filter stops based on view mode
  const currentIndex = routeStops.findIndex((s) => !routeStepCompletion[s.id]);
  const visibleStops = routeStops.filter((stop, index) => {
    if (routeViewMode === 'all') return true;
    if (routeViewMode === 'current') return index === currentIndex;
    if (routeViewMode === 'current-next')
      return index === currentIndex || index === currentIndex + 1;
    if (routeViewMode === 'remaining') return !routeStepCompletion[stop.id];
    return true;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Reorder within the full stops array, not just visible
      const oldIndex = routeStops.findIndex((s) => s.id === active.id);
      const newIndex = routeStops.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(routeStops, oldIndex, newIndex);
      reorderStops(reordered.map((s) => s.id));
    }
  };

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <Select
          value={routeViewMode}
          onChange={(e) => setRouteViewMode(e.target.value as RouteViewMode)}
          className="text-xs"
        >
          <option value="all">All Stops</option>
          <option value="current">Current Only</option>
          <option value="current-next">Current + Next</option>
          <option value="remaining">Remaining</option>
        </Select>
        <Button variant="ghost" size="sm" onClick={resetSteps}>
          Reset
        </Button>
      </div>

      {visibleStops.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] text-center py-4">
          {routeStops.length === 0
            ? 'Add missions with locations to generate a route.'
            : 'All stops completed!'}
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleStops.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {visibleStops.map((stop) => (
                <SortableRouteStop
                  key={stop.id}
                  stop={stop}
                  completed={routeStepCompletion[stop.id] ?? false}
                  onComplete={completeStep}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
