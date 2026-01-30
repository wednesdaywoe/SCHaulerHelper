/**
 * OCR MAPPINGS - Star Citizen Hauler Helper
 * Comprehensive alias mappings for OCR text normalization
 * Used by both OCR Scanner and Hauler Helper importer
 * 
 * WHY THIS EXISTS:
 * OCR text extraction introduces many variations and errors.
 * This file provides a single source of truth for mapping
 * OCR variations → Database canonical names.
 * 
 * USAGE:
 * - OCR Scanner: Uses these to clean extracted text
 * - Hauler Importer: Uses these before fuzzy matching
 */

// =============================================================================
// LOCATION ALIASES
// =============================================================================

/**
 * Location name mappings
 * Format: "OCR_VARIATION" → "DATABASE_NAME"
 * 
 * IMPORTANT: Keys should be lowercase for case-insensitive matching
 */
const LOCATION_ALIASES = {
    // -------------------------------------------------------------------------
    // Covalex Distribution Centers
    // -------------------------------------------------------------------------
    'covalex': 'Covalex S4DC05',                    // Generic → Default
    'covalex s4dc5': 'Covalex S4DC05',              // Missing trailing zero
    'covalex s4dc 5': 'Covalex S4DC05',             // Space in code
    'covalex s4dc 05': 'Covalex S4DC05',            // Space in code
    's4dc05': 'Covalex S4DC05',                     // Code only
    's4dc5': 'Covalex S4DC05',                      // Code only, missing zero
    's4dc 05': 'Covalex S4DC05',                    // Space in code
    's4dcos': 'Covalex S4DC05',                     // "O" misread as zero
    's4dc0s': 'Covalex S4DC05',                     // "S" misread as "5"
    'covalex distribution center': 'Covalex S4DC05',
    'covalex distribution': 'Covalex S4DC05',
    
    // -------------------------------------------------------------------------
    // MicroTech Depots & Logistics
    // -------------------------------------------------------------------------
    'mt depot': 'MicroTech S4LD13',                 // Generic
    'mt logistics': 'MicroTech S4LD13',             // Generic
    'microtech logistics': 'MicroTech S4LD13',
    'microtech depot': 'MicroTech S4LD13',
    's4ld13': 'MicroTech S4LD13',                   // Code only
    's4ld 13': 'MicroTech S4LD13',                  // Space in code
    's4ld01': 'MicroTech S4LD01',
    's4ld 01': 'MicroTech S4LD01',
    's4ld1': 'MicroTech S4LD01',                    // Missing leading zero
    
    // -------------------------------------------------------------------------
    // Shubin Mining Facilities - MicroTech (SMO)
    // -------------------------------------------------------------------------
    'shubin': 'Shubin SMO-10',                      // Generic → Most common
    'shubin mining': 'Shubin SMO-10',
    'shubin smo': 'Shubin SMO-10',
    'smo-10': 'Shubin SMO-10',                      // Code only
    'smo 10': 'Shubin SMO-10',                      // Space instead of dash
    'sm0-10': 'Shubin SMO-10',                      // Zero instead of O
    'smo-13': 'Shubin SMO-13',
    'smo 13': 'Shubin SMO-13',
    'sm0-13': 'Shubin SMO-13',
    'smo-18': 'Shubin SMO-18',
    'smo 18': 'Shubin SMO-18',
    'sm0-18': 'Shubin SMO-18',
    'smo-22': 'Shubin SMO-22',
    'smo 22': 'Shubin SMO-22',
    'sm0-22': 'Shubin SMO-22',
    'smca-6': 'Shubin SMCa-6',
    'smc-6': 'Shubin SMCa-6',
    'smca 6': 'Shubin SMCa-6',
    'smca-8': 'Shubin SMCa-8',
    'smc-8': 'Shubin SMCa-8',
    'smca 8': 'Shubin SMCa-8',
    
    // Shubin Hurston (SPAL)
    'spal-3': 'Shubin SPAL-3',
    'spal 3': 'Shubin SPAL-3',
    'spal-7': 'Shubin SPAL-7',
    'spal 7': 'Shubin SPAL-7',
    'spal-9': 'Shubin SPAL-9',
    'spal 9': 'Shubin SPAL-9',
    'spal-12': 'Shubin SPAL-12',
    'spal 12': 'Shubin SPAL-12',
    
    // Shubin Hurston (SPMC)
    'spmc-1': 'Shubin SPMC-1',
    'spmc 1': 'Shubin SPMC-1',
    'spmc-3': 'Shubin SPMC-3',
    'spmc 3': 'Shubin SPMC-3',
    'spmc-5': 'Shubin SPMC-5',
    'spmc 5': 'Shubin SPMC-5',
    'spmc-10': 'Shubin SPMC-10',
    'spmc 10': 'Shubin SPMC-10',
    'spmc-11': 'Shubin SPMC-11',
    'spmc 11': 'Shubin SPMC-11',
    'spmc-14': 'Shubin SPMC-14',
    'spmc 14': 'Shubin SPMC-14',
    
    // Shubin Crusader (SAL/SCD)
    'sal-2': 'Shubin SAL-2',
    'sal 2': 'Shubin SAL-2',
    'sal-5': 'Shubin SAL-5',
    'sal 5': 'Shubin SAL-5',
    'scd-1': 'Shubin SCD-1',
    'scd 1': 'Shubin SCD-1',
    
    // -------------------------------------------------------------------------
    // Rayari Facilities
    // -------------------------------------------------------------------------
    'rayari': 'Rayari Deltana',                     // Generic → Most common
    'rayari anvik': 'Rayari Anvik',
    'rayari cantwell': 'Rayari Cantwell',
    'rayari deltana': 'Rayari Deltana',
    'rayari kaltag': 'Rayari Kaltag',
    'rayari mcgrath': 'Rayari McGrath',
    
    // -------------------------------------------------------------------------
    // Lagrange Points (L-Points)
    // -------------------------------------------------------------------------
    // MicroTech Lagrange
    'mic l1': 'MIC-L1 Shallow Frontier',
    'mic l2': 'MIC-L2 Long Forest',
    'mic l3': 'MIC-L3 Endless Odyssey',
    'mic l4': 'MIC-L4 Red Crossroads',
    'mic l5': 'MIC-L5 Modern Icarus',
    'mt l1': 'MIC-L1 Shallow Frontier',
    'mt l2': 'MIC-L2 Long Forest',
    'mt l3': 'MIC-L3 Endless Odyssey',
    'mt l4': 'MIC-L4 Red Crossroads',
    'mt l5': 'MIC-L5 Modern Icarus',
    'mic-l 1': 'MIC-L1 Shallow Frontier',
    'shallow frontier': 'MIC-L1 Shallow Frontier',
    'long forest': 'MIC-L2 Long Forest',
    'endless odyssey': 'MIC-L3 Endless Odyssey',
    'red crossroads': 'MIC-L4 Red Crossroads',
    'modern icarus': 'MIC-L5 Modern Icarus',                            // Space in code
    'mic-l 2': 'MIC-L2',
    'mic-l 3': 'MIC-L3',
    'mic-l 4': 'MIC-L4',
    'mic-l 5': 'MIC-L5',
    
    // Hurston Lagrange
    'hur l1': 'HUR-L1 Green Glade',
    'hur l2': 'HUR-L2 Faithful Dream',
    'hur l3': 'HUR-L3 Thundering Express',
    'hur l4': 'HUR-L4 Melodic Fields',
    'hur l5': 'HUR-L5 High Course',
    'hur-l 1': 'HUR-L1 Green Glade',
    'hur-l 2': 'HUR-L2 Faithful Dream',
    'hur-l 3': 'HUR-L3 Thundering Express',
    'hur-l 4': 'HUR-L4 Melodic Fields',
    'hur-l 5': 'HUR-L5 High Course',
    'green glade': 'HUR-L1 Green Glade',
    'faithful dream': 'HUR-L2 Faithful Dream',
    'thundering express': 'HUR-L3 Thundering Express',
    'melodic fields': 'HUR-L4 Melodic Fields',
    'high course': 'HUR-L5 High Course',
    
    // ArcCorp
    'arc l1': 'ARC-L1 Wide Forest',
    'arc l2': 'ARC-L2',
    'arc l3': 'ARC-L3 Modern Express',
    'arc l4': 'ARC-L4 Feint Glen',
    'arc l5': 'ARC-L5 Yellow Core',
    'arc-l 1': 'ARC-L1 Wide Forest',
    'arc-l 2': 'ARC-L2',
    'arc-l 3': 'ARC-L3 Modern Express',
    'arc-l 4': 'ARC-L4 Feint Glen',
    'arc-l 5': 'ARC-L5 Yellow Core',
    'wide forest': 'ARC-L1 Wide Forest',
    'wide forest station': 'ARC-L1 Wide Forest',
    "arccorp's l1": 'ARC-L1 Wide Forest',
    "arccorp's l1 lagrange": 'ARC-L1 Wide Forest',
    "arccorp l1 lagrange": 'ARC-L1 Wide Forest',
    
    // Crusader Lagrange
    'cru l1': 'CRU-L1 Ambitious Dream',
    'cru l2': 'CRU-L2',
    'cru l3': 'CRU-L3',
    'cru l4': 'CRU-L4 Shallow Fields',
    'cru l5': 'CRU-L5 Beautiful Glen',
    'cru-l 1': 'CRU-L1 Ambitious Dream',
    'cru-l 2': 'CRU-L2',
    'cru-l 3': 'CRU-L3',
    'cru-l 4': 'CRU-L4 Shallow Fields',
    'cru-l 5': 'CRU-L5 Beautiful Glen',
    'ambitious dream': 'CRU-L1 Ambitious Dream',
    'shallow fields': 'CRU-L4 Shallow Fields',
    'beautiful glen': 'CRU-L5 Beautiful Glen',
    
    // -------------------------------------------------------------------------
    // Major Stations & Cities
    // -------------------------------------------------------------------------
    'tressler': 'Port Tressler',
    'port olisar': 'Port Olisar',
    'olisar': 'Port Olisar',
    'everus': 'Everus Harbor',
    'everus harbor': 'Everus Harbor',
    'baijini': 'Baijini Point',
    'baijini point': 'Baijini Point',
    'seraphim': 'Seraphim Station',
    'seraphim station': 'Seraphim Station',
    'grim hex': 'Grim HEX',
    'grimhex': 'Grim HEX',
    'new babbage': 'New Babbage',
    'nb int. spaceport': 'New Babbage',
    'nb int spaceport': 'New Babbage',
    'nb int.spaceport': 'New Babbage',
    'nb international spaceport': 'New Babbage',
    'new babbage int spaceport': 'New Babbage',
    'new babbage international': 'New Babbage',
    'lorville': 'Lorville',
    'area18': 'Area18',
    'area 18': 'Area18',
    'orison': 'Orison',
    
    // -------------------------------------------------------------------------
    // ArcCorp Facilities
    // -------------------------------------------------------------------------
    'arccorp 045': 'ArcCorp 045',
    'arc 045': 'ArcCorp 045',
    'arccorp 048': 'ArcCorp 048',
    'arc 048': 'ArcCorp 048',
    'arccorp 056': 'ArcCorp 056',
    'arc 056': 'ArcCorp 056',
    'arccorp 061': 'ArcCorp 061',
    'arc 061': 'ArcCorp 061',
    'arccorp 141': 'ArcCorp 141',
    'arc 141': 'ArcCorp 141',
    'arccorp 157': 'ArcCorp 157',
    'arc 157': 'ArcCorp 157',
    'loveridge': 'Loveridge Mineral',
    'loveridge mineral': 'Loveridge Mineral',
    
    // -------------------------------------------------------------------------
    // Hurston Facilities (HDMS/HDPC)
    // -------------------------------------------------------------------------
    'hdms anderson': 'HDMS-Anderson',
    'hdms bezdek': 'HDMS-Bezdek',
    'hdms edmond': 'HDMS-Edmond',
    'hdms hadley': 'HDMS-Hadley',
    'hdms hahn': 'HDMS-Hahn',
    'hdms lathan': 'HDMS-Lathan',
    'hdms norgaard': 'HDMS-Norgaard',
    'hdms oparei': 'HDMS-Oparei',
    'hdms perlman': 'HDMS-Perlman',
    'hdms pinewood': 'HDMS-Pinewood',
    'hdms ryder': 'HDMS-Ryder',
    'hdms stanhope': 'HDMS-Stanhope',
    'hdms thedus': 'HDMS-Thedus',
    'hdms woodruff': 'HDMS-Woodruff',
    'hdpc cassillo': 'HDPC-Cassillo',
    'hdpc farnesway': 'HDPC-Farnesway',
    
    // -------------------------------------------------------------------------
    // Other Facilities
    // -------------------------------------------------------------------------
    'cry-astro 19-02': 'Cry-Astro 19-02',
    'cry astro 19-02': 'Cry-Astro 19-02',
    'cry-astro 34-12': 'Cry-Astro 34-12',
    'cry astro 34-12': 'Cry-Astro 34-12',
    'greycat complex-a': 'Greycat Complex-A',
    'greycat complex a': 'Greycat Complex-A',
    'greycat complex-b': 'Greycat Complex-B',
    'greycat complex b': 'Greycat Complex-B',
    'sakura sun goldenrod': 'Sakura Sun Goldenrod',
    'sakura sun magnolia': 'Sakura Sun Magnolia',
    'security post kareah': 'Security Post Kareah',
    'kareah': 'Security Post Kareah',
    
    // Nyx System
    'levski': 'Levski',
    'ruptura olp': 'Ruptura OLP',
    'ruptura paf-i': 'Ruptura PAF-I',
    'ruptura paf-ii': 'Ruptura PAF-II',
    'ruptura paf-iii': 'Ruptura PAF-III',
    'ruptura paf i': 'Ruptura PAF-I',
    'ruptura paf ii': 'Ruptura PAF-II',
    'ruptura paf iii': 'Ruptura PAF-III',
};

// =============================================================================
// COMMODITY ALIASES
// =============================================================================

/**
 * Commodity name mappings
 * Format: "OCR_VARIATION" → "DATABASE_NAME"
 * 
 * IMPORTANT: Keys should be lowercase for case-insensitive matching
 */
const COMMODITY_ALIASES = {
    // Common abbreviations and OCR variations
    'hydrogen': 'Hydrogen',
    'hydr0gen': 'Hydrogen',
   

    'hydrogen fuel': 'Hydrogen Fuel',
    'hydr0gen fuel': 'Hydrogen Fuel',

    
    'ship ammo': 'Ship Ammunition',               // CRITICAL FIX
    'ammunition': 'Ship Ammunition',
    'ship ammunition': 'Ship Ammunition',
    'ammo': 'Ship Ammunition',
    
    'press ice': 'Pressurized Ice',
    'pressurized ice': 'Pressurized Ice',
    'pressed ice': 'Pressurized Ice',
    'ice': 'Pressurized Ice',
    
    'proc food': 'Processed Food',
    'processed food': 'Processed Food',
    'food': 'Processed Food',
    
    'agri supplies': 'Agricultural Supplies',
    'agricultural supplies': 'Agricultural Supplies',
    'agri supply': 'Agricultural Supplies',
    'ag supplies': 'Agricultural Supplies',
    
    'c materials': 'Construction Materials',
    'construction materials': 'Construction Materials',
    'const materials': 'Construction Materials',
    'building materials': 'Construction Materials',
    
    'quantum fuel': 'Quantum Fuel',
    'q fuel': 'Quantum Fuel',
    
    // Minerals (handle "(Raw)" suffix)
    'quartz': 'Quartz',
    'quartz (raw)': 'Quartz',
    'quartz raw': 'Quartz',
    
    'corundum': 'Corundum',
    'corundum (raw)': 'Corundum',
    'corundum raw': 'Corundum',
    
    'aluminum': 'Aluminum',
    'aluminium': 'Aluminum',
    
    'beryl': 'Beryl',
    'beryl (raw)': 'Beryl',
    
    'carbon': 'Carbon',
    'carbon (raw)': 'Carbon',
    
    'silicon': 'Silicon',
    'silicon (raw)': 'Silicon',
    
    'titanium': 'Titanium',
    'titanium (raw)': 'Titanium',
    
    'tungsten': 'Tungsten',
    'tungsten (raw)': 'Tungsten',
    
    'tin': 'Tin',
    'tin (raw)': 'Tin',
    
    // Other commodities
    'stims': 'Stims',
    'stimulants': 'Stims',
    
    'scrap': 'Scrap',
    'metal scrap': 'Scrap',
    
    'waste': 'Waste',
    'trash': 'Waste',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Normalize text for alias matching
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text (lowercase, trimmed)
 */
function normalizeForAliasMatch(text) {
    if (!text) return '';
    return text.trim().toLowerCase();
}

/**
 * Apply location alias mapping
 * @param {string} locationText - Raw location text from OCR
 * @returns {string} - Mapped location name or original if no match
 */
function applyLocationAlias(locationText) {
    const normalized = normalizeForAliasMatch(locationText);
    const mapped = LOCATION_ALIASES[normalized];
    
    if (mapped) {
        console.log(`🗺️ Location alias: "${locationText}" → "${mapped}"`);
        return mapped;
    }
    
    return locationText;
}

/**
 * Apply commodity alias mapping
 * @param {string} commodityText - Raw commodity text from OCR
 * @returns {string} - Mapped commodity name or original if no match
 */
function applyCommodityAlias(commodityText) {
    const normalized = normalizeForAliasMatch(commodityText);
    const mapped = COMMODITY_ALIASES[normalized];
    
    if (mapped) {
        console.log(`📦 Commodity alias: "${commodityText}" → "${mapped}"`);
        return mapped;
    }
    
    return commodityText;
}

// =============================================================================
// EXPORT
// =============================================================================

// Browser export
if (typeof window !== 'undefined') {
    window.OCR_MAPPINGS = {
        LOCATION_ALIASES,
        COMMODITY_ALIASES,
        applyLocationAlias,
        applyCommodityAlias,
        normalizeForAliasMatch
    };
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LOCATION_ALIASES,
        COMMODITY_ALIASES,
        applyLocationAlias,
        applyCommodityAlias,
        normalizeForAliasMatch
    };
}
