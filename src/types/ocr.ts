export interface ParsedSegment {
  commodity: string;
  pickup: string;
  delivery: string;
  quantity: number;
}

export interface ParsedMission {
  payout: number | null;
  segments: ParsedSegment[];
}

export interface OCRResult {
  filename: string;
  text: string;
  confidence: number;
  parsedData: ParsedMission | null;
  preprocessedImageUrl?: string;
}

export interface OCRProcessingOptions {
  autoCrop: boolean;
  enhanceImage: boolean;
  displayRatio: string;
  cropRegion: string;
  ocrMode: number;
}
