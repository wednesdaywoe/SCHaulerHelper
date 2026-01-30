import { useState } from 'react';
import { Header } from './Header';
import { StatsPanel } from './StatsPanel';
import { MissionPanel } from '@/components/missions/MissionPanel';
import { DeliveryPanel } from '@/components/delivery/DeliveryPanel';
import { OCRScannerModal } from '@/components/modals/OCRScannerModal';
import { ColorPickerModal } from '@/components/modals/ColorPickerModal';
import { FeedbackModal } from '@/components/modals/FeedbackModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';

declare const __BUILD_TIME__: string;

export function MainLayout() {
  const openFeedbackModal = useUIStore((s) => s.openFeedbackModal);
  const [wipDismissed, setWipDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* WIP Banner */}
      {!wipDismissed && (
        <div className="bg-[var(--color-warning)]/15 border-b border-[var(--color-warning)]/30 px-4 py-2 text-center text-sm text-[var(--color-warning)] flex items-center justify-center gap-3">
          <span>
            Work in progress - Please report bugs using the Feedback button at the bottom
            <span className="hidden sm:inline">
              {' '}(built {new Date(__BUILD_TIME__).toLocaleDateString()})
            </span>
          </span>
          <button
            type="button"
            onClick={() => setWipDismissed(true)}
            className="text-[var(--color-warning)] hover:text-[var(--text-primary)] text-xs cursor-pointer"
          >
            &#x2715;
          </button>
        </div>
      )}

      {/* App Banner */}
      <div className="text-center pt-6 pb-1 px-4">
        <h1 className="text-3xl font-bold tracking-widest text-[var(--text-primary)]">
          HAULER HELPER
        </h1>
        <div className="text-sm text-[var(--text-secondary)] mt-1">
          Your Cargo Manifest for Star Citizen
        </div>
        <div
          className="w-full h-[2px] mt-5 mb-6"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%)',
          }}
        />
      </div>

      <Header />

      {/*
        Responsive layout matching the old app's breakpoints:
        - >= 1200px: 3 columns (missions | delivery | stats sidebar)
        - 900-1199px: 2 columns (missions | delivery), stats below spanning full width
        - < 900px: single column stack
      */}
      <main className="p-4 max-w-[1800px] mx-auto">
        {/* 3-column layout for large screens */}
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-[1fr_1fr_280px] min-[1400px]:grid-cols-[1fr_1fr_300px] gap-4">
          {/* Left column: Missions */}
          <MissionPanel />

          {/* Middle column: Delivery (Route + Cargo) */}
          <DeliveryPanel />

          {/* Right column: Stats — spans full width on 2-col layout */}
          <div className="min-[900px]:col-span-2 min-[1200px]:col-span-1">
            <StatsPanel />
          </div>
        </div>
      </main>

      {/* Floating feedback button */}
      <Button
        variant="primary"
        size="sm"
        className="!fixed bottom-4 right-[90px] z-40 shadow-lg"
        onClick={openFeedbackModal}
      >
        Feedback
      </Button>

      {/* All modals */}
      <OCRScannerModal />
      <ColorPickerModal />
      <FeedbackModal />
      <ExportModal />
    </div>
  );
}
