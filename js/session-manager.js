/**
 * SESSION MANAGER MODULE
 * Handles session persistence, data export, and reset functionality for Hauler Helper
 * Version: 3.3.6
 */

// =============================================================================
// SESSION PERSISTENCE
// =============================================================================

/**
 * Save current session to localStorage
 */
function saveSession() {
    console.log('💾 saveSession() called! Current state:', {
        ship: selectedShip?.id,
        system: selectedSystem,
        category: selectedCategory,
        missionsCount: missions.length
    });
    const session = {
        ship: selectedShip?.id,
        system: selectedSystem,
        category: selectedCategory,
        missions: missions,
        locationColors: locationColors,
        cargoGroups: cargoGroups,
        routeStepCompletion: window.RouteState ? window.RouteState.getCompletion() : {},
        routeViewMode: window.RouteState ? window.RouteState.getViewMode() : 'all',
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('haulerHelperSession', JSON.stringify(session));
}

/**
 * Load saved session from localStorage
 */
function loadSession() {
    console.log('🔵 loadSession() called!');
    const saved = localStorage.getItem('haulerHelperSession');
    if (!saved) {
        console.log('No saved session found');
        return;
    }
    
    try {
        isLoadingSession = true;
        const session = JSON.parse(saved);
        console.log('📂 Session data loaded:', {
            ship: session.ship,
            system: session.system,
            category: session.category,
            missionsCount: session.missions?.length,
            timestamp: session.timestamp
        });
        
        // Restore selections
        if (session.ship) {
            selectedShip = ships.find(s => s.id === session.ship);
            if (selectedShip) {
                document.getElementById('shipSelect').value = selectedShip.name;
            }
        }
        if (session.system) {
            document.getElementById('systemSelect').value = session.system;
            selectedSystem = session.system;
        }
        if (session.category) {
            document.getElementById('categorySelect').value = session.category;
            selectedCategory = session.category;
        }
        
        // Restore missions
        if (session.missions) {
            missions = session.missions;
            missionCounter = missions.length;
            
            const container = document.getElementById('missionsContainer');
            container.innerHTML = '';
            
            missions.forEach((mission, index) => {
                const panel = createMissionPanel(mission.id, index + 1);
                container.appendChild(panel);
                
                // Set payout in text input
                const payoutInput = panel.querySelector('.payout-input');
                if (payoutInput && mission.payout) {
                    payoutInput.value = mission.payout;
                }
                
                // Restore commodities
                const commoditiesContainer = document.getElementById(`${mission.id}_commodities`);
                mission.commodities.forEach((commodity, cIndex) => {
                    const row = createCommodityRow(mission.id, commodity.id, cIndex > 0);
                    commoditiesContainer.appendChild(row);
                    
                    // Set values - updated for new input structure
                    const textInputs = row.querySelectorAll('input[type="text"]');
                    const selects = row.querySelectorAll('select');
                    const numberInput = row.querySelector('input[type="number"]');
                    
                    // Set location inputs (text inputs)
                    if (textInputs[0]) textInputs[0].value = commodity.pickup || '';
                    if (textInputs[1]) textInputs[1].value = commodity.destination || '';
                    
                    // Set commodity and maxBoxSize selects
                    if (selects[0]) selects[0].value = commodity.commodity || '';
                    if (selects[1]) selects[1].value = commodity.maxBoxSize || '4';
                    
                    // Set quantity input
                    if (numberInput) numberInput.value = commodity.quantity || '';
                });
            });
        }
        
        // Restore location colors
        if (session.locationColors) {
            locationColors = session.locationColors;
        }
        
        // Restore cargo groups
        if (session.cargoGroups) {
            cargoGroups = session.cargoGroups;
        }
        
        // Restore route completion state (via module)
        if (session.routeStepCompletion) {
            window.RouteState.setCompletion(session.routeStepCompletion);
        }
        
        // Restore route view mode (via module)  
        if (session.routeViewMode) {
            window.RouteState.setViewMode(session.routeViewMode);
        }
        
        generateCargoGrid();
        generateRoutePlan();
        updateStats();
        
        isLoadingSession = false;
        console.log('✅ Session loaded successfully');
    } catch (e) {
        console.error('Error loading session:', e);
        isLoadingSession = false;
    }
}

// =============================================================================
// DATA EXPORT
// =============================================================================

/**
 * Export session data as JSON
 */
function exportSessionData() {
    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            version: '3.3.6',
            ship: selectedShip ? selectedShip.name : null,
            system: selectedSystem,
            category: selectedCategory
        },
        missions: missions.map((mission, index) => ({
            missionNumber: index + 1,
            missionId: mission.id,
            payout: mission.payout,
            commodities: mission.commodities.map(c => ({
                commodity: c.commodity,
                pickup: c.pickup,
                destination: c.destination,
                quantity: c.quantity,
                maxBoxSize: c.maxBoxSize
            }))
        })),
        stats: {
            totalPayout: document.getElementById('totalPayout').textContent,
            totalSCU: document.getElementById('scuTotal').textContent,
            capacity: selectedShip ? `${document.getElementById('scuTotal').textContent} / ${selectedShip.capacity}` : 'N/A'
        },
        cargoGroups: cargoGroups,
        locationColors: locationColors
    };
    
    const filename = `hauler-helper-${selectedShip?.name || 'session'}-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(exportData, filename);
}

/**
 * Export session data as CSV
 */
function exportSessionCSV() {
    let csv = 'Mission,Payout,Commodity,Pickup,Quantity,Max Box,Destination\n';
    
    missions.forEach((mission, mIndex) => {
        mission.commodities.forEach(commodity => {
            if (commodity.commodity || commodity.pickup || commodity.destination) {
                csv += `${mIndex + 1},`;
                csv += `${mission.payout || ''},`;
                csv += `"${commodity.commodity || ''}",`;
                csv += `"${commodity.pickup || ''}",`;
                csv += `${commodity.quantity || ''},`;
                csv += `${commodity.maxBoxSize || '4'},`;
                csv += `"${commodity.destination || ''}"\n`;
            }
        });
    });
    
    const filename = `hauler-helper-${selectedShip?.name || 'session'}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}

// =============================================================================
// DOWNLOAD HELPERS
// =============================================================================

/**
 * Download data as JSON file
 */
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Download data as CSV file
 */
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =============================================================================
// RESET FUNCTIONS
// =============================================================================

/**
 * Reset all mission data but keep settings
 */
function resetMissions() {
    if (confirm('Clear all missions? This will remove all mission data but keep your ship and system selections.')) {
        missions = [];
        missionCounter = 0;
        locationColors = {};
        cargoGroups = {};
        
        document.getElementById('missionsContainer').innerHTML = '';
        generateCargoGrid();
        generateRoutePlan();
        updateStats();
        saveSession();
    }
}

/**
 * Reset everything including settings
 */
function resetAll() {
    if (confirm('Reset everything? This will clear all missions, selections, colors, and preferences. This cannot be undone.')) {
        // Clear all localStorage
        localStorage.removeItem('haulerHelperSession');
        localStorage.removeItem('haulerHelperTheme');
        localStorage.removeItem('haulerHelperDeliveryLayout');
        localStorage.removeItem('haulerHelperDeliveryOrder');
        localStorage.removeItem('haulerHelperCommodityOrder');
        localStorage.removeItem('haulerHelperOrganizerGroupBy');
        localStorage.removeItem('haulerHelperCargoGridLayout');
        localStorage.removeItem('haulerHelperCargoGridExpanded');
        localStorage.removeItem('haulerHelperRouteViewMode');
        
        // Reload the page to reset everything
        location.reload();
    }
}
