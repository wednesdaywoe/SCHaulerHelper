/**
 * SHIPS DATABASE - Star Citizen Hauler Helper
 * 
 * PROPERTIES:
 * - id: Unique identifier (snake_case)
 * - name: Display name
 * - manufacturer: Ship manufacturer
 * - capacity: Total cargo capacity in SCU
 * - grids: Number of cargo grids (if applicable)
 * 
 * SORTED: Alphabetically by manufacturer, then by name
 */

const SHIPS_DATABASE = [
    // AEGIS DYNAMICS
    {
        id: "aegis_avenger_titan",
        name: "Aegis Avenger Titan",
        manufacturer: "Aegis Dynamics",
        capacity: 8
    },
    {
        id: "aegis_reclaimer",
        name: "Aegis Reclaimer",
        manufacturer: "Aegis Dynamics",
        capacity: 420
    },
    
    // ANVIL AEROSPACE
    {
        id: "anvil_carrack",
        name: "Anvil Carrack",
        manufacturer: "Anvil Aerospace",
        capacity: 456,
        grids: 9
    },
    {
        id: "anvil_valkyrie",
        name: "Anvil Valkyrie",
        manufacturer: "Anvil Aerospace",
        capacity: 90
    },
    
    // ARGO ASTRONAUTICS
    {
        id: "argo_raft",
        name: "Argo RAFT",
        manufacturer: "Argo Astronautics",
        capacity: 96
    },
    
    // CONSOLIDATED OUTLAND
    {
        id: "consolidated_outland_nomad",
        name: "Consolidated Outland Nomad",
        manufacturer: "Consolidated Outland",
        capacity: 24
    },
    
    // CRUSADER INDUSTRIES
    {
        id: "crusader_hercules_a2",
        name: "Crusader Hercules A2",
        manufacturer: "Crusader Industries",
        capacity: 216
    },
    {
        id: "crusader_hercules_c2",
        name: "Crusader Hercules C2",
        manufacturer: "Crusader Industries",
        capacity: 696
    },
    {
        id: "crusader_hercules_m2",
        name: "Crusader Hercules M2",
        manufacturer: "Crusader Industries",
        capacity: 522
    },
    {
        id: "crusader_intrepid",
        name: "Crusader Intrepid",
        manufacturer: "Crusader Industries",
        capacity: 8
    },
    {
        id: "crusader_mercury_star_runner",
        name: "Crusader Mercury Star Runner",
        manufacturer: "Crusader Industries",
        capacity: 114
    },
    {
        id: "crusader_spirit_c1",
        name: "Crusader Spirit C1",
        manufacturer: "Crusader Industries",
        capacity: 64
    },
    
    
    // DRAKE INTERPLANETARY
    {
        id: "drake_caterpillar",
        name: "Drake Caterpillar",
        manufacturer: "Drake Interplanetary",
        capacity: 576,
        grids: 5
    },
    {
        id: "drake_clipper",
        name: "Drake Clipper",
        manufacturer: "Drake Interplanetary",
        capacity: 12
    },
    {
        id: "drake_corsair",
        name: "Drake Corsair",
        manufacturer: "Drake Interplanetary",
        capacity: 72
    },
    {
        id: "drake_cutlass_black",
        name: "Drake Cutlass Black",
        manufacturer: "Drake Interplanetary",
        capacity: 46
    },
    {
        id: "drake_cutter_rambler",
        name: "Drake Cutter Rambler",
        manufacturer: "Drake Interplanetary",
        capacity: 2
    },
    {
        id: "drake_cutter_scout",
        name: "Drake Cutter Scout",
        manufacturer: "Drake Interplanetary",
        capacity: 4
    },
    {
        id: "drake_vulture",
        name: "Drake Vulture",
        manufacturer: "Drake Interplanetary",
        capacity: 12
    },
    
    // GATAC MANUFACTURE
    {
        id: "gatac_syulen",
        name: "Gatac Syulen",
        manufacturer: "Gatac Manufacture",
        capacity: 6
    },
    
    // MISC (Musashi Industrial & Starflight Concern)
    {
        id: "misc_freelancer",
        name: "MISC Freelancer",
        manufacturer: "MISC",
        capacity: 66
    },
    {
        id: "misc_freelancer_dur",
        name: "MISC Freelancer DUR",
        manufacturer: "MISC",
        capacity: 36
    },
    {
        id: "misc_freelancer_max",
        name: "MISC Freelancer MAX",
        manufacturer: "MISC",
        capacity: 122
    },
    {
        id: "misc_hull_a",
        name: "MISC Hull A",
        manufacturer: "MISC",
        capacity: 64
    },
    {
        id: "misc_hull_c",
        name: "MISC Hull C",
        manufacturer: "MISC",
        capacity: 4608
    },
    {
        id: "misc_odyssey",
        name: "MISC Odyssey please CIG <3 xoxoxo",
        manufacturer: "MISC",
        capacity: 252
    },
    {
        id: "misc_reliant_kore",
        name: "MISC Reliant Kore",
        manufacturer: "MISC",
        capacity: 6
    },
    {
        id: "misc_reliant_tana",
        name: "MISC Reliant Tana",
        manufacturer: "MISC",
        capacity: 1
    },
    {
        id: "misc_starfarer",
        name: "MISC Starfarer",
        manufacturer: "MISC",
        capacity: 291
    },
    {
        id: "misc_starfarer_gemini",
        name: "MISC Starfarer Gemini",
        manufacturer: "MISC",
        capacity: 291
    },
    {
        id: "misc_starlancer_max",
        name: "MISC Starlancer MAX",
        manufacturer: "MISC",
        capacity: 224,
        grids: 4
    },
    {
        id: "misc_starlancer_tac",
        name: "MISC Starlancer TAC",
        manufacturer: "MISC",
        capacity: 96
    },
    // ORIGIN JUMPWORKS
    {
        id: "origin_125a",
        name: "Origin 125a",
        manufacturer: "Origin Jumpworks",
        capacity: 2
    },
    {
        id: "origin_300i",
        name: "Origin 300i",
        manufacturer: "Origin Jumpworks",
        capacity: 8
    },
    {
        id: "origin_315p",
        name: "Origin 315p",
        manufacturer: "Origin Jumpworks",
        capacity: 12
    },
    {
        id: "origin_325a",
        name: "Origin 325a",
        manufacturer: "Origin Jumpworks",
        capacity: 4
    },
    {
        id: "origin_400i",
        name: "Origin 400i",
        manufacturer: "Origin Jumpworks",
        capacity: 42
    },
    {
        id: "origin_600i_explorer",
        name: "Origin 600i Explorer",
        manufacturer: "Origin Jumpworks",
        capacity: 48
    },
    {
        id: "origin_600i_touring",
        name: "Origin 600i Touring",
        manufacturer: "Origin Jumpworks",
        capacity: 20
    },
    {
        id: "origin_890_jump",
        name: "Origin 890 Jump",
        manufacturer: "Origin Jumpworks",
        capacity: 388
    },
    
    // RSI (Roberts Space Industries)
    {
        id: "rsi_constellation_andromeda",
        name: "RSI Constellation Andromeda",
        manufacturer: "Roberts Space Industries",
        capacity: 96
    },
    {
        id: "rsi_constellation_aquila",
        name: "RSI Constellation Aquila",
        manufacturer: "Roberts Space Industries",
        capacity: 96
    },
    {
        id: "rsi_constellation_phoenix",
        name: "RSI Constellation Phoenix",
        manufacturer: "Roberts Space Industries",
        capacity: 84
    },
    {
        id: "rsi_constellation_taurus",
        name: "RSI Constellation Taurus",
        manufacturer: "Roberts Space Industries",
        capacity: 174
    },
    {
        id: "rsi_polaris",
        name: "RSI Polaris",
        manufacturer: "Roberts Space Industries",
        capacity: 576
    },
    {
        id: "rsi_zeus_cl",
        name: "RSI Zeus CL",
        manufacturer: "Roberts Space Industries",
        capacity: 128
    },
    {
        id: "rsi_zeus_es",
        name: "RSI Zeus ES",
        manufacturer: "Roberts Space Industries",
        capacity: 32
    }
];

/**
 * SHIP LOOKUP UTILITIES
 */
const SHIP_UTILS = {
    /**
     * Find ship by ID
     * @param {string} id - Ship ID
     * @returns {Object|null} - Ship object or null
     */
    findById(id) {
        return SHIPS_DATABASE.find(ship => ship.id === id) || null;
    },
    
    /**
     * Find ship by name
     * @param {string} name - Ship name
     * @returns {Object|null} - Ship object or null
     */
    findByName(name) {
        return SHIPS_DATABASE.find(ship => ship.name === name) || null;
    },
    
    /**
     * Get all ships by manufacturer
     * @param {string} manufacturer - Manufacturer name
     * @returns {Array} - Array of ship objects
     */
    getByManufacturer(manufacturer) {
        return SHIPS_DATABASE.filter(ship => ship.manufacturer === manufacturer);
    },
    
    /**
     * Get ships within capacity range
     * @param {number} minCapacity - Minimum capacity
     * @param {number} maxCapacity - Maximum capacity
     * @returns {Array} - Array of ship objects
     */
    getByCapacityRange(minCapacity, maxCapacity) {
        return SHIPS_DATABASE.filter(ship => 
            ship.capacity >= minCapacity && ship.capacity <= maxCapacity
        );
    }
};

// Export for browser (window object)
if (typeof window !== 'undefined') {
    window.SHIPS_DATABASE = SHIPS_DATABASE;
    window.SHIP_UTILS = SHIP_UTILS;
}

// Export for Node.js (module system)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SHIPS_DATABASE, SHIP_UTILS };
}
