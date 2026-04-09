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
      let sw = img.width;

      if (options.autoCrop) {
        const ratios: Record<string, number> = {
          '16:9': 0.50,
          '16:10': 0.52,
          '21:9': 0.40,
          '32:9': 0.30,
          '4:3': 0.55,
        };
        const cropPct = ratios[options.displayRatio] ?? 0.50;
        sw = Math.round(img.width * cropPct);
        sx = img.width - sw;
      }

      canvas.width = sw;
      canvas.height = img.height;
      ctx.drawImage(img, sx, 0, sw, img.height, 0, 0, sw, img.height);

      if (options.enhanceImage) {
        const imageData = ctx.getImageData(0, 0, sw, img.height);
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
