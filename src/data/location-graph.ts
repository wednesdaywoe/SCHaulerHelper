// Location Graph - Hierarchical Universe Model for Distance-Aware Routing
// Enables semantic distance calculations based on location relationships
//
// LAGRANGE POINT CORRIDORS (Stanton System):
// The lagrange points form travel corridors across the system, NOT clusters around planets.
//
// Hurston-Terra Corridor (closest to Hurston → Terra Gateway):
//   Hurston → HUR-L1 → HUR-L2 → CRU-L3 → HUR-L4 → ARC-L4 → MIC-L5 → Terra Gateway
//
// ArcCorp-Pyro Corridor (closest to ArcCorp → Pyro Gateway):
//   ArcCorp → ARC-L1 → ARC-L2 → HUR-L5 → CRU-L4 → ARC-L5 → MIC-L3 → Pyro Gateway
//
// Crusader-Nyx Corridor (closest to Crusader → Nyx Gateway):
//   Crusader → CRU-L1 → CRU-L2 → HUR-L3 → CRU-L5 → ARC-L3 → MIC-L4 → Nyx Gateway

export type LocationType = 'system' | 'planet' | 'moon' | 'station' | 'city' | 'outpost' | 'lagrange' | 'corridor' | 'gateway';

export interface LocationNode {
  id: string;
  name: string;
  type: LocationType;
  parent: string | null;
  corridor?: string;        // For lagrange points: which corridor they're in
  corridorPosition?: number; // Position in corridor (0 = closest to planet, higher = closer to gateway)
}

export const LOCATION_GRAPH: Record<string, LocationNode> = {
  // ===========================================
  // SYSTEMS (top level)
  // ===========================================
  'stanton': { id: 'stanton', name: 'Stanton', type: 'system', parent: null },
  'nyx': { id: 'nyx', name: 'Nyx', type: 'system', parent: null },
  'pyro': { id: 'pyro', name: 'Pyro', type: 'system', parent: null },

  // ===========================================
  // STANTON SYSTEM
  // ===========================================

  // --- Planets ---
  'arccorp': { id: 'arccorp', name: 'ArcCorp', type: 'planet', parent: 'stanton' },
  'crusader': { id: 'crusader', name: 'Crusader', type: 'planet', parent: 'stanton' },
  'hurston': { id: 'hurston', name: 'Hurston', type: 'planet', parent: 'stanton' },
  'microtech': { id: 'microtech', name: 'MicroTech', type: 'planet', parent: 'stanton' },

  // --- ArcCorp Moons ---
  'lyria': { id: 'lyria', name: 'Lyria', type: 'moon', parent: 'arccorp' },
  'wala': { id: 'wala', name: 'Wala', type: 'moon', parent: 'arccorp' },

  // --- Crusader Moons ---
  'cellin': { id: 'cellin', name: 'Cellin', type: 'moon', parent: 'crusader' },
  'yela': { id: 'yela', name: 'Yela', type: 'moon', parent: 'crusader' },
  'daymar': { id: 'daymar', name: 'Daymar', type: 'moon', parent: 'crusader' },

  // --- Hurston Moons ---
  'aberdeen': { id: 'aberdeen', name: 'Aberdeen', type: 'moon', parent: 'hurston' },
  'arial': { id: 'arial', name: 'Arial', type: 'moon', parent: 'hurston' },
  'magda': { id: 'magda', name: 'Magda', type: 'moon', parent: 'hurston' },
  'ita': { id: 'ita', name: 'Ita', type: 'moon', parent: 'hurston' },

  // --- MicroTech Moons ---
  'caliope': { id: 'caliope', name: 'Caliope', type: 'moon', parent: 'microtech' },
  'clio': { id: 'clio', name: 'Clio', type: 'moon', parent: 'microtech' },
  'euterpe': { id: 'euterpe', name: 'Euterpe', type: 'moon', parent: 'microtech' },

  // --- Stanton Corridors (virtual groupings for lagrange points) ---
  'hurston-terra-corridor': { id: 'hurston-terra-corridor', name: 'Hurston-Terra Corridor', type: 'corridor', parent: 'stanton' },
  'arccorp-pyro-corridor': { id: 'arccorp-pyro-corridor', name: 'ArcCorp-Pyro Corridor', type: 'corridor', parent: 'stanton' },
  'crusader-nyx-corridor': { id: 'crusader-nyx-corridor', name: 'Crusader-Nyx Corridor', type: 'corridor', parent: 'stanton' },

  // --- Stanton Gateway Stations (positioned at end of their corridors) ---
  'terra-gateway': { id: 'terra-gateway', name: 'Terra Gateway', type: 'gateway', parent: 'stanton', corridor: 'hurston-terra-corridor', corridorPosition: 7 },
  'pyro-gateway-stanton': { id: 'pyro-gateway-stanton', name: 'Pyro Gateway - Stanton', type: 'gateway', parent: 'stanton', corridor: 'arccorp-pyro-corridor', corridorPosition: 7 },
  'nyx-gateway-stanton': { id: 'nyx-gateway-stanton', name: 'Nyx Gateway - Stanton', type: 'gateway', parent: 'stanton', corridor: 'crusader-nyx-corridor', corridorPosition: 7 },

  // --- Hurston-Terra Corridor Lagrange Points ---
  // Order: Hurston(0) → HUR-L1(1) → HUR-L2(2) → CRU-L3(3) → HUR-L4(4) → ARC-L4(5) → MIC-L5(6) → Terra Gateway(7)
  'hur-l1': { id: 'hur-l1', name: 'HUR-L1 Green Glade', type: 'lagrange', parent: 'stanton', corridor: 'hurston-terra-corridor', corridorPosition: 1 },
  'hur-l2': { id: 'hur-l2', name: 'HUR-L2 Faithful Dream', type: 'lagrange', parent: 'stanton', corridor: 'hurston-terra-corridor', corridorPosition: 2 },
  'cru-l3': { id: 'cru-l3', name: 'CRU-L3', type: 'lagrange', parent: 'stanton', corridor: 'hurston-terra-corridor', corridorPosition: 3 },
  'hur-l4': { id: 'hur-l4', name: 'HUR-L4 Melodic Fields', type: 'lagrange', parent: 'stanton', corridor: 'hurston-terra-corridor', corridorPosition: 4 },
  'arc-l4': { id: 'arc-l4', name: 'ARC-L4 Feint Glen', type: 'lagrange', parent: 'stanton', corridor: 'hurston-terra-corridor', corridorPosition: 5 },
  'mic-l5': { id: 'mic-l5', name: 'MIC-L5 Modern Icarus', type: 'lagrange', parent: 'stanton', corridor: 'hurston-terra-corridor', corridorPosition: 6 },

  // --- ArcCorp-Pyro Corridor Lagrange Points ---
  // Order: ArcCorp(0) → ARC-L1(1) → ARC-L2(2) → HUR-L5(3) → CRU-L4(4) → ARC-L5(5) → MIC-L3(6) → Pyro Gateway(7)
  'arc-l1': { id: 'arc-l1', name: 'ARC-L1 Wide Forest', type: 'lagrange', parent: 'stanton', corridor: 'arccorp-pyro-corridor', corridorPosition: 1 },
  'arc-l2': { id: 'arc-l2', name: 'ARC-L2', type: 'lagrange', parent: 'stanton', corridor: 'arccorp-pyro-corridor', corridorPosition: 2 },
  'hur-l5': { id: 'hur-l5', name: 'HUR-L5 High Course', type: 'lagrange', parent: 'stanton', corridor: 'arccorp-pyro-corridor', corridorPosition: 3 },
  'cru-l4': { id: 'cru-l4', name: 'CRU-L4 Shallow Fields', type: 'lagrange', parent: 'stanton', corridor: 'arccorp-pyro-corridor', corridorPosition: 4 },
  'arc-l5': { id: 'arc-l5', name: 'ARC-L5 Yellow Core', type: 'lagrange', parent: 'stanton', corridor: 'arccorp-pyro-corridor', corridorPosition: 5 },
  'mic-l3': { id: 'mic-l3', name: 'MIC-L3 Endless Odyssey', type: 'lagrange', parent: 'stanton', corridor: 'arccorp-pyro-corridor', corridorPosition: 6 },

  // --- Crusader-Nyx Corridor Lagrange Points ---
  // Order: Crusader(0) → CRU-L1(1) → CRU-L2(2) → HUR-L3(3) → CRU-L5(4) → ARC-L3(5) → MIC-L4(6) → Nyx Gateway(7)
  'cru-l1': { id: 'cru-l1', name: 'CRU-L1 Ambitious Dream', type: 'lagrange', parent: 'stanton', corridor: 'crusader-nyx-corridor', corridorPosition: 1 },
  'cru-l2': { id: 'cru-l2', name: 'CRU-L2', type: 'lagrange', parent: 'stanton', corridor: 'crusader-nyx-corridor', corridorPosition: 2 },
  'hur-l3': { id: 'hur-l3', name: 'HUR-L3 Thundering Express', type: 'lagrange', parent: 'stanton', corridor: 'crusader-nyx-corridor', corridorPosition: 3 },
  'cru-l5': { id: 'cru-l5', name: 'CRU-L5 Beautiful Glen', type: 'lagrange', parent: 'stanton', corridor: 'crusader-nyx-corridor', corridorPosition: 4 },
  'arc-l3': { id: 'arc-l3', name: 'ARC-L3 Modern Express', type: 'lagrange', parent: 'stanton', corridor: 'crusader-nyx-corridor', corridorPosition: 5 },
  'mic-l4': { id: 'mic-l4', name: 'MIC-L4 Red Crossroads', type: 'lagrange', parent: 'stanton', corridor: 'crusader-nyx-corridor', corridorPosition: 6 },

  // --- MicroTech Lagrange Points (local to MicroTech, not in corridors) ---
  'mic-l1': { id: 'mic-l1', name: 'MIC-L1 Shallow Frontier', type: 'lagrange', parent: 'microtech' },
  'mic-l2': { id: 'mic-l2', name: 'MIC-L2 Long Forest', type: 'lagrange', parent: 'microtech' },

  // --- ArcCorp Locations ---
  'area-18': { id: 'area-18', name: 'Area 18', type: 'city', parent: 'arccorp' },
  'baijini-point': { id: 'baijini-point', name: 'Baijini Point', type: 'station', parent: 'arccorp' },

  // --- Lyria Locations ---
  'humbolt-mines': { id: 'humbolt-mines', name: 'Humbolt Mines', type: 'outpost', parent: 'lyria' },
  'loveridge-mineral-reserve': { id: 'loveridge-mineral-reserve', name: 'Loveridge Mineral Reserve', type: 'outpost', parent: 'lyria' },
  'shubin-sal-2': { id: 'shubin-sal-2', name: 'Shubin Mining Facility SAL-2', type: 'outpost', parent: 'lyria' },
  'shubin-sal-5': { id: 'shubin-sal-5', name: 'Shubin Mining Facility SAL-5', type: 'outpost', parent: 'lyria' },

  // --- Wala Locations ---
  'arccorp-045': { id: 'arccorp-045', name: 'ArcCorp Mining Area 045', type: 'outpost', parent: 'wala' },
  'arccorp-048': { id: 'arccorp-048', name: 'ArcCorp Mining Area 048', type: 'outpost', parent: 'wala' },
  'arccorp-056': { id: 'arccorp-056', name: 'ArcCorp Mining Area 056', type: 'outpost', parent: 'wala' },
  'arccorp-061': { id: 'arccorp-061', name: 'ArcCorp Mining Area 061', type: 'outpost', parent: 'wala' },
  'samson-sons': { id: 'samson-sons', name: 'Samson & Sons Salvage', type: 'outpost', parent: 'wala' },
  'shady-glen': { id: 'shady-glen', name: 'Shady Glen Farms', type: 'outpost', parent: 'wala' },

  // --- Crusader Locations ---
  'orison': { id: 'orison', name: 'Orison', type: 'city', parent: 'crusader' },
  'port-olisar': { id: 'port-olisar', name: 'Remember Port Olisar <3', type: 'station', parent: 'crusader' },
  'seraphim-station': { id: 'seraphim-station', name: 'Seraphim Station', type: 'station', parent: 'crusader' },

  // --- Cellin Locations ---
  'gallete-farms': { id: 'gallete-farms', name: 'Gallete Family Farms', type: 'outpost', parent: 'cellin' },
  'hickes-research': { id: 'hickes-research', name: 'Hickes Research Outpost', type: 'outpost', parent: 'cellin' },
  'terra-mills': { id: 'terra-mills', name: 'Terra Mills HydroFarm', type: 'outpost', parent: 'cellin' },
  'tram-myers': { id: 'tram-myers', name: 'Tram & Myers Mining', type: 'outpost', parent: 'cellin' },

  // --- Yela Locations ---
  'arccorp-157': { id: 'arccorp-157', name: 'ArcCorp Mining Area 157', type: 'outpost', parent: 'yela' },
  'benson-mining': { id: 'benson-mining', name: 'Benson Mining Outpost', type: 'outpost', parent: 'yela' },
  'deakins-research': { id: 'deakins-research', name: 'Deakins Research Outpost', type: 'outpost', parent: 'yela' },
  'grim-hex': { id: 'grim-hex', name: 'Grim HEX', type: 'station', parent: 'yela' },

  // --- Daymar Locations ---
  'arccorp-141': { id: 'arccorp-141', name: 'ArcCorp Mining Area 141', type: 'outpost', parent: 'daymar' },
  'bountiful-harvest': { id: 'bountiful-harvest', name: 'Bountiful Harvest Hyroponics', type: 'outpost', parent: 'daymar' },
  'brios-breaker': { id: 'brios-breaker', name: "Brio's Breaker Yard", type: 'outpost', parent: 'daymar' },
  'kudre-ore': { id: 'kudre-ore', name: 'Kudre Ore', type: 'outpost', parent: 'daymar' },
  'nuen-waste': { id: 'nuen-waste', name: 'Nuen Waste Management', type: 'outpost', parent: 'daymar' },
  'shubin-scd-1': { id: 'shubin-scd-1', name: 'Shubin Mining Facility SCD-1', type: 'outpost', parent: 'daymar' },

  // --- Hurston Locations ---
  'dupree-industrial': { id: 'dupree-industrial', name: 'Dupree Industrial', type: 'outpost', parent: 'hurston' },
  'everus-harbor': { id: 'everus-harbor', name: 'Everus Harbor', type: 'station', parent: 'hurston' },
  'greycat-complex-b': { id: 'greycat-complex-b', name: 'Greycat Complex-B', type: 'outpost', parent: 'hurston' },
  'hdms-edmond': { id: 'hdms-edmond', name: 'HDMS-Edmond', type: 'outpost', parent: 'hurston' },
  'hdms-hadley': { id: 'hdms-hadley', name: 'HDMS-Hadley', type: 'outpost', parent: 'hurston' },
  'hdms-oparei': { id: 'hdms-oparei', name: 'HDMS-Oparei', type: 'outpost', parent: 'hurston' },
  'hdms-pinewood': { id: 'hdms-pinewood', name: 'HDMS-Pinewood', type: 'outpost', parent: 'hurston' },
  'hdms-stanhope': { id: 'hdms-stanhope', name: 'HDMS-Stanhope', type: 'outpost', parent: 'hurston' },
  'hdms-thedus': { id: 'hdms-thedus', name: 'HDMS-Thedus', type: 'outpost', parent: 'hurston' },
  'hdpc-cassillo': { id: 'hdpc-cassillo', name: 'HDPC-Cassillo', type: 'outpost', parent: 'hurston' },
  'hdpc-farnesway': { id: 'hdpc-farnesway', name: 'HDPC-Farnesway', type: 'outpost', parent: 'hurston' },
  'lorville': { id: 'lorville', name: 'Lorville', type: 'city', parent: 'hurston' },
  'reclamation-orinth': { id: 'reclamation-orinth', name: 'Reclamation & Disposal Orinth', type: 'outpost', parent: 'hurston' },
  'sakura-sun-magnolia': { id: 'sakura-sun-magnolia', name: 'Sakura Sun Magnolia', type: 'outpost', parent: 'hurston' },

  // --- Aberdeen Locations ---
  'hdms-anderson': { id: 'hdms-anderson', name: 'HDMS-Anderson', type: 'outpost', parent: 'aberdeen' },
  'hdms-norgaard': { id: 'hdms-norgaard', name: 'HDMS-Norgaard', type: 'outpost', parent: 'aberdeen' },

  // --- Arial Locations ---
  'hdms-bezdek': { id: 'hdms-bezdek', name: 'HDMS-Bezdek', type: 'outpost', parent: 'arial' },
  'hdms-lathan': { id: 'hdms-lathan', name: 'HDMS-Lathan', type: 'outpost', parent: 'arial' },

  // --- Magda Locations ---
  'hdms-hahn': { id: 'hdms-hahn', name: 'HDMS-Hahn', type: 'outpost', parent: 'magda' },
  'hdms-pearlman': { id: 'hdms-pearlman', name: 'HDMS-Pearlman', type: 'outpost', parent: 'magda' },

  // --- Ita Locations ---
  'hdms-ryder': { id: 'hdms-ryder', name: 'HDMS-Ryder', type: 'outpost', parent: 'ita' },
  'hdms-woodruff': { id: 'hdms-woodruff', name: 'HDMS-Woodruff', type: 'outpost', parent: 'ita' },

  // --- MicroTech Locations ---
  'covalex-s4dc05': { id: 'covalex-s4dc05', name: 'Covalex S4DC05', type: 'outpost', parent: 'microtech' },
  'cry-astro-19-02': { id: 'cry-astro-19-02', name: 'Cry-Astro 19-02', type: 'station', parent: 'microtech' },
  'cry-astro-34-12': { id: 'cry-astro-34-12', name: 'Cry-Astro 34-12', type: 'station', parent: 'microtech' },
  'greycat-complex-a': { id: 'greycat-complex-a', name: 'Greycat Complex A', type: 'outpost', parent: 'microtech' },
  'microtech-s4ld01': { id: 'microtech-s4ld01', name: 'MicroTech S4LD01', type: 'outpost', parent: 'microtech' },
  'microtech-s4ld13': { id: 'microtech-s4ld13', name: 'MicroTech S4LD13', type: 'outpost', parent: 'microtech' },
  'new-babbage': { id: 'new-babbage', name: 'New Babbage', type: 'city', parent: 'microtech' },
  'port-tressler': { id: 'port-tressler', name: 'Port Tressler', type: 'station', parent: 'microtech' },
  'rayari-deltana': { id: 'rayari-deltana', name: 'Rayari Deltana', type: 'outpost', parent: 'microtech' },
  'sakura-sun-goldenrod': { id: 'sakura-sun-goldenrod', name: 'Sakura Sun Goldenrod', type: 'outpost', parent: 'microtech' },
  'shubin-smo-10': { id: 'shubin-smo-10', name: 'Shubin SMO-10', type: 'outpost', parent: 'microtech' },
  'shubin-smo-13': { id: 'shubin-smo-13', name: 'Shubin SMO-13', type: 'outpost', parent: 'microtech' },
  'shubin-smo-18': { id: 'shubin-smo-18', name: 'Shubin SMO-18', type: 'outpost', parent: 'microtech' },
  'shubin-smo-22': { id: 'shubin-smo-22', name: 'Shubin SMO-22', type: 'outpost', parent: 'microtech' },

  // --- Caliope Locations ---
  'rayari-anvik': { id: 'rayari-anvik', name: 'Rayari Anvik', type: 'outpost', parent: 'caliope' },
  'rayari-kaltag': { id: 'rayari-kaltag', name: 'Rayari Kaltag', type: 'outpost', parent: 'caliope' },
  'shubin-smca-6': { id: 'shubin-smca-6', name: 'Shubin SMCa-6', type: 'outpost', parent: 'caliope' },
  'shubin-smca-8': { id: 'shubin-smca-8', name: 'Shubin SMCa-8', type: 'outpost', parent: 'caliope' },

  // --- Clio Locations ---
  'rayari-cantwell': { id: 'rayari-cantwell', name: 'Rayari Cantwell', type: 'outpost', parent: 'clio' },
  'rayari-mcgrath': { id: 'rayari-mcgrath', name: 'Rayari McGrath', type: 'outpost', parent: 'clio' },

  // --- Euterpe Locations ---
  'buds-growery': { id: 'buds-growery', name: "Bud's Growery", type: 'outpost', parent: 'euterpe' },
  'devlin-scrap': { id: 'devlin-scrap', name: 'Devlin Scrap & Salvage', type: 'outpost', parent: 'euterpe' },

  // ===========================================
  // NYX SYSTEM
  // ===========================================

  // --- Nyx Planets ---
  'delamar': { id: 'delamar', name: 'Delamar', type: 'planet', parent: 'nyx' },

  // --- Nyx Gateway Stations ---
  'pyro-gateway-nyx': { id: 'pyro-gateway-nyx', name: 'Pyro Gateway - Nyx', type: 'station', parent: 'nyx' },
  'stanton-gateway-nyx': { id: 'stanton-gateway-nyx', name: 'Stanton Gateway - Nyx', type: 'station', parent: 'nyx' },

  // --- Delamar Locations ---
  'levski': { id: 'levski', name: 'Levski', type: 'city', parent: 'delamar' },

  // ===========================================
  // PYRO SYSTEM
  // ===========================================

  // --- Pyro Planets ---
  'pyro-i': { id: 'pyro-i', name: 'Pyro I', type: 'planet', parent: 'pyro' },
  'pyro-iv': { id: 'pyro-iv', name: 'Pyro IV', type: 'planet', parent: 'pyro' },
  'pyro-v': { id: 'pyro-v', name: 'Pyro V', type: 'planet', parent: 'pyro' },
  'terminus': { id: 'terminus', name: 'Terminus', type: 'planet', parent: 'pyro' },

  // --- Pyro Moons ---
  'monox': { id: 'monox', name: 'Monox', type: 'moon', parent: 'pyro-i' },
  'bloom': { id: 'bloom', name: 'Bloom', type: 'moon', parent: 'pyro-i' },
  'ignis': { id: 'ignis', name: 'Ignis', type: 'moon', parent: 'pyro-v' },
  'vatra': { id: 'vatra', name: 'Vatra', type: 'moon', parent: 'pyro-v' },
  'adir': { id: 'adir', name: 'Adir', type: 'moon', parent: 'pyro-v' },
  'fairo': { id: 'fairo', name: 'Fairo', type: 'moon', parent: 'pyro-v' },

  // --- Pyro Gateway Stations ---
  'stanton-gateway-pyro': { id: 'stanton-gateway-pyro', name: 'Stanton Gateway - Pyro', type: 'station', parent: 'pyro' },
  'nyx-gateway-pyro': { id: 'nyx-gateway-pyro', name: 'Nyx Gateway - Pyro', type: 'station', parent: 'pyro' },

  // --- Pyro I Locations ---
  'gray-gardens': { id: 'gray-gardens', name: 'Gray Gardens Depot', type: 'outpost', parent: 'pyro-i' },
  'outpost-10q-yk': { id: 'outpost-10q-yk', name: 'Outpost 10Q-YK', type: 'outpost', parent: 'pyro-i' },
  'rustville': { id: 'rustville', name: 'Rustville', type: 'outpost', parent: 'pyro-i' },
  'stags-rut': { id: 'stags-rut', name: "Stag's Rut", type: 'outpost', parent: 'pyro-i' },

  // --- Monox Locations ---
  'arid-reach': { id: 'arid-reach', name: 'Arid Reach', type: 'outpost', parent: 'monox' },
  'jacksons-swap': { id: 'jacksons-swap', name: "Jackson's Swap", type: 'outpost', parent: 'monox' },
  'last-ditch': { id: 'last-ditch', name: 'Last Ditch', type: 'outpost', parent: 'monox' },
  'slowburn-depot': { id: 'slowburn-depot', name: 'Slowburn Depot', type: 'outpost', parent: 'monox' },
  'sunset-mesa': { id: 'sunset-mesa', name: 'Sunset Mesa', type: 'outpost', parent: 'monox' },
  'yangs-place': { id: 'yangs-place', name: "Yang's Place", type: 'outpost', parent: 'monox' },

  // --- Bloom Locations ---
  'bueno-ravine': { id: 'bueno-ravine', name: 'Bueno Ravine', type: 'outpost', parent: 'bloom' },
  'carvers-ridge': { id: 'carvers-ridge', name: "Carver's Ridge", type: 'outpost', parent: 'bloom' },
  'frigid-knot': { id: 'frigid-knot', name: 'Frigid Knot', type: 'outpost', parent: 'bloom' },
  'orbituary': { id: 'orbituary', name: 'Orbituary', type: 'outpost', parent: 'bloom' },
  'prospect-depot': { id: 'prospect-depot', name: 'Prospect Depot', type: 'outpost', parent: 'bloom' },
  'shadowfall': { id: 'shadowfall', name: 'Shadowfall', type: 'outpost', parent: 'bloom' },
  'shepherds-rest': { id: 'shepherds-rest', name: "Shepherd's Rest", type: 'outpost', parent: 'bloom' },
  'golden-riviera': { id: 'golden-riviera', name: 'The Golden Riviera', type: 'outpost', parent: 'bloom' },
  'the-yard': { id: 'the-yard', name: 'The Yard', type: 'outpost', parent: 'bloom' },
  'windfall': { id: 'windfall', name: 'Windfall', type: 'outpost', parent: 'bloom' },

  // --- Pyro IV Locations ---
  'chawlas-beach': { id: 'chawlas-beach', name: "Chawla's Beach", type: 'outpost', parent: 'pyro-iv' },
  'dingers-depot': { id: 'dingers-depot', name: "Dinger's Depot", type: 'outpost', parent: 'pyro-iv' },
  'fallow-field': { id: 'fallow-field', name: 'Fallow Field', type: 'outpost', parent: 'pyro-iv' },
  'goners-deal': { id: 'goners-deal', name: "Goner's Deal", type: 'outpost', parent: 'pyro-iv' },
  'sacrens-plot': { id: 'sacrens-plot', name: "Sacren's Plot", type: 'outpost', parent: 'pyro-iv' },

  // --- Ignis Locations ---
  'ashland': { id: 'ashland', name: 'Ashland', type: 'outpost', parent: 'ignis' },
  'kabirs-post': { id: 'kabirs-post', name: "Kabir's Post", type: 'outpost', parent: 'ignis' },

  // --- Vatra Locations ---
  'seers-canyon': { id: 'seers-canyon', name: "Seer's Canyon", type: 'outpost', parent: 'vatra' },

  // --- Adir Locations ---
  'outpost-12r': { id: 'outpost-12r', name: 'Outpost 12R', type: 'outpost', parent: 'adir' },
  'prophets-peak': { id: 'prophets-peak', name: "Prophet's Peak", type: 'outpost', parent: 'adir' },

  // --- Fairo Locations ---
  'feo-canyon-depot': { id: 'feo-canyon-depot', name: 'FEO Canyon Depot', type: 'outpost', parent: 'fairo' },
  'outpost-08p': { id: 'outpost-08p', name: 'Outpost 08P', type: 'outpost', parent: 'fairo' },

  // --- Terminus Locations ---
  'blackrock-exchange': { id: 'blackrock-exchange', name: 'Blackrock Exchange', type: 'outpost', parent: 'terminus' },
  'bullocks-reach': { id: 'bullocks-reach', name: "Bullock's Reach", type: 'outpost', parent: 'terminus' },
  'canard-view': { id: 'canard-view', name: 'Canard View', type: 'outpost', parent: 'terminus' },
  'kinder-plots': { id: 'kinder-plots', name: 'Kinder Plots', type: 'outpost', parent: 'terminus' },
  'last-landings': { id: 'last-landings', name: 'Last Landings', type: 'outpost', parent: 'terminus' },
  'outpost-56l': { id: 'outpost-56l', name: 'Outpost 56L', type: 'outpost', parent: 'terminus' },
  'rough-landing': { id: 'rough-landing', name: 'Rough Landing', type: 'outpost', parent: 'terminus' },
  'ruin-station': { id: 'ruin-station', name: 'Ruin Station', type: 'station', parent: 'terminus' },
  'scarpers-turn': { id: 'scarpers-turn', name: "Scarper's Turn", type: 'outpost', parent: 'terminus' },
  'stonetree': { id: 'stonetree', name: 'Stonetree', type: 'outpost', parent: 'terminus' },
  'watchers-depot': { id: 'watchers-depot', name: "Watcher's Depot", type: 'outpost', parent: 'terminus' },

  // --- Pyro Lagrange Points ---
  'checkmate-station': { id: 'checkmate-station', name: 'Checkmate Station', type: 'lagrange', parent: 'pyro' },
  'starlight-service': { id: 'starlight-service', name: 'Starlight Service Station', type: 'lagrange', parent: 'pyro' },
  'patch-city': { id: 'patch-city', name: 'Patch City', type: 'lagrange', parent: 'pyro' },
  'endgame': { id: 'endgame', name: 'Endgame', type: 'lagrange', parent: 'pyro' },
  'dudley-daughters': { id: 'dudley-daughters', name: 'Dudley & Daughters', type: 'lagrange', parent: 'pyro' },
  'megumi-refueling': { id: 'megumi-refueling', name: 'Megumi Refueling', type: 'lagrange', parent: 'pyro' },
};

// Build lookup table: lowercase display name -> node id
const NAME_TO_ID: Record<string, string> = {};
Object.values(LOCATION_GRAPH).forEach(node => {
  NAME_TO_ID[node.name.toLowerCase()] = node.id;
});

/**
 * Get node ID from display name
 */
export function getLocationId(displayName: string): string | null {
  if (!displayName) return null;
  const normalized = displayName.trim().toLowerCase();
  return NAME_TO_ID[normalized] || null;
}

/**
 * Find the nearest ancestor of a specific type
 */
function getAncestorOfType(nodeId: string, ancestorType: LocationType): string | null {
  let current = LOCATION_GRAPH[nodeId];
  while (current) {
    if (current.type === ancestorType) return current.id;
    if (!current.parent) break;
    current = LOCATION_GRAPH[current.parent];
  }
  return null;
}

/**
 * Check if two locations share a common ancestor of given type
 */
function sharesAncestor(idA: string, idB: string, ancestorType: LocationType): boolean {
  const ancestorA = getAncestorOfType(idA, ancestorType);
  const ancestorB = getAncestorOfType(idB, ancestorType);
  return !!(ancestorA && ancestorB && ancestorA === ancestorB);
}

// Corridor start planets (position 0 of each corridor)
const CORRIDOR_STARTS: Record<string, string> = {
  'hurston-terra-corridor': 'hurston',
  'arccorp-pyro-corridor': 'arccorp',
  'crusader-nyx-corridor': 'crusader',
};

// Corridor end systems (where the gateway leads)
const CORRIDOR_DESTINATIONS: Record<string, string> = {
  'hurston-terra-corridor': 'terra', // Not implemented yet
  'arccorp-pyro-corridor': 'pyro',
  'crusader-nyx-corridor': 'nyx',
};

/**
 * Travel cost tiers:
 * - 0: Same location
 * - 10-70: Same corridor (10 per position step)
 * - 10: Same moon or same planet (local travel)
 * - 50: Different corridors in same system
 * - 100: Same system, different planets (interplanetary)
 * - 1000: Different systems (interstellar)
 */
export function travelCost(locationA: string, locationB: string): number {
  const idA = getLocationId(locationA);
  const idB = getLocationId(locationB);

  // Unknown locations - default to interplanetary
  if (!idA || !idB) {
    return 100;
  }

  // Same location
  if (idA === idB) return 0;

  const nodeA = LOCATION_GRAPH[idA];
  const nodeB = LOCATION_GRAPH[idB];

  // Both in same corridor - cost based on position difference
  if (nodeA.corridor && nodeB.corridor && nodeA.corridor === nodeB.corridor) {
    const posA = nodeA.corridorPosition ?? 0;
    const posB = nodeB.corridorPosition ?? 0;
    return Math.abs(posA - posB) * 10;
  }

  // One is in a corridor, the other might be the corridor's start planet
  if (nodeA.corridor || nodeB.corridor) {
    const corridorNode = nodeA.corridor ? nodeA : nodeB;
    const otherNode = nodeA.corridor ? nodeB : nodeA;
    const corridor = corridorNode.corridor!;
    const startPlanet = CORRIDOR_STARTS[corridor];

    // If the other location is the start planet of this corridor
    if (otherNode.id === startPlanet || getAncestorOfType(otherNode.id, 'planet') === startPlanet) {
      const corridorPos = corridorNode.corridorPosition ?? 0;
      return corridorPos * 10;
    }

    // If traveling to the gateway's destination system
    const destSystem = CORRIDOR_DESTINATIONS[corridor];
    if (destSystem && getAncestorOfType(otherNode.id, 'system') === destSystem) {
      // Cost = distance to gateway (7 - position) + small jump cost
      const corridorPos = corridorNode.corridorPosition ?? 0;
      return (7 - corridorPos) * 10 + 50;
    }

    // Different corridors or planet not on this corridor
    if (nodeA.corridor && nodeB.corridor && nodeA.corridor !== nodeB.corridor) {
      // Cross-corridor travel: expensive
      return 80;
    }

    // From corridor to unrelated planet
    return 100;
  }

  // Same moon (local travel)
  if (sharesAncestor(idA, idB, 'moon')) return 10;

  // Same planet (local travel)
  if (sharesAncestor(idA, idB, 'planet')) return 10;

  // Same system (interplanetary)
  if (sharesAncestor(idA, idB, 'system')) return 100;

  // Different systems (interstellar)
  return 1000;
}

/**
 * Get the system a location belongs to
 */
export function getSystem(location: string): string | null {
  const id = getLocationId(location);
  if (!id) return null;
  return getAncestorOfType(id, 'system');
}

/**
 * Get the planet a location belongs to (or itself if it is a planet)
 */
export function getPlanet(location: string): string | null {
  const id = getLocationId(location);
  if (!id) return null;
  return getAncestorOfType(id, 'planet');
}
