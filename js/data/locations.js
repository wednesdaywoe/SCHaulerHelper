/**
 * Locations Database
 * All trading locations organized by system, then by mission category
 * Sorted alphabetically within each category
 */

const LOCATIONS_DATABASE = {
    microtech: {
        planetary: [
            "Covalex S4DC05", "Cry-Astro 19-02", "Cry-Astro 34-12", "Devlin Scrapyard",
            "Greycat Complex A", "MT Depot S4C05", "MT Depot S4LD01", "MT Depot S4LD13",
            "MT L1", "MT L2", "MT L3", "MT L4", "New Babbage", "Port Tressler",
            "Rayari Anvik", "Rayari Cantwell", "Rayari Keltag", "Rayari McGrath",
            "Sakura Sun Goldenrod", "Shubin SMCa-6", "Shubin SMCa-8"
        ],
        local: [
            "Covalex S4DC05", "MT Logistics S4LD13", "Rayari Deltana", "Rayari Keltag",
            "SMO S4DC10", "SMO S4DC13", "SMO S4DC18", "SMO S4DC22"
        ],
        stellar: [
            "ARC-L1", "ARC-L2", "ARC-L5", "Baijini", "CRU-L1", "CRU-L4", "CRU-L5",
            "Everus", "HUR-L1", "MIC-L1", "MIC-L2", "Seraphim", "Tressler"
        ],
        interstellar: [
            "ARC 048 - Wala", "Baijini - Arc", "Brio's Breaker Yrd - Daymar",
            "Bueno Ravine - Pyro III", "Canard View - Pyro VI", "Chawla Beach - Pyro IV",
            "Deakins RO - Yela", "Everus - Hurston", "HDMS-Hahn - Magda",
            "Jackson's Swap - Pyro II", "Levski - Nyx", "Port Tressler - MicroT",
            "Rayari McGrath - Clio", "Ruin Station - Pyro IV", "Sacren's Plot - Pyro IV",
            "Shephrds Rest - Pyro III", "Shubin SAL-5 - Lyria", "Shubin SMO-18 - MicroT"
        ]
    },
    hurston: {
        planetary: [
            "Covalex Distribution Center S1DC06",
            "Covalex Distribution Center S1DC0B",
            "Dupree Industrial Manufacturing Facility",
            "Everus Harbor",
            "HDMS-Hahn",
            "HDMS-Periman",
            "HDMS-Ryder",
            "HDMS-Woodruff",
            "HDPC-Cassillo",
            "HDPC-Farnesway",
            "Sakura Sun Magnolia Workcenter",
            "Teasa Spaceport"
        ],
        local: [
            "HDMS-Edmond", "HDMS-Hadley", "HDMS-Operei", "HDMS-Pinewood", 
            "HDMS-Stanhope", "HDMS-Thedus", "HDPC-Cassillo", "HDPC-Farnesway", 
            "Reclamation Orinth", "Teasa Spaceport"
        ],
        stellar: [
            "ARC-L1 Wide Forest Station",
            "ARC-L2 Lively Pathway Station",
            "ARC-L5 Yellow Core Station",
            "ARC-LS Yellow Core Station",
            "Baijini Point",
            "CRU-L1 Ambitious Dream Station",
            "CRU-L4 Shallow Fields Station",
            "Everus Harbor",
            "HUR-L1 Green Glade Station",
            "HUR-L2 Faithful Dream Station",
            "HUR-L3 Thundering Express Station",
            "HUR-L4 Melodic Fields Station",
            "HUR-LS High Course Station",
            "MIC-L1 Shallow Frontier Station",
            "MIC-L2 Long Forest Station",
            "Port Tressler",
            "Seraphim Station"
        ],
        interstellar: [
            "ArcCorp Mining Area 045", "ArcCorp Mining Area 061", "Baijini Point",
            "Brio's Breaker Yard", "Chawla's Beach", "Everus Harbor", "HDMS-Thedus",
            "Jackson's Swap", "Levski", "Port Tressler", "Rayari", "Ruin Station",
            "Sacren's Plot", "Shepherd's Rest"
        ]
    },
    arccorp: {
        planetary: [
            "ArcCorp Mining Area 045", "ArcCorp Mining Area 048", "ArcCorp Mining Area 056",
            "ArcCorp Mining Area 061", "Baijini Point", "Everus Harbor", "HDPC-Cassillo",
            "HDPC-Farnesway", "Riker Memorial Spaceport", "Samson & Son's Salvage Center",
            "Shubin Mining Facility SAL-2", "Shubin Mining Facility SAL-5",
            "Teasa Spaceport in Lorville"
        ],
        stellar: [
            "ARC-L1 Wide Forest Station", "ARC-L2 Lively Pathway Station",
            "ARC-L3 Modern Express Station", "ARC-L4 Faint Glen Station",
            "ARC-L5 Yellow Core Station", "ARC-LS Yellow Core Station",
            "Baijini Point", "CRU-L1 Ambitious Dream Station",
            "CRU-L4 Shallow Fields Station", "Everus Harbor",
            "HUR-L2 Faithful Dream Station", "MIC-L1 Shallow Frontier Station",
            "MIC-L2 Long Forest Station", "Port Tressler", "Seraphim Station"
        ]
    },
    crusader: {
        planetary: [
            "August Dunlow Spaceport", "Brio's Breaker Yard", "Deakins Research Outpost",
            "Everus Harbor", "HDPC-Cassillo", "Seraphim Station", "Shubin Mining Facility",
            "Teasa Spaceport in Lorville", "Terra Mills HydroFarm"
        ],
        stellar: [
            "ARC-L1 Wide Forest Station", "ARC-L2 Lively Pathway Station",
            "ARC-L5 Yellow Core Station", "ARC-LS Yellow Core Station",
            "Baijini Point", "Beautiful Glen Station", "CRU-L1 Ambitious Dream Station",
            "CRU-L4 Shallow Fields Station", "CRU-L5 Beautiful Glen Station",
            "Everus Harbor", "HUR-L2 Faithful Dream Station",
            "MIC-L1 Shallow Frontier Station", "MIC-L2 Long Forest Station",
            "Port Tressler", "Seraphim Station", "Shallow Fields Station"
        ]
    },
    nyx: {
        interstellar: [
            "Areal8", "Baijini Point", "Everus Harbor", "Grim HEX", "Levski",
            "Seraphim Station"
        ]
    },
    // Universal Interstellar locations (system-agnostic)
    universal: {
        interstellar: [
            "Areal8", "ARC-L1 Wide Forest Station", "ARC-L2 Lively Pathway Station",
            "ARC-L3 Modern Express Station", "ARC-L4 Faint Glen Station",
            "ARC-L5 Yellow Core Station", "ArcCorp Mining Area 045",
            "ArcCorp Mining Area 048", "ArcCorp Mining Area 056",
            "ArcCorp Mining Area 061", "August Dunlow Spaceport",
            "Baijini Point", "Beautiful Glen Station", "Brio's Breaker Yard",
            "Bueno Ravine", "Canard View", "Chawla Beach", "CRU-L1 Ambitious Dream Station",
            "CRU-L4 Shallow Fields Station", "CRU-L5 Beautiful Glen Station",
            "Deakins Research Outpost", "Everus Harbor", "Grim HEX",
            "HDMS-Hahn", "HDMS-Thedus", "HDPC-Cassillo", "HDPC-Farnesway",
            "HUR-L1 Green Glade Station", "HUR-L2 Faithful Dream Station",
            "HUR-L3 Thundering Express Station", "HUR-L4 Melodic Fields Station",
            "Jackson's Swap", "Levski", "MIC-L1 Shallow Frontier Station",
            "MIC-L2 Long Forest Station", "Port Tressler",
            "Rayari", "Rayari McGrath", "Riker Memorial Spaceport", "Ruin Station",
            "Sacren's Plot", "Samson & Son's Salvage Center", "Seraphim Station",
            "Shepherd's Rest", "Shubin Mining Facility SAL-2",
            "Shubin Mining Facility SAL-5", "Shubin SAL-5", "Shubin SMO-18",
            "Teasa Spaceport", "Terra Mills HydroFarm"
        ]
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.LOCATIONS_DATABASE = LOCATIONS_DATABASE;
}
