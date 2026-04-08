import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { processImageFile } from '@/utils/ocr-processor';

export function useClipboardOCR() {
  const openOCRModal = useUIStore((s) => s.openOCRModal);
  const setPendingOCRResult = useUIStore((s) => s.setPendingOCRResult);
  const setOCRProcessing = useUIStore((s) => s.setOCRProcessing);
  const ocrOptions = useUIStore((s) => s.ocrOptions);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      let imageFile: File | null = null;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          imageFile = item.getAsFile();
          break;
        }
      }

      if (!imageFile) return;

      // Open modal immediately so the user gets feedback that something is happening
      setOCRProcessing(true);
      openOCRModal();

      try {
        const result = await processImageFile(imageFile, ocrOptions);
        setPendingOCRResult(result);
      } catch (err) {
        console.error('Clipboard OCR failed:', err);
        // Modal is already open — the user will see the empty state
        // and can fall back to manual file selection
      } finally {
        setOCRProcessing(false);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [openOCRModal, setPendingOCRResult, setOCRProcessing, ocrOptions]);
}
