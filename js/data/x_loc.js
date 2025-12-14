/**
 * LOCATIONS DATABASE - Star Citizen Hauler Helper
 * 
 * STRUCTURE: Organized by SYSTEM first, then CATEGORY
 * 
 * locations[system][category] = [...locations]
 * 
 * SYSTEMS: microtech, hurston, arccorp, crusader, nyx, universal
 * CATEGORIES: planetary, local, stellar, interstellar
 */

const LOCATIONS_DATABASE = {
    // ============================================================================
    // MICROTECH SYSTEM
    // ============================================================================
    microtech: {
        // PLANETARY: microTech planet + moons only
        planetary: [
            "Covalex S4DC05",
            "Cry-Astro 19-02",
            "Cry-Astro 34-12",
            "Greycat Complex-A",
            "Greycat Complex-B",
            "MIC-L1",
            "MIC-L2",
            "MIC-L3",
            "MIC-L4",
            "MIC-L5",
            "MicroTech S4LD01",
            "MicroTech S4LD13",
            "New Babbage",
            "Port Tressler",
            "Rayari Anvik",
            "Rayari Cantwell",
            "Rayari Deltana",
            "Rayari Kaltag",
            "Rayari McGrath",
            "Sakura Sun Goldenrod",
            "Sakura Sun Magnolia",
            "Security Post Kareah",
            "Shubin SMCa-6",
            "Shubin SMCa-8",
            "Shubin SMO-10",
            "Shubin SMO-13",
            "Shubin SMO-18",
            "Shubin SMO-22"
        ],
        
        // LOCAL: Multi-moon within microTech region
        local: [
            "Covalex S4DC05",
            "MicroTech S4LD13",
            "Rayari Deltana",
            "Rayari Kaltag",
            "Shubin SMO-10",
            "Shubin SMO-13",
            "Shubin SMO-18",
            "Shubin SMO-22"
        ],
        
        // STELLAR: Cross-planet in Stanton system
        stellar: [
            "ARC-L1", "ARC-L2", "ARC-L3", "ARC-L4", "ARC-L5",
            "Area18",
            "Baijini Point",
            "CRU-L1", "CRU-L2", "CRU-L3", "CRU-L4", "CRU-L5",
            "Everus Harbor",
            "Grim HEX",
            "HUR-L1", "HUR-L2", "HUR-L3", "HUR-L4", "HUR-L5",
            "Lorville",
            "MIC-L1", "MIC-L2", "MIC-L3", "MIC-L4", "MIC-L5",
            "New Babbage",
            "Orison",
            "Port Olisar",
            "Port Tressler",
            "Seraphim Station"
        ]
    },
    
    // ============================================================================
    // HURSTON SYSTEM
    // ============================================================================
    hurston: {
        planetary: [
            "Brio's Breaker Yard",
            "Bud's Growery",
            "Everus Harbor",
            "HDMS-Anderson", "HDMS-Bezdek", "HDMS-Edmond", "HDMS-Hadley",
            "HDMS-Hahn", "HDMS-Lathan", "HDMS-Norgaard", "HDMS-Oparei",
            "HDMS-Perlman", "HDMS-Pinewood", "HDMS-Ryder", "HDMS-Stanhope",
            "HDMS-Thedus", "HDMS-Woodruff",
            "HDPC-Cassillo", "HDPC-Farnesway",
            "HUR-L1", "HUR-L2", "HUR-L3", "HUR-L4", "HUR-L5",
            "Lorville",
            "Reclamation Orinth",
            "Samson & Son's",
            "Shubin SPAL-3", "Shubin SPAL-7", "Shubin SPAL-9", "Shubin SPAL-12",
            "Shubin SPMC-1", "Shubin SPMC-3", "Shubin SPMC-5",
            "Shubin SPMC-10", "Shubin SPMC-11", "Shubin SPMC-14"
        ],
        
        local: [
            "HDMS-Anderson", "HDMS-Bezdek", "HDMS-Edmond",
            "Shubin SPAL-3", "Shubin SPAL-7", "Shubin SPAL-9",
            "Shubin SPMC-1", "Shubin SPMC-3", "Shubin SPMC-5"
        ],
        
        stellar: [
            "ARC-L1", "ARC-L2", "ARC-L3", "ARC-L4", "ARC-L5",
            "Area18",
            "Baijini Point",
            "CRU-L1", "CRU-L2", "CRU-L3", "CRU-L4", "CRU-L5",
            "Everus Harbor",
            "Grim HEX",
            "HUR-L1", "HUR-L2", "HUR-L3", "HUR-L4", "HUR-L5",
            "Lorville",
            "MIC-L1", "MIC-L2", "MIC-L3", "MIC-L4", "MIC-L5",
            "New Babbage",
            "Orison",
            "Port Olisar",
            "Port Tressler",
            "Seraphim Station"
        ]
    },
    
    // ============================================================================
    // ARCCORP SYSTEM
    // ============================================================================
    arccorp: {
        planetary: [
            "ARC-L1", "ARC-L2", "ARC-L3", "ARC-L4", "ARC-L5",
            "ArcCorp 045", "ArcCorp 048", "ArcCorp 056",
            "ArcCorp 061", "ArcCorp 141", "ArcCorp 157",
            "Area18",
            "Baijini Point",
            "Loveridge Mineral"
        ],
        
        local: [
            "ArcCorp 045", "ArcCorp 048", "ArcCorp 056"
        ],
        
        stellar: [
            "ARC-L1", "ARC-L2", "ARC-L3", "ARC-L4", "ARC-L5",
            "Area18",
            "Baijini Point",
            "CRU-L1", "CRU-L2", "CRU-L3", "CRU-L4", "CRU-L5",
            "Everus Harbor",
            "Grim HEX",
            "HUR-L1", "HUR-L2", "HUR-L3", "HUR-L4", "HUR-L5",
            "Lorville",
            "MIC-L1", "MIC-L2", "MIC-L3", "MIC-L4", "MIC-L5",
            "New Babbage",
            "Orison",
            "Port Olisar",
            "Port Tressler",
            "Seraphim Station"
        ]
    },
    
    // ============================================================================
    // CRUSADER SYSTEM
    // ============================================================================
    crusader: {
        planetary: [
            "CRU-L1", "CRU-L2", "CRU-L3", "CRU-L4", "CRU-L5",
            "Orison",
            "Port Olisar",
            "Seraphim Station",
            "Shubin SAL-2", "Shubin SAL-5",
            "Shubin SCD-1"
        ],
        
        local: [
            "Shubin SAL-2", "Shubin SAL-5",
            "Shubin SCD-1"
        ],
        
        stellar: [
            "ARC-L1", "ARC-L2", "ARC-L3", "ARC-L4", "ARC-L5",
            "Area18",
            "Baijini Point",
            "CRU-L1", "CRU-L2", "CRU-L3", "CRU-L4", "CRU-L5",
            "Everus Harbor",
            "Grim HEX",
            "HUR-L1", "HUR-L2", "HUR-L3", "HUR-L4", "HUR-L5",
            "Lorville",
            "MIC-L1", "MIC-L2", "MIC-L3", "MIC-L4", "MIC-L5",
            "New Babbage",
            "Orison",
            "Port Olisar",
            "Port Tressler",
            "Seraphim Station"
        ]
    },
    
    // ============================================================================
    // NYX SYSTEM
    // ============================================================================
    nyx: {
        planetary: [
            "Levski",
            "Ruptura OLP",
            "Ruptura PAF-I",
            "Ruptura PAF-II",
            "Ruptura PAF-III"
        ],
        
        local: [
            "Levski"
        ],
        
        stellar: [
            "Levski",
            "Ruptura OLP",
            "Ruptura PAF-I",
            "Ruptura PAF-II",
            "Ruptura PAF-III"
        ]
    },
    
    // ============================================================================
    // UNIVERSAL (Cross-system, used for interstellar category)
    // ============================================================================
    universal: {
        interstellar: [
            // Pyro System
            "Magnus Gateway",
            "Pyro Gateway",
            
            // Nyx System
            "Levski",
            "Ruptura OLP",
            "Ruptura PAF-I",
            "Ruptura PAF-II",
            "Ruptura PAF-III",
            
            // Other Stations
            "Attritus OLP",
            "Bacchus Flotilla",
            "Buloi Sataball Arena",
            "Checkmate Station",
            "Dudley & Daughters",
            "Orbituary",
            "Prime",
            "Ruin Station"
        ]
    }
};

// Export for browser
if (typeof window !== 'undefined') {
    window.LOCATIONS_DATABASE = LOCATIONS_DATABASE;
}

// Export for browser (window object)
if (typeof window !== 'undefined') {
    window.LOCATIONS_DATABASE = LOCATIONS_DATABASE;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LOCATIONS_DATABASE };
}
