/**
 * Commodities Database
 * All tradeable commodities organized by system and category
 * Sorted alphabetically within each category
 */

const COMMODITIES_DATABASE = {
    microtech: {
        planetary: [
            "Agri Supplies", "Aluminum", "C Materials", "Carbon", "Corundum", "Hydrogen Fuel",
            "Press Ice", "Proc Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammo",
            "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"
        ],
        local: [
            "Agri Supplies", "Corundum", "Hydrogen Fuel", "Press Ice", "Proc Food",
            "Quantum Fuel", "Quartz", "Scrap", "Ship Ammo", "Stims", "Waste"
        ],
        stellar: [
            "Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum", "Hydrogen Fuel",
            "Pressurized Ice", "Processed Food", "Quartz", "Scrap", "Tin", "Titanium",
            "Tungsten", "Waste"
        ],
        interstellar: [
            "Argon", "Atlasium", "Cobalt", "Distilled Spirits", "Fresh Food", "Hydrogen Fuel",
            "Iodine", "Medical Supplies", "Nitrogen", "Organics",
            "Press Ice", "Processed Food", "Ranta Dung", "RMC", "Scrap", "Ship Ammo",
            "Souvenirs", "Stims", "ThermalFoam"
        ]
    },
    hurston: {
        planetary: [
            "Aluminum", "Carbon", "Construction Materials", "Copper", "Corundum",
            "Hydrogen Fuel", "Iron", "Pressurized Ice", "Processed Food", "Quantum Fuel",
            "Quartz", "Scrap", "Ship Ammo", "Silicon", "Stims", "Tin", "Titanium",
            "Tungsten", "Waste"
        ],
        local: [
            "Hydrogen Fuel", "Iron", "Press Ice", "Proc Food", "Quantum Fuel",
            "Ship Ammo", "Waste", "Stims"
        ],
        stellar: [
            "Agricultural Supplies", "Aluminum", "Carbon", "Copper", "Corundum",
            "Hydrogen Fuel", "Iron", "Pressurized Ice", "Processed Food", "Quantum Fuel",
            "Quartz", "Ship Ammo", "Silicon", "Stims", "Tin", "Titanium",
            "Tungsten", "Waste"
        ],
        interstellar: [
            "Agricultural Supplies", "Argon", "Atlasium", "Cobalt", "Distilled Spirits",
            "Fresh Food", "Hydrogen Fuel", "Iodine", "Laranite",
            "Medical Supplies", "Nitrogen", "Organics", "Press Ice", "Processed Food",
            "RMC", "Ranta Dung", "Scrap", "Ship Ammo", "Souvenirs", "Stims", "ThermalFoam"
        ]
    },
    arccorp: {
        planetary: [
            "Aluminum", "Carbon", "Corundum", "Hydrogen", "Pressurized Ice", "Processed Food",
            "Quantum Fuel", "Quartz", "Scrap", "Ship Ammo", "Silicon", "Stims", "Tin",
            "Titanium", "Tungsten", "Waste"
        ],
        stellar: [
            "Agricultural Supplies", "Aluminum", "Carbon", "Corundum", "Hydrogen",
            "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz", "Scrap",
            "Ship Ammo", "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"
        ]
    },
    crusader: {
        planetary: [
            "Agricultural Supplies", "Aluminum", "Carbon", "Copper", "Corundum", "Hydrogen",
            "Iron", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz",
            "Scrap", "Ship Ammo", "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"
        ],
        stellar: [
            "Agricultural Supplies", "Aluminum", "Carbon", "Copper", "Corundum", "Hydrogen",
            "Iron", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz",
            "Scrap", "Ship Ammo", "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"
        ]
    },
    nyx: {
        interstellar: [
            "Agricium", "Atlasium", "Copper", "Hydrogen", "Iron", "Laranite", "Mercury",
            "Souvenirs", "Titanium", "Tungsten"
        ]
    },
    // Universal Interstellar commodities (system-agnostic)
    universal: {
        interstellar: [
            "Agricium", "Agricultural Supplies", "Aluminum", "Argon", "Atlasium", "Carbon",
            "Cobalt", "Copper", "Corundum", "Distilled Spirits", "Fresh Food", "Hydrogen",
            "Iodine", "Iron", "Laranite", "Medical Supplies", "Mercury", "Nitrogen",
            "Organics", "Pressurized Ice", "Processed Food", "Quantum Fuel", "Quartz",
            "Ranta Dung", "RMC", "Scrap", "Ship Ammo", "Silicon", "Souvenirs", "Stims",
            "ThermalFoam", "Tin", "Titanium", "Tungsten", "Waste"
        ]
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.COMMODITIES_DATABASE = COMMODITIES_DATABASE;
}
