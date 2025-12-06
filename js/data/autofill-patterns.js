/**
 * HAULER HELPER - AUTOFILL PATTERNS
 * 
 * This file contains all the auto-fill patterns for missions.
 * Patterns automatically populate commodity rows when you select the first commodity.
 * 
 * PATTERN TYPES (checked in order of specificity):
 * 
 * 1. PAYOUT-SPECIFIC PATTERNS (most specific)
 *    - Matches: system + commodity + exact payout
 *    - Use when: A specific payout always has the same mission layout
 * 
 * 2. COMMODITY-ONLY PATTERNS (medium specific)
 *    - Matches: system + commodity (any payout)
 *    - Use when: A commodity always follows the same pattern in a system
 * 
 * 3. UNIVERSAL SEQUENCES (least specific)
 *    - Matches: commodity only (any system, any payout)
 *    - Use when: A commodity sequence is consistent across all systems
 * 
 * PATTERN STRUCTURE:
 * {
 *     pickups: [location1, location2, location3, location4],      // Optional, null = leave blank
 *     destinations: [location1, location2, location3, location4], // Optional, null = leave blank
 *     commodities: [commodity1, commodity2, commodity3, commodity4] // Required
 * }
 * 
 * HOW TO ADD NEW PATTERNS:
 * 
 * Example 1: Add a payout-specific pattern for microTech Aluminum at 95k
 * payoutPatterns.microtech['Aluminum'] = {
 *     '95k': {
 *         pickups: ['New Babbage', 'New Babbage', 'New Babbage', 'New Babbage'],
 *         destinations: ['Rayari Keltag', 'Rayari Keltag', 'Rayari Keltag', 'Rayari Keltag'],
 *         commodities: ['Aluminum', 'Titanium', 'Aluminum', 'Titanium']
 *     }
 * };
 * 
 * Example 2: Add a commodity-only pattern for ArcCorp Scrap
 * commodityPatterns.arccorp['Scrap'] = {
 *     destinations: ['Baijini Point', 'Baijini Point', 'Baijini Point', 'Baijini Point'],
 *     commodities: ['Scrap', 'Waste', 'Scrap', 'Waste']
 * };
 * 
 * Example 3: Add a universal sequence for Beryl
 * universalCommoditySequences['Beryl'] = ['Beryl', 'Beryl', 'Titanium', 'Titanium'];
 */

// LOCATION CONSTANTS (for easy reference - add more as needed)
const LOCATIONS = {
    // microTech
    MICROTECH_DEPOT: 'Covalex S4DC05',
    NEW_BABBAGE: 'New Babbage',
    PORT_TRESSLER: 'Port Tressler',
    
    // Hurston
    HURSTON_CASSILLO: 'HDPC-Cassillo',
    HURSTON_FARNESWAY: 'HDPC-Farnesway',
    HURSTON_TEASA: 'HDPC-Teasa',
    HURSTON_OPEREI: 'HDMS-Operei',
    EVERUS_HARBOR: 'Everus Harbor',
    HURSTON_STANHOPE: 'HDMS-Stanhope',
    HURSTON_PINEWOOD: 'HDMS-Pinewood',
    HURSTON_THEDUS: 'HDMS-Thedus',
    
    // Add more locations here as you discover patterns
};

// =============================================================================
// PAYOUT-SPECIFIC PATTERNS (Highest Priority)
// =============================================================================
const payoutPatterns = {
    'microtech': {
        // No payout-specific patterns for microTech yet
        // Add them here as you discover them!
    },
    
    'hurston': {
        'Quantum Fuel': {
            '60.75k': {
                pickups: [LOCATIONS.HURSTON_CASSILLO, LOCATIONS.HURSTON_CASSILLO, LOCATIONS.HURSTON_CASSILLO, LOCATIONS.HURSTON_CASSILLO],
                destinations: [LOCATIONS.HURSTON_OPEREI, LOCATIONS.HURSTON_OPEREI, LOCATIONS.HURSTON_OPEREI, LOCATIONS.HURSTON_OPEREI],
                commodities: ['Quantum Fuel', 'Hydrogen Fuel', 'Hydrogen Fuel', 'Ship Ammo']
            },
            '72k': {
                pickups: [LOCATIONS.HURSTON_TEASA, LOCATIONS.HURSTON_TEASA, LOCATIONS.HURSTON_TEASA, LOCATIONS.HURSTON_TEASA],
                destinations: [null, null, null, null], // Will be filled in-game
                commodities: ['Quantum Fuel', 'Hydrogen Fuel', 'Hydrogen Fuel', 'Ship Ammo']
            },
            '160.25k': {
                pickups: [LOCATIONS.HURSTON_FARNESWAY, LOCATIONS.HURSTON_FARNESWAY, LOCATIONS.HURSTON_FARNESWAY, LOCATIONS.HURSTON_FARNESWAY],
                destinations: [null, null, null, null], // Will be filled in-game
                commodities: ['Quantum Fuel', 'Hydrogen Fuel', 'Hydrogen Fuel', 'Ship Ammo']
            }
        },
        
        'Press Ice': {
            '60.75k': {
                pickups: [LOCATIONS.HURSTON_CASSILLO, LOCATIONS.HURSTON_CASSILLO, null, null],
                destinations: [LOCATIONS.HURSTON_OPEREI, LOCATIONS.HURSTON_OPEREI, null, null],
                commodities: ['Press Ice', 'Press Ice', 'Proc Food', 'Proc Food']
            },
            '131.5k': {
                pickups: [LOCATIONS.HURSTON_TEASA, LOCATIONS.HURSTON_TEASA, LOCATIONS.HURSTON_TEASA, LOCATIONS.HURSTON_TEASA],
                destinations: ['HDMS-Edmond', 'HDMS-Edmond', 'HDMS-Operei', 'Reclamation Orinth'],
                commodities: ['Press Ice', 'Press Ice', 'Proc Food', 'Proc Food']  
            }
        },
        'Waste': {
            '108.5k': {
                pickups: [LOCATIONS.HURSTON_STANHOPE, LOCATIONS.HURSTON_PINEWOOD, LOCATIONS.HURSTON_THEDUS],
                destinations: ['HDPC-Farnesway', 'HDPC-Farnesway', 'HDPC-Farnesway'],
                commodities: ['Waste', 'Waste', 'Waste']
            }
        },
        
        
        // Add more Hurston payout patterns here!
    },
    
    'arccorp': {
        // Add ArcCorp payout patterns here!
    },
    
    'crusader': {
        // Add Crusader payout patterns here!
    }
};

// =============================================================================
// COMMODITY-ONLY PATTERNS (Medium Priority)
// =============================================================================
const commodityPatterns = {
    'microtech': {
        'Quartz': {
            destinations: [LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT],
            commodities: ['Quartz', 'Corundum', 'Quartz', 'Corundum']
        },
        
        'Stims': {
            pickups: [LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT],
            commodities: ['Stims', 'Stims', 'Stims', 'Stims']
        },
        
        'Press Ice': {
            pickups: [LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT],
            commodities: ['Press Ice', 'Press Ice', 'Proc Food', 'Proc Food']
        },
        
        'Hydrogen Fuel': {
            pickups: [LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT],
            commodities: ['Hydrogen Fuel', 'Hydrogen Fuel', 'Quantum Fuel', 'Ship Ammo']
        },
        
        'Waste': {
            destinations: [LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT],
            commodities: ['Waste', 'Scrap', 'Waste', 'Scrap']
        }
    },
    
    'hurston': {
        // Hurston patterns require payout specificity - see payoutPatterns above
    },
    
    'arccorp': {
        // Add ArcCorp commodity patterns here!
    },
    
    'crusader': {
        // Add Crusader commodity patterns here!
    }
};

// =============================================================================
// UNIVERSAL SEQUENCES (Lowest Priority - Apply to ANY system)
// =============================================================================
const universalCommoditySequences = {
    'Press Ice': ['Press Ice', 'Press Ice', 'Proc Food', 'Proc Food'],
    'Quantum Fuel': ['Quantum Fuel', 'Hydrogen Fuel', 'Hydrogen Fuel', 'Ship Ammo'],
    'Waste': ['Waste', 'Scrap', 'Waste', 'Scrap'],
    'Quartz': ['Quartz', 'Corundum', 'Quartz', 'Corundum']
    
    // Add more universal patterns here as you discover them!
};

// Export for use in main app
window.AUTOFILL_PATTERNS = {
    payoutPatterns,
    commodityPatterns,
    universalCommoditySequences,
    LOCATIONS // Export location constants too
};
