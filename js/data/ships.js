/**
 * Ships Database
 * All available ships with their cargo capacities
 * Sorted alphabetically by name
 */

const SHIPS_DATABASE = [
    {id: "aegis_avenger_titan", name: "Aegis Avenger Titan", capacity: 8},
    {id: "aegis_reclaimer", name: "Aegis Reclaimer", capacity: 420},
    {id: "anvil_carrack", name: "Anvil Carrack", capacity: 456, grids: 9},
    {id: "anvil_valkyrie", name: "Anvil Valkyrie", capacity: 90},
    {id: "argo_raft", name: "Argo RAFT", capacity: 96},
    {id: "consolidated_outland_nomad", name: "Consolidated Outland Nomad", capacity: 24},
    {id: "crusader_hercules_a2", name: "Crusader Hercules A2", capacity: 216},
    {id: "crusader_hercules_c2", name: "Crusader Hercules C2", capacity: 696},
    {id: "crusader_hercules_m2", name: "Crusader Hercules M2", capacity: 522},
    {id: "crusader_intrepid", name: "Crusader Intrepid", capacity: 8},
    {id: "crusader_mercury_star_runner", name: "Crusader Mercury Star Runner", capacity: 114},
    {id: "crusader_spirit_c1", name: "Crusader Spirit C1", capacity: 64},
    {id: "crusader_starlancer_max", name: "Crusader Starlancer MAX", capacity: 224, grids: 4},
    {id: "crusader_starlancer_tac", name: "Crusader Starlancer TAC", capacity: 96},
    {id: "drake_caterpillar", name: "Drake Caterpillar", capacity: 576, grids: 5},
    {id: "drake_clipper", name: "Drake Clipper", capacity: 12},
    {id: "drake_corsair", name: "Drake Corsair", capacity: 72},
    {id: "drake_cutlass_black", name: "Drake Cutlass Black", capacity: 46},
    {id: "drake_cutter_rambler", name: "Drake Cutter Rambler", capacity: 2},
    {id: "drake_cutter_scout", name: "Drake Cutter Scout", capacity: 4},
    {id: "drake_vulture", name: "Drake Vulture", capacity: 12},
    {id: "gatac_syulen", name: "Gatac Syulen", capacity: 6},
    {id: "misc_freelancer", name: "MISC Freelancer", capacity: 66},
    {id: "misc_freelancer_dur", name: "MISC Freelancer DUR", capacity: 36},
    {id: "misc_freelancer_max", name: "MISC Freelancer MAX", capacity: 122},
    {id: "misc_hull_a", name: "MISC Hull A", capacity: 64},
    {id: "misc_hull_c", name: "MISC Hull C", capacity: 4608},
    {id: "misc_odyssey", name: "MISC Odyssey", capacity: 252},
    {id: "misc_reliant_kore", name: "MISC Reliant Kore", capacity: 6},
    {id: "misc_reliant_tana", name: "MISC Reliant Tana", capacity: 1},
    {id: "misc_starfarer", name: "MISC Starfarer", capacity: 291},
    {id: "misc_starfarer_gemini", name: "MISC Starfarer Gemini", capacity: 291},
    {id: "origin_125a", name: "Origin 125a", capacity: 2},
    {id: "origin_300i", name: "Origin 300i", capacity: 8},
    {id: "origin_315p", name: "Origin 315p", capacity: 12},
    {id: "origin_325a", name: "Origin 325a", capacity: 4},
    {id: "origin_400i", name: "Origin 400i", capacity: 42},
    {id: "origin_600i_explorer", name: "Origin 600i Explorer", capacity: 48},
    {id: "origin_600i_touring", name: "Origin 600i Touring", capacity: 20},
    {id: "origin_890_jump", name: "Origin 890 Jump", capacity: 388},
    {id: "rsi_constellation_andromeda", name: "RSI Constellation Andromeda", capacity: 96},
    {id: "rsi_constellation_aquila", name: "RSI Constellation Aquila", capacity: 96},
    {id: "rsi_constellation_phoenix", name: "RSI Constellation Phoenix", capacity: 84},
    {id: "rsi_constellation_taurus", name: "RSI Constellation Taurus", capacity: 174},
    {id: "rsi_polaris", name: "RSI Polaris", capacity: 576},
    {id: "rsi_zeus_cl", name: "RSI Zeus CL", capacity: 128},
    {id: "rsi_zeus_es", name: "RSI Zeus ES", capacity: 32}
];

// Make available globally
if (typeof window !== 'undefined') {
    window.SHIPS_DATABASE = SHIPS_DATABASE;
}
