// Location Graph - Hierarchical Universe Model with Polar Coordinate Routing
// Enables distance calculations using sector (1-8 compass) and orbit (0-10 distance from star)
//
// POLAR COORDINATE SYSTEM:
// - Sector: 1=N, 2=NE, 3=E, 4=SE, 5=S, 6=SW, 7=W, 8=NW
// - Orbit: 0=star, 10=outer edge (gateways typically at high orbit values)
//
// Travel cost = sectorDiff * 15 + orbitDiff * 5
// Where sectorDiff = min(|s1-s2|, 8-|s1-s2|) for circular distance

export type LocationType = 'system' | 'planet' | 'moon' | 'station' | 'city' | 'outpost' | 'lagrange' | 'gateway';

export interface LocationNode {
  id: string;
  name: string;
  type: LocationType;
  parent: string | null;
  sector?: number;  // 1-8 compass direction (N=1, NE=2, E=3, SE=4, S=5, SW=6, W=7, NW=8)
  orbit?: number;   // 0-10 distance from star (0=star, 10=outer edge)
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
  'arccorp': { id: 'arccorp', name: 'ArcCorp', type: 'planet', parent: 'stanton', sector: 4, orbit: 4 },
  'crusader': { id: 'crusader', name: 'Crusader', type: 'planet', parent: 'stanton', sector: 7, orbit: 3 },
  'hurston': { id: 'hurston', name: 'Hurston', type: 'planet', parent: 'stanton', sector: 3, orbit: 2 },
  'microtech': { id: 'microtech', name: 'MicroTech', type: 'planet', parent: 'stanton', sector: 2, orbit: 6 },

  // --- ArcCorp Moons (inherit from ArcCorp: SE, 4) ---
  'lyria': { id: 'lyria', name: 'Lyria', type: 'moon', parent: 'arccorp', sector: 4, orbit: 4 },
  'wala': { id: 'wala', name: 'Wala', type: 'moon', parent: 'arccorp', sector: 4, orbit: 4 },

  // --- Crusader Moons (inherit from Crusader: W, 3) ---
  'cellin': { id: 'cellin', name: 'Cellin', type: 'moon', parent: 'crusader', sector: 7, orbit: 3 },
  'yela': { id: 'yela', name: 'Yela', type: 'moon', parent: 'crusader', sector: 7, orbit: 3 },
  'daymar': { id: 'daymar', name: 'Daymar', type: 'moon', parent: 'crusader', sector: 7, orbit: 3 },

  // --- Hurston Moons (inherit from Hurston: E, 2) ---
  'aberdeen': { id: 'aberdeen', name: 'Aberdeen', type: 'moon', parent: 'hurston', sector: 3, orbit: 2 },
  'arial': { id: 'arial', name: 'Arial', type: 'moon', parent: 'hurston', sector: 3, orbit: 2 },
  'magda': { id: 'magda', name: 'Magda', type: 'moon', parent: 'hurston', sector: 3, orbit: 2 },
  'ita': { id: 'ita', name: 'Ita', type: 'moon', parent: 'hurston', sector: 3, orbit: 2 },

  // --- MicroTech Moons (inherit from MicroTech: NE, 6) ---
  'caliope': { id: 'caliope', name: 'Caliope', type: 'moon', parent: 'microtech', sector: 2, orbit: 6 },
  'clio': { id: 'clio', name: 'Clio', type: 'moon', parent: 'microtech', sector: 2, orbit: 6 },
  'euterpe': { id: 'euterpe', name: 'Euterpe', type: 'moon', parent: 'microtech', sector: 2, orbit: 6 },

  // --- Stanton Gateways ---
  'terra-gateway': { id: 'terra-gateway', name: 'Terra Gateway', type: 'gateway', parent: 'stanton', sector: 3, orbit: 7 },
  'pyro-gateway-stanton': { id: 'pyro-gateway-stanton', name: 'Pyro Gateway', type: 'gateway', parent: 'stanton', sector: 5, orbit: 4 },
  'nyx-gateway-stanton': { id: 'nyx-gateway-stanton', name: 'Nyx Gateway', type: 'gateway', parent: 'stanton', sector: 8, orbit: 10 },

  // --- Hurston Lagrange Points ---
  'hur-l1': { id: 'hur-l1', name: 'HUR-L1 Green Glade', type: 'lagrange', parent: 'stanton', sector: 3, orbit: 1 },
  'hur-l2': { id: 'hur-l2', name: 'HUR-L2 Faithful Dream', type: 'lagrange', parent: 'stanton', sector: 3, orbit: 2 },
  'hur-l3': { id: 'hur-l3', name: 'HUR-L3 Thundering Express', type: 'lagrange', parent: 'stanton', sector: 7, orbit: 2 },
  'hur-l4': { id: 'hur-l4', name: 'HUR-L4 Melodic Fields', type: 'lagrange', parent: 'stanton', sector: 2, orbit: 2 },
  'hur-l5': { id: 'hur-l5', name: 'HUR-L5 High Course', type: 'lagrange', parent: 'stanton', sector: 4, orbit: 2 },

  // --- Crusader Lagrange Points (no CRU-L3 - doesn't exist in game) ---
  'cru-l1': { id: 'cru-l1', name: 'CRU-L1 Ambitious Dream', type: 'lagrange', parent: 'stanton', sector: 7, orbit: 3 },
  'cru-l2': { id: 'cru-l2', name: 'CRU-L2', type: 'lagrange', parent: 'stanton', sector: 7, orbit: 3 },
  'cru-l4': { id: 'cru-l4', name: 'CRU-L4 Shallow Fields', type: 'lagrange', parent: 'stanton', sector: 6, orbit: 3 },
  'cru-l5': { id: 'cru-l5', name: 'CRU-L5 Beautiful Glen', type: 'lagrange', parent: 'stanton', sector: 8, orbit: 3 },

  // --- ArcCorp Lagrange Points ---
  'arc-l1': { id: 'arc-l1', name: 'ARC-L1 Wide Forest', type: 'lagrange', parent: 'stanton', sector: 4, orbit: 4 },
  'arc-l2': { id: 'arc-l2', name: 'ARC-L2', type: 'lagrange', parent: 'stanton', sector: 4, orbit: 5 },
  'arc-l3': { id: 'arc-l3', name: 'ARC-L3 Modern Express', type: 'lagrange', parent: 'stanton', sector: 8, orbit: 4 },
  'arc-l4': { id: 'arc-l4', name: 'ARC-L4 Feint Glen', type: 'lagrange', parent: 'stanton', sector: 3, orbit: 4 },
  'arc-l5': { id: 'arc-l5', name: 'ARC-L5 Yellow Core', type: 'lagrange', parent: 'stanton', sector: 6, orbit: 4 },

  // --- MicroTech Lagrange Points ---
  'mic-l1': { id: 'mic-l1', name: 'MIC-L1 Shallow Frontier', type: 'lagrange', parent: 'stanton', sector: 2, orbit: 5 },
  'mic-l2': { id: 'mic-l2', name: 'MIC-L2 Long Forest', type: 'lagrange', parent: 'stanton', sector: 2, orbit: 6 },
  'mic-l3': { id: 'mic-l3', name: 'MIC-L3 Endless Odyssey', type: 'lagrange', parent: 'stanton', sector: 6, orbit: 6 },
  'mic-l4': { id: 'mic-l4', name: 'MIC-L4 Red Crossroads', type: 'lagrange', parent: 'stanton', sector: 1, orbit: 6 },
  'mic-l5': { id: 'mic-l5', name: 'MIC-L5 Modern Icarus', type: 'lagrange', parent: 'stanton', sector: 3, orbit: 6 },

  // --- ArcCorp Locations ---
  'area-18': { id: 'area-18', name: 'Area 18', type: 'city', parent: 'arccorp', sector: 4, orbit: 4 },
  'baijini-point': { id: 'baijini-point', name: 'Baijini Point', type: 'station', parent: 'arccorp', sector: 4, orbit: 4 },

  // --- Lyria Locations ---
  'humbolt-mines': { id: 'humbolt-mines', name: 'Humbolt Mines', type: 'outpost', parent: 'lyria', sector: 4, orbit: 4 },
  'loveridge-mineral-reserve': { id: 'loveridge-mineral-reserve', name: 'Loveridge Mineral Reserve', type: 'outpost', parent: 'lyria', sector: 4, orbit: 4 },
  'shubin-sal-2': { id: 'shubin-sal-2', name: 'Shubin Mining Facility SAL-2', type: 'outpost', parent: 'lyria', sector: 4, orbit: 4 },
  'shubin-sal-5': { id: 'shubin-sal-5', name: 'Shubin Mining Facility SAL-5', type: 'outpost', parent: 'lyria', sector: 4, orbit: 4 },

  // --- Wala Locations ---
  'arccorp-045': { id: 'arccorp-045', name: 'ArcCorp Mining Area 045', type: 'outpost', parent: 'wala', sector: 4, orbit: 4 },
  'arccorp-048': { id: 'arccorp-048', name: 'ArcCorp Mining Area 048', type: 'outpost', parent: 'wala', sector: 4, orbit: 4 },
  'arccorp-056': { id: 'arccorp-056', name: 'ArcCorp Mining Area 056', type: 'outpost', parent: 'wala', sector: 4, orbit: 4 },
  'arccorp-061': { id: 'arccorp-061', name: 'ArcCorp Mining Area 061', type: 'outpost', parent: 'wala', sector: 4, orbit: 4 },
  'samson-sons': { id: 'samson-sons', name: 'Samson & Sons Salvage', type: 'outpost', parent: 'wala', sector: 4, orbit: 4 },
  'shady-glen': { id: 'shady-glen', name: 'Shady Glen Farms', type: 'outpost', parent: 'wala', sector: 4, orbit: 4 },

  // --- Crusader Locations ---
  'orison': { id: 'orison', name: 'Orison', type: 'city', parent: 'crusader', sector: 7, orbit: 3 },
  'port-olisar': { id: 'port-olisar', name: 'Port Olisar', type: 'station', parent: 'crusader', sector: 7, orbit: 3 },
  'seraphim-station': { id: 'seraphim-station', name: 'Seraphim Station', type: 'station', parent: 'crusader', sector: 7, orbit: 3 },

  // --- Cellin Locations ---
  'gallete-farms': { id: 'gallete-farms', name: 'Gallete Family Farms', type: 'outpost', parent: 'cellin', sector: 7, orbit: 3 },
  'hickes-research': { id: 'hickes-research', name: 'Hickes Research Outpost', type: 'outpost', parent: 'cellin', sector: 7, orbit: 3 },
  'terra-mills': { id: 'terra-mills', name: 'Terra Mills HydroFarm', type: 'outpost', parent: 'cellin', sector: 7, orbit: 3 },
  'tram-myers': { id: 'tram-myers', name: 'Tram & Myers Mining', type: 'outpost', parent: 'cellin', sector: 7, orbit: 3 },

  // --- Yela Locations ---
  'arccorp-157': { id: 'arccorp-157', name: 'ArcCorp Mining Area 157', type: 'outpost', parent: 'yela', sector: 7, orbit: 3 },
  'benson-mining': { id: 'benson-mining', name: 'Benson Mining Outpost', type: 'outpost', parent: 'yela', sector: 7, orbit: 3 },
  'deakins-research': { id: 'deakins-research', name: 'Deakins Research Outpost', type: 'outpost', parent: 'yela', sector: 7, orbit: 3 },
  'grim-hex': { id: 'grim-hex', name: 'Grim HEX', type: 'station', parent: 'yela', sector: 7, orbit: 3 },

  // --- Daymar Locations ---
  'arccorp-141': { id: 'arccorp-141', name: 'ArcCorp Mining Area 141', type: 'outpost', parent: 'daymar', sector: 7, orbit: 3 },
  'bountiful-harvest': { id: 'bountiful-harvest', name: 'Bountiful Harvest Hyroponics', type: 'outpost', parent: 'daymar', sector: 7, orbit: 3 },
  'brios-breaker': { id: 'brios-breaker', name: "Brio's Breaker Yard", type: 'outpost', parent: 'daymar', sector: 7, orbit: 3 },
  'kudre-ore': { id: 'kudre-ore', name: 'Kudre Ore', type: 'outpost', parent: 'daymar', sector: 7, orbit: 3 },
  'nuen-waste': { id: 'nuen-waste', name: 'Nuen Waste Management', type: 'outpost', parent: 'daymar', sector: 7, orbit: 3 },
  'shubin-scd-1': { id: 'shubin-scd-1', name: 'Shubin Mining Facility SCD-1', type: 'outpost', parent: 'daymar', sector: 7, orbit: 3 },

  // --- Hurston Locations ---
  'dupree-industrial': { id: 'dupree-industrial', name: 'Dupree Industrial', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'everus-harbor': { id: 'everus-harbor', name: 'Everus Harbor', type: 'station', parent: 'hurston', sector: 3, orbit: 2 },
  'greycat-complex-b': { id: 'greycat-complex-b', name: 'Greycat Complex-B', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdms-edmond': { id: 'hdms-edmond', name: 'HDMS-Edmond', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdms-hadley': { id: 'hdms-hadley', name: 'HDMS-Hadley', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdms-oparei': { id: 'hdms-oparei', name: 'HDMS-Oparei', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdms-pinewood': { id: 'hdms-pinewood', name: 'HDMS-Pinewood', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdms-stanhope': { id: 'hdms-stanhope', name: 'HDMS-Stanhope', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdms-thedus': { id: 'hdms-thedus', name: 'HDMS-Thedus', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdpc-cassillo': { id: 'hdpc-cassillo', name: 'HDPC-Cassillo', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'hdpc-farnesway': { id: 'hdpc-farnesway', name: 'HDPC-Farnesway', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'lorville': { id: 'lorville', name: 'Lorville', type: 'city', parent: 'hurston', sector: 3, orbit: 2 },
  'reclamation-orinth': { id: 'reclamation-orinth', name: 'Reclamation & Disposal Orinth', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },
  'sakura-sun-magnolia': { id: 'sakura-sun-magnolia', name: 'Sakura Sun Magnolia', type: 'outpost', parent: 'hurston', sector: 3, orbit: 2 },

  // --- Aberdeen Locations ---
  'hdms-anderson': { id: 'hdms-anderson', name: 'HDMS-Anderson', type: 'outpost', parent: 'aberdeen', sector: 3, orbit: 2 },
  'hdms-norgaard': { id: 'hdms-norgaard', name: 'HDMS-Norgaard', type: 'outpost', parent: 'aberdeen', sector: 3, orbit: 2 },

  // --- Arial Locations ---
  'hdms-bezdek': { id: 'hdms-bezdek', name: 'HDMS-Bezdek', type: 'outpost', parent: 'arial', sector: 3, orbit: 2 },
  'hdms-lathan': { id: 'hdms-lathan', name: 'HDMS-Lathan', type: 'outpost', parent: 'arial', sector: 3, orbit: 2 },

  // --- Magda Locations ---
  'hdms-hahn': { id: 'hdms-hahn', name: 'HDMS-Hahn', type: 'outpost', parent: 'magda', sector: 3, orbit: 2 },
  'hdms-pearlman': { id: 'hdms-pearlman', name: 'HDMS-Pearlman', type: 'outpost', parent: 'magda', sector: 3, orbit: 2 },

  // --- Ita Locations ---
  'hdms-ryder': { id: 'hdms-ryder', name: 'HDMS-Ryder', type: 'outpost', parent: 'ita', sector: 3, orbit: 2 },
  'hdms-woodruff': { id: 'hdms-woodruff', name: 'HDMS-Woodruff', type: 'outpost', parent: 'ita', sector: 3, orbit: 2 },

  // --- MicroTech Locations ---
  'covalex-s4dc05': { id: 'covalex-s4dc05', name: 'Covalex S4DC05', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'cry-astro-19-02': { id: 'cry-astro-19-02', name: 'Cry-Astro 19-02', type: 'station', parent: 'microtech', sector: 2, orbit: 6 },
  'cry-astro-34-12': { id: 'cry-astro-34-12', name: 'Cry-Astro 34-12', type: 'station', parent: 'microtech', sector: 2, orbit: 6 },
  'greycat-complex-a': { id: 'greycat-complex-a', name: 'Greycat Complex A', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'microtech-s4ld01': { id: 'microtech-s4ld01', name: 'MicroTech S4LD01', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'microtech-s4ld13': { id: 'microtech-s4ld13', name: 'MicroTech S4LD13', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'new-babbage': { id: 'new-babbage', name: 'New Babbage', type: 'city', parent: 'microtech', sector: 2, orbit: 6 },
  'port-tressler': { id: 'port-tressler', name: 'Port Tressler', type: 'station', parent: 'microtech', sector: 2, orbit: 6 },
  'rayari-deltana': { id: 'rayari-deltana', name: 'Rayari Deltana', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'sakura-sun-goldenrod': { id: 'sakura-sun-goldenrod', name: 'Sakura Sun Goldenrod', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'shubin-smo-10': { id: 'shubin-smo-10', name: 'Shubin SMO-10', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'shubin-smo-13': { id: 'shubin-smo-13', name: 'Shubin SMO-13', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'shubin-smo-18': { id: 'shubin-smo-18', name: 'Shubin SMO-18', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },
  'shubin-smo-22': { id: 'shubin-smo-22', name: 'Shubin SMO-22', type: 'outpost', parent: 'microtech', sector: 2, orbit: 6 },

  // --- Caliope Locations ---
  'rayari-anvik': { id: 'rayari-anvik', name: 'Rayari Anvik', type: 'outpost', parent: 'caliope', sector: 2, orbit: 6 },
  'rayari-kaltag': { id: 'rayari-kaltag', name: 'Rayari Kaltag', type: 'outpost', parent: 'caliope', sector: 2, orbit: 6 },
  'shubin-smca-6': { id: 'shubin-smca-6', name: 'Shubin SMCa-6', type: 'outpost', parent: 'caliope', sector: 2, orbit: 6 },
  'shubin-smca-8': { id: 'shubin-smca-8', name: 'Shubin SMCa-8', type: 'outpost', parent: 'caliope', sector: 2, orbit: 6 },

  // --- Clio Locations ---
  'rayari-cantwell': { id: 'rayari-cantwell', name: 'Rayari Cantwell', type: 'outpost', parent: 'clio', sector: 2, orbit: 6 },
  'rayari-mcgrath': { id: 'rayari-mcgrath', name: 'Rayari McGrath', type: 'outpost', parent: 'clio', sector: 2, orbit: 6 },

  // --- Euterpe Locations ---
  'buds-growery': { id: 'buds-growery', name: "Bud's Growery", type: 'outpost', parent: 'euterpe', sector: 2, orbit: 6 },
  'devlin-scrap': { id: 'devlin-scrap', name: 'Devlin Scrap & Salvage', type: 'outpost', parent: 'euterpe', sector: 2, orbit: 6 },

  // ===========================================
  // NYX SYSTEM
  // ===========================================

  // --- Nyx Planets ---
  'delamar': { id: 'delamar', name: 'Delamar', type: 'planet', parent: 'nyx', sector: 6, orbit: 6 },

  // --- Nyx Gateway Stations ---
  'pyro-gateway-nyx': { id: 'pyro-gateway-nyx', name: 'Pyro Gateway - Nyx', type: 'gateway', parent: 'nyx', sector: 8, orbit: 10 },
  'stanton-gateway-nyx': { id: 'stanton-gateway-nyx', name: 'Stanton Gateway - Nyx', type: 'gateway', parent: 'nyx', sector: 6, orbit: 10 },

  // --- Delamar Locations ---
  'levski': { id: 'levski', name: 'Levski', type: 'city', parent: 'delamar', sector: 6, orbit: 6 },

  // ===========================================
  // PYRO SYSTEM
  // ===========================================

  // --- Pyro Planets ---
  'pyro-i': { id: 'pyro-i', name: 'Pyro I', type: 'planet', parent: 'pyro', sector: 7, orbit: 3 },
  'pyro-iv': { id: 'pyro-iv', name: 'Pyro IV', type: 'planet', parent: 'pyro', sector: 5, orbit: 5 },
  'pyro-v': { id: 'pyro-v', name: 'Pyro V', type: 'planet', parent: 'pyro', sector: 5, orbit: 6 },
  'terminus': { id: 'terminus', name: 'Terminus', type: 'planet', parent: 'pyro', sector: 8, orbit: 10 },

  // --- Pyro Moons ---
  'monox': { id: 'monox', name: 'Monox', type: 'moon', parent: 'pyro-i', sector: 4, orbit: 2 },
  'bloom': { id: 'bloom', name: 'Bloom', type: 'moon', parent: 'pyro-i', sector: 8, orbit: 4 },
  'ignis': { id: 'ignis', name: 'Ignis', type: 'moon', parent: 'pyro-v', sector: 5, orbit: 6 },
  'vatra': { id: 'vatra', name: 'Vatra', type: 'moon', parent: 'pyro-v', sector: 5, orbit: 6 },
  'adir': { id: 'adir', name: 'Adir', type: 'moon', parent: 'pyro-v', sector: 5, orbit: 6 },
  'fairo': { id: 'fairo', name: 'Fairo', type: 'moon', parent: 'pyro-v', sector: 5, orbit: 6 },

  // --- Pyro Gateway Stations ---
  'stanton-gateway-pyro': { id: 'stanton-gateway-pyro', name: 'Stanton Gateway - Pyro', type: 'gateway', parent: 'pyro', sector: 2, orbit: 7 },
  'nyx-gateway-pyro': { id: 'nyx-gateway-pyro', name: 'Nyx Gateway - Pyro', type: 'gateway', parent: 'pyro', sector: 6, orbit: 7 },

  // --- Pyro I Locations ---
  'gray-gardens': { id: 'gray-gardens', name: 'Gray Gardens Depot', type: 'outpost', parent: 'pyro-i', sector: 7, orbit: 3 },
  'outpost-10q-yk': { id: 'outpost-10q-yk', name: 'Outpost 10Q-YK', type: 'outpost', parent: 'pyro-i', sector: 7, orbit: 3 },
  'rustville': { id: 'rustville', name: 'Rustville', type: 'outpost', parent: 'pyro-i', sector: 7, orbit: 3 },
  'stags-rut': { id: 'stags-rut', name: "Stag's Rut", type: 'outpost', parent: 'pyro-i', sector: 7, orbit: 3 },

  // --- Monox Locations ---
  'arid-reach': { id: 'arid-reach', name: 'Arid Reach', type: 'outpost', parent: 'monox', sector: 4, orbit: 2 },
  'jacksons-swap': { id: 'jacksons-swap', name: "Jackson's Swap", type: 'outpost', parent: 'monox', sector: 4, orbit: 2 },
  'last-ditch': { id: 'last-ditch', name: 'Last Ditch', type: 'outpost', parent: 'monox', sector: 4, orbit: 2 },
  'slowburn-depot': { id: 'slowburn-depot', name: 'Slowburn Depot', type: 'outpost', parent: 'monox', sector: 4, orbit: 2 },
  'sunset-mesa': { id: 'sunset-mesa', name: 'Sunset Mesa', type: 'outpost', parent: 'monox', sector: 4, orbit: 2 },
  'yangs-place': { id: 'yangs-place', name: "Yang's Place", type: 'outpost', parent: 'monox', sector: 4, orbit: 2 },

  // --- Bloom Locations ---
  'bueno-ravine': { id: 'bueno-ravine', name: 'Bueno Ravine', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'carvers-ridge': { id: 'carvers-ridge', name: "Carver's Ridge", type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'frigid-knot': { id: 'frigid-knot', name: 'Frigid Knot', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'orbituary': { id: 'orbituary', name: 'Orbituary', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'prospect-depot': { id: 'prospect-depot', name: 'Prospect Depot', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'shadowfall': { id: 'shadowfall', name: 'Shadowfall', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'shepherds-rest': { id: 'shepherds-rest', name: "Shepherd's Rest", type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'golden-riviera': { id: 'golden-riviera', name: 'The Golden Riviera', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'the-yard': { id: 'the-yard', name: 'The Yard', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },
  'windfall': { id: 'windfall', name: 'Windfall', type: 'outpost', parent: 'bloom', sector: 8, orbit: 4 },

  // --- Pyro IV Locations ---
  'chawlas-beach': { id: 'chawlas-beach', name: "Chawla's Beach", type: 'outpost', parent: 'pyro-iv', sector: 5, orbit: 5 },
  'dingers-depot': { id: 'dingers-depot', name: "Dinger's Depot", type: 'outpost', parent: 'pyro-iv', sector: 5, orbit: 5 },
  'fallow-field': { id: 'fallow-field', name: 'Fallow Field', type: 'outpost', parent: 'pyro-iv', sector: 5, orbit: 5 },
  'goners-deal': { id: 'goners-deal', name: "Goner's Deal", type: 'outpost', parent: 'pyro-iv', sector: 5, orbit: 5 },
  'sacrens-plot': { id: 'sacrens-plot', name: "Sacren's Plot", type: 'outpost', parent: 'pyro-iv', sector: 5, orbit: 5 },

  // --- Ignis Locations ---
  'ashland': { id: 'ashland', name: 'Ashland', type: 'outpost', parent: 'ignis', sector: 5, orbit: 6 },
  'kabirs-post': { id: 'kabirs-post', name: "Kabir's Post", type: 'outpost', parent: 'ignis', sector: 5, orbit: 6 },

  // --- Vatra Locations ---
  'seers-canyon': { id: 'seers-canyon', name: "Seer's Canyon", type: 'outpost', parent: 'vatra', sector: 5, orbit: 6 },

  // --- Adir Locations ---
  'outpost-12r': { id: 'outpost-12r', name: 'Outpost 12R', type: 'outpost', parent: 'adir', sector: 5, orbit: 6 },
  'prophets-peak': { id: 'prophets-peak', name: "Prophet's Peak", type: 'outpost', parent: 'adir', sector: 5, orbit: 6 },

  // --- Fairo Locations ---
  'feo-canyon-depot': { id: 'feo-canyon-depot', name: 'FEO Canyon Depot', type: 'outpost', parent: 'fairo', sector: 5, orbit: 6 },
  'outpost-08p': { id: 'outpost-08p', name: 'Outpost 08P', type: 'outpost', parent: 'fairo', sector: 5, orbit: 6 },

  // --- Terminus Locations ---
  'blackrock-exchange': { id: 'blackrock-exchange', name: 'Blackrock Exchange', type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'bullocks-reach': { id: 'bullocks-reach', name: "Bullock's Reach", type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'canard-view': { id: 'canard-view', name: 'Canard View', type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'kinder-plots': { id: 'kinder-plots', name: 'Kinder Plots', type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'last-landings': { id: 'last-landings', name: 'Last Landings', type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'outpost-56l': { id: 'outpost-56l', name: 'Outpost 56L', type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'rough-landing': { id: 'rough-landing', name: 'Rough Landing', type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'ruin-station': { id: 'ruin-station', name: 'Ruin Station', type: 'station', parent: 'terminus', sector: 8, orbit: 10 },
  'scarpers-turn': { id: 'scarpers-turn', name: "Scarper's Turn", type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'stonetree': { id: 'stonetree', name: 'Stonetree', type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },
  'watchers-depot': { id: 'watchers-depot', name: "Watcher's Depot", type: 'outpost', parent: 'terminus', sector: 8, orbit: 10 },

  // --- Pyro Lagrange Points ---
  'checkmate-station': { id: 'checkmate-station', name: 'Checkmate Station', type: 'lagrange', parent: 'pyro', sector: 3, orbit: 2 },
  'starlight-service': { id: 'starlight-service', name: 'Starlight Service Station', type: 'lagrange', parent: 'pyro', sector: 8, orbit: 3 },
  'patch-city': { id: 'patch-city', name: 'Patch City', type: 'lagrange', parent: 'pyro', sector: 4, orbit: 3 },
  'endgame': { id: 'endgame', name: 'Endgame', type: 'lagrange', parent: 'pyro', sector: 4, orbit: 10 },
  'dudley-daughters': { id: 'dudley-daughters', name: 'Dudley & Daughters', type: 'lagrange', parent: 'pyro', sector: 6, orbit: 10 },
  'megumi-refueling': { id: 'megumi-refueling', name: 'Megumi Refueling', type: 'lagrange', parent: 'pyro', sector: 2, orbit: 10 },

  // --- New Pyro Locations ---
  'rods-fuel': { id: 'rods-fuel', name: "Rod's Fuel", type: 'station', parent: 'pyro', sector: 3, orbit: 6 },
  'rats-nest': { id: 'rats-nest', name: "Rat's Nest", type: 'station', parent: 'pyro', sector: 7, orbit: 6 },
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

/**
 * Get polar coordinates for a location, inheriting from parent if needed
 */
function getCoordinates(nodeId: string): { sector: number; orbit: number } | null {
  let current = LOCATION_GRAPH[nodeId];
  while (current) {
    if (current.sector !== undefined && current.orbit !== undefined) {
      return { sector: current.sector, orbit: current.orbit };
    }
    if (!current.parent) break;
    current = LOCATION_GRAPH[current.parent];
  }
  return null;
}

/**
 * Calculate polar distance between two locations
 * Uses circular sector distance (8 sectors) and linear orbit distance
 */
function polarDistance(coordA: { sector: number; orbit: number }, coordB: { sector: number; orbit: number }): number {
  // Circular sector distance: min of clockwise vs counterclockwise
  const sectorDiff = Math.min(
    Math.abs(coordA.sector - coordB.sector),
    8 - Math.abs(coordA.sector - coordB.sector)
  );

  // Linear orbit distance
  const orbitDiff = Math.abs(coordA.orbit - coordB.orbit);

  // Weighted combination: sector changes are more expensive than orbit changes
  return sectorDiff * 15 + orbitDiff * 5;
}

/**
 * Travel cost calculation using polar coordinates
 *
 * Cost tiers:
 * - 0: Same location
 * - 5-75: Polar distance within same system
 * - 10: Same moon/planet (local travel fallback)
 * - 100: Same system, no coordinates (interplanetary fallback)
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

  // Different systems = interstellar travel (very expensive)
  const systemA = getAncestorOfType(idA, 'system');
  const systemB = getAncestorOfType(idB, 'system');
  if (systemA !== systemB) {
    return 1000;
  }

  // Same system - try polar coordinates first
  const coordA = getCoordinates(idA);
  const coordB = getCoordinates(idB);

  if (coordA && coordB) {
    return polarDistance(coordA, coordB);
  }

  // Fallback to hierarchical distance if no coordinates
  // Same moon (local travel)
  if (sharesAncestor(idA, idB, 'moon')) return 10;

  // Same planet (local travel)
  if (sharesAncestor(idA, idB, 'planet')) return 10;

  // Same system, different planets (interplanetary)
  return 100;
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
