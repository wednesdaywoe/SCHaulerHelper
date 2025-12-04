/**
 * Commodities Database
 * All tradeable commodities organized by mission category
 * Sorted alphabetically within each category
 */

const COMMODITIES_DATABASE = {
    planetary: [
        "Agri Supplies", "Aluminum", "C Materials", "Carbon", "Corundum", "Hydrogen",
        "Press Ice", "Proc Food", "Quantum Fuel", "Quartz", "Scrap", "Ship Ammo",
        "Silicon", "Stims", "Tin", "Titanium", "Tungsten", "Waste"
    ],
    local: [
        "Agri Supplies", "Corundum", "Hydrogen Fuel", "Press Ice", "Proc Food", "Quantum Fuel",
        "Quartz", "Scrap", "Ship Ammo", "Stims", "Waste"
    ],
    stellar: [
        "Agricultural Supplies", "Aluminum", "Beryl", "Carbon", "Corundum", "Hydrogen",
        "Pressurized Ice", "Processed Food", "Quartz", "Scrap", "Tin", "Titanium",
        "Tungsten", "Waste"
    ],
    interstellar: [
        "Argon", "Atlasium", "Cobalt", "Distilled Spirits", "Fresh Food", "Hydrogen",
        "Hydrogen Fuel", "Iodine", "Medical Supplies", "Nitrogen", "Organics",
        "Press Ice", "Processed Food", "Ranta Dung", "RMC", "Scrap", "Ship Ammo",
        "Souvenirs", "Stims", "ThermalFoam"
    ]
};

// Make available globally
if (typeof window !== 'undefined') {
    window.COMMODITIES_DATABASE = COMMODITIES_DATABASE;
}
