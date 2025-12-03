/**
 * Locations Database
 * All trading locations organized by mission category
 * Sorted alphabetically within each category
 */

const LOCATIONS_DATABASE = {
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
};

// Make available globally
if (typeof window !== 'undefined') {
    window.LOCATIONS_DATABASE = LOCATIONS_DATABASE;
}
