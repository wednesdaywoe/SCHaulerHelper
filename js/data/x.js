/**
 * COMMODITIES DATABASE - Star Citizen Hauler Helper
 * 
 * STRUCTURE: Organized by SYSTEM first, then CATEGORY
 * commodities[system][category] = [...commodities]
 */

const COMMODITIES_DATABASE = {
    microtech: {
        planetary: [
            "Agricultural Supplies", "Aluminum", "Construction Materials", "Carbon", "Corundum",
            "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz",
            "Scrap", "Ship Ammunition", "Silicon", "Stims", "Tin", "Titanium",
            "Tungsten", "Waste"
        ],
        local: [
            "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food",
            "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Stims", "Waste"
        ],
        stellar: [
            "Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum",
            "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quartz", "Scrap",
            "Tin", "Titanium", "Tungsten", "Waste"
        ]
    },
    
    hurston: {
        planetary: ["Agricultural Supplies", "Aluminum", "Construction Materials", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"],
        local: ["Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Stims", "Waste"],
        stellar: ["Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quartz", "Scrap", "Tin", "Titanium", "Tungsten", "Waste"]
    },
    
    arccorp: {
        planetary: ["Agricultural Supplies", "Aluminum", "Construction Materials", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"],
        local: ["Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Stims", "Waste"],
        stellar: ["Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quartz", "Scrap", "Tin", "Titanium", "Tungsten", "Waste"]
    },
    
    crusader: {
        planetary: ["Agricultural Supplies", "Aluminum", "Construction Materials", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"],
        local: ["Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Stims", "Waste"],
        stellar: ["Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quartz", "Scrap", "Tin", "Titanium", "Tungsten", "Waste"]
    },
    
    nyx: {
        planetary: ["Agricultural Supplies", "Aluminum", "Construction Materials", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"],
        local: ["Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammunition", "Stims", "Waste"],
        stellar: ["Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quartz", "Scrap", "Tin", "Titanium", "Tungsten", "Waste"]
    },
    
    universal: {
        interstellar: ["Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum", "Hydrogen Fuel", "Pressurized Ice", "Processed Food", "Quartz", "Scrap", "Tin", "Titanium", "Tungsten", "Waste"]
    }
};

if (typeof window !== 'undefined') { window.COMMODITIES_DATABASE = COMMODITIES_DATABASE; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { COMMODITIES_DATABASE }; }
