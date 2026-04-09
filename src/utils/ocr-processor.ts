import { parseStarCitizenMission } from './clean-parser';
import type { OCRResult, OCRProcessingOptions } from '@/types';

export async function processImageFile(
  file: File,
  options: OCRProcessingOptions
): Promise<OCRResult> {
  const Tesseract = await import('tesseract.js');
  const worker = await Tesseract.createWorker('eng');

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: String(options.ocrMode) as Tesseract.PSM,
    });

    const imageData = await preprocessImage(file, options);
    const {
      data: { text, confidence },
    } = await worker.recognize(imageData);

    const parsedData = parseStarCitizenMission(text);

    return {
      filename: file.name,
      text,
      confidence,
      parsedData,
      preprocessedImageUrl: imageData,
    };
  } finally {
    await worker.terminate();
  }
}

export async function preprocessImage(
  file: File,
  options: OCRProcessingOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height;

      if (options.autoCrop) {
        // Expected aspect ratios for single-monitor displays
        const expectedRatios: Record<string, number> = {
          '16:9': 16 / 9,
          '16:10': 16 / 10,
          '21:9': 21 / 9,
          '32:9': 32 / 9,
          '4:3': 4 / 3,
        };
        const expectedRatio = expectedRatios[options.displayRatio] ?? 16 / 9;
        const actualRatio = img.width / img.height;

        // If the image is significantly wider than expected, it's a multi-monitor
        // capture. Extract the rightmost monitor-sized portion first.
        if (actualRatio > expectedRatio * 1.3) {
          const monitorWidth = Math.round(img.height * expectedRatio);
          sx = img.width - monitorWidth;
          sw = monitorWidth;
        }

        // Now apply UI crop within the (possibly isolated) monitor region
        // SC contract UI: left sidebar + details ~60%, top bar ~8%, bottom nav ~12%
        // Crop to just the PRIMARY OBJECTIVES column + reward header
        const regions: Record<string, [number, number, number, number]> = {
          '16:9':  [0.60, 0.08, 1.0, 0.88],
          '16:10': [0.58, 0.08, 1.0, 0.88],
          '21:9':  [0.52, 0.08, 1.0, 0.88],
          '32:9':  [0.45, 0.08, 1.0, 0.88],
          '4:3':   [0.62, 0.08, 1.0, 0.88],
        };
        const [left, top, right, bottom] = regions[options.displayRatio] ?? [0.32, 0.08, 1.0, 0.88];
        const cropX = sx + Math.round(sw * left);
        const cropY = Math.round(img.height * top);
        const cropW = Math.round(sw * right) - Math.round(sw * left);
        const cropH = Math.round(img.height * bottom) - cropY;
        sx = cropX;
        sy = cropY;
        sw = cropW;
        sh = cropH;
      }

      canvas.width = sw;
      canvas.height = sh;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      if (options.enhanceImage) {
        const imageData = ctx.getImageData(0, 0, sw, sh);
        const data = imageData.data;
        const contrast = 1.3;
        const brightness = 10;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));
          data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness));
          data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness));
        }
        ctx.putImageData(imageData, 0, 0);
      }

      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for preprocessing'));
    };
    img.src = URL.createObjectURL(file);
  });
}
