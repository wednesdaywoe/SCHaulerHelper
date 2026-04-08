import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeId, DeliveryTab, OCRResult, OCRProcessingOptions } from '@/types';

interface ColorPickerState {
  isOpen: boolean;
  targetLocation: string | null;
}

interface UIState {
  // Theme
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;

  // Delivery tabs
  activeDeliveryTab: DeliveryTab;
  setActiveDeliveryTab: (tab: DeliveryTab) => void;

  // OCR options (persisted so clipboard paste respects user's monitor setup)
  ocrOptions: OCRProcessingOptions;
  setOCROptions: (options: OCRProcessingOptions) => void;

  // Clipboard OCR state (not persisted — ephemeral per session)
  pendingOCRResult: OCRResult | null;
  setPendingOCRResult: (result: OCRResult | null) => void;
  ocrProcessing: boolean;
  setOCRProcessing: (processing: boolean) => void;

  // Modals
  ocrModalOpen: boolean;
  openOCRModal: () => void;
  closeOCRModal: () => void;

  feedbackModalOpen: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;

  exportModalOpen: boolean;
  openExportModal: () => void;
  closeExportModal: () => void;

  colorPickerModal: ColorPickerState;
  openColorPicker: (location: string) => void;
  closeColorPicker: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'stardust',
      setTheme: (theme) => {
        document.body.setAttribute('data-theme', theme);
        set({ theme });
      },

      // Delivery tabs
      activeDeliveryTab: 'route',
      setActiveDeliveryTab: (tab) => set({ activeDeliveryTab: tab }),

      // OCR options
      ocrOptions: {
        autoCrop: true,
        enhanceImage: true,
        displayRatio: '16:9',
        cropRegion: 'auto',
        ocrMode: 6,
      },
      setOCROptions: (options) => set({ ocrOptions: options }),

      // Clipboard OCR state
      pendingOCRResult: null,
      setPendingOCRResult: (result) => set({ pendingOCRResult: result }),
      ocrProcessing: false,
      setOCRProcessing: (processing) => set({ ocrProcessing: processing }),

      // OCR Modal
      ocrModalOpen: false,
      openOCRModal: () => set({ ocrModalOpen: true }),
      closeOCRModal: () => set({ ocrModalOpen: false }),

      // Feedback Modal
      feedbackModalOpen: false,
      openFeedbackModal: () => set({ feedbackModalOpen: true }),
      closeFeedbackModal: () => set({ feedbackModalOpen: false }),

      // Export Modal
      exportModalOpen: false,
      openExportModal: () => set({ exportModalOpen: true }),
      closeExportModal: () => set({ exportModalOpen: false }),

      // Color Picker Modal
      colorPickerModal: { isOpen: false, targetLocation: null },
      openColorPicker: (location) =>
        set({ colorPickerModal: { isOpen: true, targetLocation: location } }),
      closeColorPicker: () =>
        set({ colorPickerModal: { isOpen: false, targetLocation: null } }),
    }),
    {
      name: 'haulerHelperUI',
      partialize: (state) => ({
        theme: state.theme,
        activeDeliveryTab: state.activeDeliveryTab,
        ocrOptions: state.ocrOptions,
      }),
      onRehydrateStorage: () => {
        return (rehydrated?: UIState) => {
          if (rehydrated?.theme) {
            document.body.setAttribute('data-theme', rehydrated.theme);
          }
        };
      },
    }
  )
);
