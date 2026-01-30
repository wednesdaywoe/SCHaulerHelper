import { applyLocationAlias, applyCommodityAlias } from '@/data/ocr-mappings';
import type { ParsedMission, ParsedSegment } from '@/types';

export function parseStarCitizenMission(text: string): ParsedMission {
  const payout = extractPayout(text);
  text = preprocessText(text);
  const segments = extractSegments(text);
  return { payout, segments };
}

function extractPayout(text: string): number | null {
  let match = text.match(/Reward[^\n]{0,10}?(\d{2,3},\d{3}|\d{5,})/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  match = text.match(/(?:EEL\]|REE|RRE)[^\n]{0,10}?(\d{2,3},\d{3}|\d{5,})/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return null;
}

function preprocessText(text: string): string {
  // Remove leading < or similar bullet characters from lines (UI artifact)
  text = text.replace(/^[<>[\]•-]\s*/gm, '');

  // Normalize lagrange point descriptions to simple format
  // "Wide Forest Station at ArcCorp's L1 Lagrange point" -> "ARC-L1 Wide Forest"
  // Note: \s+ handles line breaks between words (common OCR artifact)
  text = text.replace(/Wide\s+Forest\s+Station\s+at\s+ArcCorp.s\s+L1\s+Lagrange\s+point/gi, 'ARC-L1 Wide Forest');
  text = text.replace(/Shallow\s+Frontier\s+Station\s+at\s+MicroTech.s\s+L1\s+Lagrange\s+point/gi, 'MIC-L1 Shallow Frontier');
  text = text.replace(/Endless\s+Odyssey\s+Station\s+at\s+Hurston.s\s+L1\s+Lagrange\s+point/gi, 'HUR-L1 Endless Odyssey');
  text = text.replace(/Evergreen\s+Harbor\s+Station\s+at\s+Crusader.s\s+L1\s+Lagrange\s+point/gi, 'CRU-L1 Evergreen Harbor');
  // Generic single-word station pattern as fallback
  text = text.replace(/(\w+)\s+Station\s+at\s+(\w+).s\s+L(\d)\s+Lagrange\s+point/gi, '$2-L$3 $1');

  // Fix location names that break across lines
  text = text.replace(/Sakura Sun\s*\n\s*Goldenrod/gi, 'Sakura Sun Goldenrod');
  text = text.replace(/Greycat Stanton IV\s*\n\s*Production/gi, 'Greycat Stanton IV Production');
  text = text.replace(/Rayari (\w+)\s*\n\s*Research/gi, 'Rayari $1 Research');
  text = text.replace(/NB Int\.?\s*\n\s*Spaceport/gi, 'NB Int. Spaceport');
  // Fix lagrange station names that break across lines
  text = text.replace(/Red\s*\n\s*microTech-L4\s+Crossroads/gi, 'MIC-L4 Red Crossroads');
  text = text.replace(/microTech-L(\d)\s+([\w\s]+)/gi, 'MIC-L$1 $2');

  // Fix facility codes that break across lines
  text = text.replace(/SMO-\s*\n\s*(\d+)/gi, 'SMO-$1');
  text = text.replace(/SM0-\s*\n\s*(\d+)/gi, 'SMO-$1');
  text = text.replace(/SMCa-\s*\n\s*(\d+)/gi, 'SMCa-$1');
  text = text.replace(/S4DC\s*\n\s*(\d+)/gi, 'S4DC$1');
  text = text.replace(/S4LD\s*\n\s*(\d+)/gi, 'S4LD$1');

  // Fix prefix + code on next line
  text = text.replace(/Mining\s*\n\s*(SMO-?\d+|SMCa-?\d+)/gi, 'Mining $1');
  text = text.replace(/Facility\s*\n\s*(SMO-?\d+|S4DC\d+)/gi, 'Facility $1');

  return text;
}

function extractSegments(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  // Pattern handles:
  // - "Deliver 0/6 SCU of Medical Supplies to Shubin Mining on Calliope"
  // - "Deliver 0/6 SCU of Medical Supplies to ARC-L1 Wide Forest."
  const deliverPattern =
    /Deliver\s+(0\/\d+|\d+)\s+SCU\s+(?:of\s+)?([\w\s()]+?)\s+to\s+([\w\s\-.']+?)(?:\s+(?:on|above|at)\s+[\w\s\-.']+?)?(?:\.|$)/gi;

  let match;
  while ((match = deliverPattern.exec(text)) !== null) {
    const quantityStr = match[1];
    const commodityRaw = match[2].trim();
    const deliveryRaw = match[3].trim();
    const deliverPos = match.index;

    const quantity = parseQuantity(quantityStr);
    const commodity = cleanCommodity(commodityRaw);
    const delivery = cleanLocation(deliveryRaw);
    const pickup = findPickupLocation(text, commodity, deliverPos);

    if (pickup && delivery && commodity && quantity > 0) {
      segments.push({ commodity, pickup, delivery, quantity });
    }
  }

  return segments;
}

function parseQuantity(str: string): number {
  if (str.includes('/')) {
    const parts = str.split('/');
    return parseInt(parts[1], 10);
  }
  const cleaned = str.replace(/^0+/, '') || '0';
  return parseInt(cleaned, 10);
}

function cleanCommodity(commodity: string): string {
  const cleaned = commodity.replace(/\s*\([^)]+\)\s*/g, ' ').trim();
  return applyCommodityAlias(cleaned);
}

function cleanLocation(location: string): string {
  return applyLocationAlias(location.trim());
}

function findPickupLocation(
  text: string,
  commodity: string,
  deliverPos: number
): string | null {
  const searchStart = Math.max(0, deliverPos - 1000);
  const textBefore = text.substring(searchStart, deliverPos);

  const commodityPattern = commodity.replace(/\s+/g, '\\s+');
  const collectPattern = new RegExp(
    `Collect\\s+${commodityPattern}\\s+(?:\\([^)]+\\)\\s+)?from\\s+([\\w\\s\\-.']+?)(?:\\.|\\n)`,
    'gi'
  );

  const matches = Array.from(textBefore.matchAll(collectPattern));
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    return cleanLocation(lastMatch[1].trim());
  }

  return null;
}
