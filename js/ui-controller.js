/**
 * UI CONTROLLER MODULE
 * Handles UI state, statistics, theme management, and color picker for Hauler Helper
 * Version: 3.3.6
 */

// =============================================================================
// STATISTICS DISPLAY
// =============================================================================

/**
 * Update statistics display (payout, SCU, capacity)
 */
function updateStats() {
    // Calculate total payout
    let totalPayout = 0;
    missions.forEach(mission => {
        if (mission.payout) {
            // Handle both string ("40k") and number (40000) formats
            if (typeof mission.payout === 'string') {
                totalPayout += parseFloat(mission.payout.replace('k', '')) * 1000;
            } else if (typeof mission.payout === 'number') {
                totalPayout += mission.payout;
            }
        }
    });
    
    const payoutK = Math.floor(totalPayout / 1000);
    document.getElementById('totalPayout').textContent = payoutK + 'K';
    
    // Calculate total SCU
    let totalSCU = 0;
    missions.forEach(mission => {
        mission.commodities.forEach(commodity => {
            if (commodity.quantity) {
                totalSCU += parseInt(commodity.quantity) || 0;
            }
        });
    });
    
    document.getElementById('scuTotal').textContent = totalSCU;
    
    // Update capacity meter
    if (selectedShip) {
        const percentage = Math.min((totalSCU / selectedShip.capacity) * 100, 100);
        const fill = document.getElementById('capacityFill');
        fill.style.width = percentage + '%';
        
        if (totalSCU > selectedShip.capacity) {
            fill.classList.add('over-capacity');
        } else {
            fill.classList.remove('over-capacity');
        }
        
        document.getElementById('capacityText').textContent = 
            `${totalSCU} / ${selectedShip.capacity} SCU`;
    } else {
        document.getElementById('capacityText').textContent = '0 / 0 SCU';
        document.getElementById('capacityFill').style.width = '0%';
    }
}

// =============================================================================
// THEME MANAGEMENT
// =============================================================================

/**
 * Change application theme
 */
function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('haulerHelperTheme', theme);
    updateColorPalette();
    
    // Regenerate displays with new theme colors
    generateCargoGrid();
    generateRoutePlan();
}

/**
 * Load saved theme preference
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('haulerHelperTheme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('themeSelect').value = savedTheme;
    }
}

/**
 * Update color palette in color picker modal
 */
function updateColorPalette() {
    const theme = document.body.getAttribute('data-theme');
    const palette = window.THEME_COLOR_PALETTES[theme] || window.THEME_COLOR_PALETTES['stardust'];
    const container = document.getElementById('colorPalette');
    
    container.innerHTML = palette.map(color => 
        `<div class="color-option" style="background-color: ${color}" onclick="selectPresetColor('${color}')"></div>`
    ).join('');
}

// =============================================================================
// COLOR PICKER
// =============================================================================

/**
 * Open color picker modal for a location or cargo group
 */
function openColorPicker(location) {
    currentColorTarget = location;
    const modal = document.getElementById('colorPickerModal');
    modal.classList.add('active');
    
    // Set current color in custom picker
    let currentColor;
    if (cargoGroups[location]) {
        currentColor = cargoGroups[location].color;
    } else if (locationColors[location]) {
        currentColor = locationColors[location].color;
    } else {
        currentColor = '#4dd4ac';
    }
    
    document.getElementById('customColorInput').value = currentColor;
}

/**
 * Close color picker modal
 */
function closeColorPicker() {
    document.getElementById('colorPickerModal').classList.remove('active');
    currentColorTarget = null;
}

/**
 * Select a preset color from the palette
 */
function selectPresetColor(color) {
    document.getElementById('customColorInput').value = color;
}

/**
 * Confirm color selection and apply changes
 */
function confirmColor() {
    if (currentColorTarget) {
        const color = document.getElementById('customColorInput').value;
        
        // Check if it's a cargo group or location marker
        if (cargoGroups[currentColorTarget]) {
            cargoGroups[currentColorTarget].color = color;
            generateCargoGrid();
            generateRoutePlan(); // Update route planner colors too
        } else if (locationColors[currentColorTarget]) {
            locationColors[currentColorTarget].color = color;
            // Delivery organizer removed from v3.3.0+
        }
        
        saveSession();
    }
    closeColorPicker();
}

/**
 * Update marker label for a location
 */
function updateMarkerLabel(location, label) {
    if (locationColors[location]) {
        locationColors[location].label = label;
    }
    saveSession();
}

// =============================================================================
// TAB MANAGEMENT
// =============================================================================

/**
 * Switch between delivery organizer tabs (removed in v3.3.0, kept for compatibility)
 */
function switchDeliveryTab(tabName) {
    // This function is no longer used but kept for backwards compatibility
    console.log('switchDeliveryTab called (deprecated):', tabName);
}
