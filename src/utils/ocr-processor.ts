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

      // Crop region: [leftPct, topPct, rightPct, bottomPct]
      // Defines the rectangle to KEEP as percentages of the full image
      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height;

      if (options.autoCrop) {
        // SC contract UI layout: left sidebar ~32%, top bar ~8%, bottom nav ~12%
        // Crop to the contract content area (details + objectives panel)
        const regions: Record<string, [number, number, number, number]> = {
          '16:9':  [0.32, 0.08, 1.0, 0.88],
          '16:10': [0.30, 0.08, 1.0, 0.88],
          '21:9':  [0.24, 0.08, 1.0, 0.88],
          '32:9':  [0.18, 0.08, 1.0, 0.88],
          '4:3':   [0.36, 0.08, 1.0, 0.88],
        };
        const [left, top, right, bottom] = regions[options.displayRatio] ?? [0.32, 0.08, 1.0, 0.88];
        sx = Math.round(img.width * left);
        sy = Math.round(img.height * top);
        sw = Math.round(img.width * right) - sx;
        sh = Math.round(img.height * bottom) - sy;
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
