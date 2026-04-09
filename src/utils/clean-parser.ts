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
  // Includes : and ¢ which OCR sometimes produces for bullet markers
  text = text.replace(/^[<>[\]•:¢|©-]\s*/gm, '');
  // OCR sometimes reads bullet markers as 0 or O before keywords
  text = text.replace(/^[0O]\s+(?=Collect|Deliver)/gm, '');

  // Remove stray OCR artifacts: | [ ] are column/box boundary noise
  text = text.replace(/[|\[\]]/g, '');

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

  // Fix "Station" or "Station." on its own line after a location name
  // e.g. "CRU-L1 Ambitious Dream\nStation." -> "CRU-L1 Ambitious Dream Station."
  text = text.replace(/(\w)\s*\n\s*Station\b/gi, '$1 Station');

  // Fix "Seraphim Station" broken across lines or with noise after it
  text = text.replace(/Seraphim\s*\n\s*Station/gi, 'Seraphim Station');

  // Fix "Covalex Distribution Center" breaking across lines
  text = text.replace(/Covalex\s*\n\s*Distribution/gi, 'Covalex Distribution');

  // Normalize S4DC facility codes: OCR reads 0 as O (e.g. S4DCO5 -> S4DC05, S4DCOS5 -> S4DC05)
  text = text.replace(/S4DC[O0]S?(\d+)/gi, 'S4DC0$1');

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
    const pickups = findPickupLocations(text, commodity, deliverPos);

    if (pickups.length > 0 && delivery && commodity && quantity > 0) {
      for (const pickup of pickups) {
        segments.push({ commodity, pickup, delivery, quantity });
      }
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
  // Strip trailing "Station" — OCR picks it up but canonical names don't include it
  let cleaned = location.trim().replace(/\s+Station\s*$/i, '');
  return applyLocationAlias(cleaned);
}

function findPickupLocations(
  text: string,
  commodity: string,
  deliverPos: number
): string[] {
  const commodityPattern = commodity.replace(/\s+/g, '\\s+');
  const collectPattern = new RegExp(
    `Collect\\s+${commodityPattern}\\s+(?:\\([^)]+\\)\\s+)?from\\s+([\\w\\s\\-.']+?)(?:\\.|\\n)`,
    'gi'
  );

  // Search forward — in SC contract UI, Collect lines follow their Deliver line.
  // Limit to text before the next Deliver line (or 1000 chars).
  const textAfter = text.substring(deliverPos);
  const nextDeliver = textAfter.substring(1).search(/Deliver\s+/i);
  const searchEnd = nextDeliver >= 0 ? nextDeliver + 1 : Math.min(textAfter.length, 1000);
  const searchRegion = textAfter.substring(0, searchEnd);

  const forwardMatches = Array.from(searchRegion.matchAll(collectPattern));
  if (forwardMatches.length > 0) {
    return forwardMatches.map((m) => cleanLocation(m[1].trim()));
  }

  // Fall back to searching backwards
  const searchStart = Math.max(0, deliverPos - 1000);
  const textBefore = text.substring(searchStart, deliverPos);
  const backwardMatches = Array.from(textBefore.matchAll(collectPattern));
  if (backwardMatches.length > 0) {
    return [cleanLocation(backwardMatches[backwardMatches.length - 1][1].trim())];
  }

  return [];
}
