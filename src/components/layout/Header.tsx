import { useUIStore } from '@/stores/uiStore';
import { useMissionStore } from '@/stores/missionStore';
import { SHIPS, THEMES } from '@/data';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Ship, SystemId, Category } from '@/types';

export function Header() {
  const { theme, setTheme, openOCRModal, openExportModal } = useUIStore();
  const {
    selectedShip,
    selectedSystem,
    selectedCategory,
    setShip,
    setSystem,
    setCategory,
    clearMissions,
    clearAll,
  } = useMissionStore();

  const handleShipChange = (name: string) => {
    const ship = SHIPS.find((s: Ship) => s.name === name) ?? null;
    setShip(ship);
  };

  return (
    <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 py-3">
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        {/* Ship selector */}
        <div className="flex flex-col gap-1 w-full min-[600px]:w-auto">
          <label className="text-xs text-[var(--text-secondary)] font-medium">
            Ship
          </label>
          <SearchableSelect
            options={SHIPS.map((s) => s.name)}
            value={selectedShip?.name ?? ''}
            onChange={handleShipChange}
            placeholder="Select ship..."
            className="min-[600px]:w-56"
          />
        </div>

        {/* System filter */}
        <Select
          label="System"
          value={selectedSystem}
          onChange={(e) => setSystem(e.target.value as SystemId | '')}
        >
          <option value="">All Systems</option>
          <option value="stanton">Stanton</option>
          <option value="arccorp">ArcCorp</option>
          <option value="crusader">Crusader</option>
          <option value="hurston">Hurston</option>
          <option value="microtech">MicroTech</option>
          <option value="nyx">Nyx</option>
          <option value="pyro">Pyro</option>
        </Select>

        {/* Category filter */}
        <Select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value as Category | '')}
        >
          <option value="">All Categories</option>
          <option value="planetary">Planetary</option>
          <option value="local">Local</option>
          <option value="stellar">Stellar</option>
          <option value="interstellar">Interstellar</option>
        </Select>

        {/* Mission Scanner button */}
        <Button variant="primary" size="sm" onClick={openOCRModal} className="self-end">
          Mission Scanner
        </Button>

        {/* Spacer — hidden on small screens so buttons wrap naturally */}
        <div className="hidden min-[900px]:block flex-1" />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 w-full min-[900px]:w-auto">
          <Button variant="secondary" size="sm" onClick={openExportModal}>
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={clearMissions}>
            Clear Missions
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Reset All
          </Button>
        </div>

        {/* Theme selector - last on the right */}
        <Select
          label="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value as typeof theme)}
          className="min-[900px]:ml-2"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>
    </header>
  );
}
