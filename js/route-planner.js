/**
 * ROUTE PLANNER MODULE
 * Handles route generation, optimization, and rendering for Hauler Helper
 * Version: 3.3.6
 */

// =============================================================================
// ROUTE PLANNER STATE
// =============================================================================

let routeStops = []; // Store current route stops for reordering
let routeStepCompletion = {}; // Track which route steps are completed
let routeViewMode = 'all'; // 'all', 'current', 'current-next'

/**
 * Normalize a location string for consistent comparison
 * Trims whitespace and converts to lowercase for matching,
 * but preserves original case for display
 */
function normalizeLocation(location) {
    if (!location) return '';
    return location.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Get or create a canonical location key, preserving the first-seen display name
 * @param {string} location - The location string to normalize
 * @param {Object} canonicalNames - Map of normalized keys to display names
 * @returns {string} - The normalized key
 */
function getCanonicalLocationKey(location, canonicalNames) {
    const normalized = normalizeLocation(location);
    if (!canonicalNames[normalized]) {
        canonicalNames[normalized] = location.trim(); // Store first-seen display name
    }
    return normalized;
}

// =============================================================================
// ROUTE GENERATION
// =============================================================================

/**
 * Generate optimized route plan based on current missions
 * Creates efficient delivery routes that minimize stops
 */
function generateRoutePlan() {
    const container = document.getElementById('routePlanner');
    
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('🚀 STARTING ROUTE GENERATION');
    console.log('═══════════════════════════════════════════════');
    
    // Build comprehensive location map
    const locationMap = {}; // { normalizedLocation: { pickups: [], deliveries: [], displayName: string } }
    const canonicalNames = {}; // Map of normalized keys to display names

    missions.forEach((mission, missionIndex) => {
        mission.commodities.forEach(commodity => {
            if (!commodity.pickup || !commodity.destination || !commodity.commodity || !commodity.quantity) {
                return;
            }

            const scu = parseInt(commodity.quantity) || 0;
            const pickupRaw = commodity.pickup;
            const destinationRaw = commodity.destination;

            // Normalize locations to prevent duplicates from case/whitespace differences
            const pickup = getCanonicalLocationKey(pickupRaw, canonicalNames);
            const destination = getCanonicalLocationKey(destinationRaw, canonicalNames);

            // Initialize location entries with display names
            if (!locationMap[pickup]) {
                locationMap[pickup] = { pickups: [], deliveries: [], displayName: canonicalNames[pickup] };
            }
            if (!locationMap[destination]) {
                locationMap[destination] = { pickups: [], deliveries: [], displayName: canonicalNames[destination] };
            }

            // Add pickup action (use normalized destination for grouping)
            locationMap[pickup].pickups.push({
                missionNum: missionIndex + 1,
                commodity: commodity.commodity,
                scu: scu,
                destination: destination, // Normalized key
                destinationDisplay: canonicalNames[destination], // Display name
                maxBoxSize: parseInt(commodity.maxBoxSize) || 4,
                id: `m${missionIndex + 1}-${pickup}-${commodity.commodity}-${destination}` // Unique ID with normalized locations
            });

            // Add delivery action
            locationMap[destination].deliveries.push({
                missionNum: missionIndex + 1,
                commodity: commodity.commodity,
                scu: scu,
                pickup: pickup, // Normalized key
                pickupDisplay: canonicalNames[pickup], // Display name
                id: `m${missionIndex + 1}-${pickup}-${commodity.commodity}-${destination}` // Same ID as pickup
            });
        });
    });
    
    if (Object.keys(locationMap).length === 0) {
        container.innerHTML = '<div class="empty-state">No route planned</div>';
        console.log('❌ No locations in map - aborting route generation');
        return;
    }
    
    // DEBUG: Show location map contents
    console.log('📋 LOCATION MAP BUILT:');
    Object.entries(locationMap).forEach(([loc, data]) => {
        const pickupSCU = data.pickups.reduce((s, p) => s + p.scu, 0);
        const deliverySCU = data.deliveries.reduce((s, d) => s + d.scu, 0);
        console.log(`  ${data.displayName} (key: ${loc}):`);
        if (data.pickups.length > 0) {
            console.log(`    📦 Pickups: ${pickupSCU} SCU (${data.pickups.length} items)`);
            data.pickups.forEach(p => {
                console.log(`       - Mission ${p.missionNum}: ${p.commodity} ${p.scu} SCU → ${p.destinationDisplay}`);
            });
        }
        if (data.deliveries.length > 0) {
            console.log(`    📭 Deliveries: ${deliverySCU} SCU (${data.deliveries.length} items)`);
            data.deliveries.forEach(d => {
                console.log(`       - Mission ${d.missionNum}: ${d.commodity} ${d.scu} SCU from ${d.pickupDisplay}`);
            });
        }
    });
    console.log('');
    
    // Assign colors to cargo groups (by destination)
    const theme = document.body.getAttribute('data-theme');
    const palette = window.THEME_COLOR_PALETTES[theme] || window.THEME_COLOR_PALETTES['stardust'];
    let groupIndex = Object.keys(cargoGroups).length; // Start from existing count
    
    // Assign groups for each destination
    Object.keys(locationMap).forEach(location => {
        if (locationMap[location].pickups.length > 0) {
            locationMap[location].pickups.forEach(pickup => {
                if (!cargoGroups[pickup.destination]) {
                    const groupLetter = String.fromCharCode(65 + groupIndex);
                    cargoGroups[pickup.destination] = {
                        label: groupLetter,
                        color: palette[groupIndex % palette.length]
                    };
                    groupIndex++;
                }
            });
        }
    });
    
    // Build optimized route - ENHANCED with route solver fixes
    const stops = [];
    const cargoOnBoard = new Set(); // Track IDs of cargo currently on ship
    const allPickupIds = new Set();
    const allDeliveryIds = new Set();
    
    // Collect all pickup and delivery IDs
    Object.values(locationMap).forEach(loc => {
        loc.pickups.forEach(p => allPickupIds.add(p.id));
        loc.deliveries.forEach(d => allDeliveryIds.add(d.id));
    });
    
    let currentCargo = 0;
    const shipCapacity = selectedShip ? selectedShip.capacity : 999999;
    
    // FIX: Identify primary warehouse as location with BOTH pickups AND deliveries
    // Warehouse = distribution hub with cargo going to MANY destinations
    const warehouseLocations = Object.entries(locationMap)
        .filter(([loc, data]) => 
            data.pickups.length > 0 && 
            data.deliveries.length > 0
        );
    
    // Sort by: 1) distinct destinations, 2) pickup count, 3) pickup SCU
    const primaryWarehouse = warehouseLocations
        .sort((a, b) => {
            // Count distinct destinations for pickups
            const aDestinations = new Set(a[1].pickups.map(p => p.destination)).size;
            const bDestinations = new Set(b[1].pickups.map(p => p.destination)).size;
            if (aDestinations !== bDestinations) return bDestinations - aDestinations;
            
            // If tied, sort by number of pickup items
            const aPickupCount = a[1].pickups.length;
            const bPickupCount = b[1].pickups.length;
            if (aPickupCount !== bPickupCount) return bPickupCount - aPickupCount;
            
            // If still tied, sort by pickup SCU
            const aPickupSCU = a[1].pickups.reduce((s, p) => s + p.scu, 0);
            const bPickupSCU = b[1].pickups.reduce((s, p) => s + p.scu, 0);
            return bPickupSCU - aPickupSCU;
        })[0]?.[0];
    
    console.log('🏭 WAREHOUSE IDENTIFICATION:');
    console.log('  Warehouse locations (have both pickups & deliveries):', 
        warehouseLocations.map(([loc, data]) => {
            const pickupSCU = data.pickups.reduce((s, p) => s + p.scu, 0);
            const deliverySCU = data.deliveries.reduce((s, d) => s + d.scu, 0);
            const destinations = new Set(data.pickups.map(p => p.destination)).size;
            return `${loc} (${pickupSCU} SCU pickup to ${destinations} destinations, ${deliverySCU} SCU delivery)`;
        }));
    console.log(`  Primary warehouse: ${primaryWarehouse}`);
    console.log('');
    
    // Keep visiting locations until everything is delivered
    let iteration = 0;
    while (allDeliveryIds.size > 0 || allPickupIds.size > 0) {
        iteration++;
        console.log(`\n━━━ ITERATION ${iteration} ━━━`);
        console.log(`Cargo on board: ${currentCargo} SCU`);
        console.log(`Pickups remaining: ${allPickupIds.size}`);
        console.log(`Deliveries remaining: ${allDeliveryIds.size}`);
        console.log(`Stops so far: ${stops.map(s => s.location).join(' → ')}`);
        console.log('');
        
        let bestLocation = null;
        let bestScore = -1;
        
        // Force first stop to be the primary warehouse (if it has pickups)
        if (primaryWarehouse && 
            stops.length === 0 && 
            locationMap[primaryWarehouse].pickups.some(p => allPickupIds.has(p.id))) {
            bestLocation = primaryWarehouse;
            console.log('✅ Forcing first stop to primary warehouse:', primaryWarehouse);
        } else {
            // Find the best next location to visit
            console.log('🔍 EVALUATING LOCATIONS:');
            for (const location of Object.keys(locationMap)) {
                const hasUnpickedCargo = locationMap[location].pickups.some(p => allPickupIds.has(p.id));
                const hasReadyDeliveries = locationMap[location].deliveries.some(d => cargoOnBoard.has(d.id));
                
                console.log(`  ${location}:`);
                console.log(`    - Has unpicked cargo: ${hasUnpickedCargo}`);
                console.log(`    - Has ready deliveries: ${hasReadyDeliveries}`);
                
                if (!hasUnpickedCargo && !hasReadyDeliveries) {
                    console.log(`    ⏭️  SKIP: Nothing to do here`);
                    continue;
                }
                
                // Block warehouse return if ANY non-warehouse location has pending deliveries
                const isWarehouse = location === primaryWarehouse;
                const hasDeliveriesHere = locationMap[location].deliveries.some(d => cargoOnBoard.has(d.id));
                
                console.log(`    - Is primary warehouse: ${isWarehouse}`);
                
                // GENERAL DELIVERY BLOCKING: Don't deliver to a location if pickups to that location are still pending
                if (hasDeliveriesHere) {
                    console.log(`    🔒 DELIVERY CHECK:`);
                    
                    // Check if there are still pickups destined for this location
                    const unpickedToHere = [];
                    for (const [loc, data] of Object.entries(locationMap)) {
                        const itemsToHere = data.pickups.filter(p => 
                            allPickupIds.has(p.id) && p.destination === location
                        ).length;
                        if (itemsToHere > 0) {
                            unpickedToHere.push(`${loc} (${itemsToHere} items)`);
                        }
                    }
                    
                    if (unpickedToHere.length > 0) {
                        console.log(`    🚫 BLOCKED: Unpicked cargo bound for here: ${unpickedToHere.join(', ')}`);
                        continue; // Skip - pick up all items for this location first
                    }
                    
                    console.log(`    ✅ ALLOWED: All items destined for ${location} have been picked up`);
                }
                
                // Score by actual SCU delivered/picked up (not just item count)
                const deliverySCU = locationMap[location].deliveries
                    .filter(d => cargoOnBoard.has(d.id))
                    .reduce((s, d) => s + d.scu, 0);
                
                const pickupSCU = locationMap[location].pickups
                    .filter(p => allPickupIds.has(p.id))
                    .reduce((s, p) => s + p.scu, 0);
                
                let score = 0;
                const deliveryScore = deliverySCU * 3;
                const pickupScore = pickupSCU * 2;
                const comboBonus = (deliverySCU > 0 && pickupSCU > 0) ? 200 : 0;
                
                score = deliveryScore + pickupScore + comboBonus;
                
                console.log(`    📊 SCORING:`);
                console.log(`       - Delivery: ${deliverySCU} SCU × 3 = ${deliveryScore}`);
                console.log(`       - Pickup: ${pickupSCU} SCU × 2 = ${pickupScore}`);
                console.log(`       - Combo bonus: ${comboBonus}`);
                console.log(`       - TOTAL SCORE: ${score}`);
                
                if (score > bestScore) {
                    console.log(`    ⭐ NEW BEST LOCATION!`);
                    bestScore = score;
                    bestLocation = location;
                }
            }
        }
        
        if (!bestLocation) {
            console.error('❌ Route planner: No valid next location found');
            console.log('   Final state:');
            console.log(`   - Pickups remaining: ${allPickupIds.size}`);
            console.log(`   - Deliveries remaining: ${allDeliveryIds.size}`);
            console.log(`   - Cargo on board IDs:`, Array.from(cargoOnBoard));
            break; // Safety check
        }
        
        console.log(`\n✅ SELECTED: ${bestLocation} (score: ${bestScore})`);
        
        // Visit this location and do ALL possible actions in ONE stop
        const loc = locationMap[bestLocation];
        const pickupsHere = loc.pickups.filter(p => allPickupIds.has(p.id));
        const deliveriesHere = loc.deliveries.filter(d => cargoOnBoard.has(d.id));
        
        if (pickupsHere.length === 0 && deliveriesHere.length === 0) {
            console.error('❌ Route planner: Selected location has no valid actions');
            break;
        }
        
        const deliverySCU = deliveriesHere.reduce((sum, d) => sum + d.scu, 0);
        const pickupSCU = pickupsHere.reduce((sum, p) => sum + p.scu, 0);
        
        const displayName = loc.displayName;
        console.log(`📍 STOP ${stops.length + 1}: ${displayName}`);
        if (deliveriesHere.length > 0) {
            console.log(`   📭 Delivering ${deliverySCU} SCU:`);
            deliveriesHere.forEach(d => {
                console.log(`      - Mission ${d.missionNum}: ${d.commodity} ${d.scu} SCU`);
            });
        }
        if (pickupsHere.length > 0) {
            console.log(`   📦 Picking up ${pickupSCU} SCU:`);
            pickupsHere.forEach(p => {
                console.log(`      - Mission ${p.missionNum}: ${p.commodity} ${p.scu} SCU → ${p.destinationDisplay}`);
            });
        }
        console.log(`   Cargo: ${currentCargo} → ${currentCargo - deliverySCU + pickupSCU} SCU`);

        // Record this stop (with both pickups AND deliveries)
        // Use displayName for rendering, but keep normalized key for lookups
        stops.push({
            location: displayName, // Use display name for UI
            locationKey: bestLocation, // Keep normalized key for internal lookups
            pickups: pickupsHere,
            deliveries: deliveriesHere,
            cargoBeforeStop: currentCargo,
            cargoAfterStop: currentCargo - deliverySCU + pickupSCU
        });
        
        // Update cargo state - deliveries first (free space), then pickups
        deliveriesHere.forEach(d => {
            cargoOnBoard.delete(d.id);
            allDeliveryIds.delete(d.id);
        });
        
        pickupsHere.forEach(p => {
            cargoOnBoard.add(p.id);
            allPickupIds.delete(p.id);
        });
        
        currentCargo = currentCargo - deliverySCU + pickupSCU;
    }
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ ROUTE GENERATION COMPLETE');
    console.log(`Total stops: ${stops.length}`);
    console.log(`Route: ${stops.map(s => s.location).join(' → ')}`);
    console.log('═══════════════════════════════════════════════\n');
    
    // Store stops and render
    routeStops = stops;
    renderRoutePlan(stops);
}

// =============================================================================
// ROUTE RENDERING
// =============================================================================

/**
 * Render route plan (separated so we can re-render after drag)
 */
function renderRoutePlan(stops) {
    const container = document.getElementById('routePlanner');
    const shipCapacity = selectedShip ? selectedShip.capacity : 999999;
    
    // Recalculate cargo levels based on current order
    let currentCargo = 0;
    stops.forEach(stop => {
        stop.cargoBeforeStop = currentCargo;
        const pickupSCU = stop.pickups.reduce((sum, p) => sum + p.scu, 0);
        const deliverySCU = stop.deliveries.reduce((sum, d) => sum + d.scu, 0);
        currentCargo = currentCargo - deliverySCU + pickupSCU;
        stop.cargoAfterStop = currentCargo;
    });
    
    // Determine which stops to show based on view mode
    let stopsToShow = stops;
    const currentIndex = getCurrentStepIndex(stops.length);
    
    if (routeViewMode === 'current') {
        stopsToShow = [stops[currentIndex]];
    } else if (routeViewMode === 'current-next') {
        if (currentIndex < stops.length - 1) {
            stopsToShow = [stops[currentIndex], stops[currentIndex + 1]];
        } else {
            stopsToShow = [stops[currentIndex]];
        }
    }
    
    container.innerHTML = `
        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
            Optimized Route - ${stops.length} Stops
        </div>
        ${stopsToShow.map((stop) => {
            // Find the actual index in the full stops array
            const actualIndex = stops.indexOf(stop);
            const hasDeliveries = stop.deliveries && stop.deliveries.length > 0;
            const hasPickups = stop.pickups && stop.pickups.length > 0;
            const isCompleted = routeStepCompletion[actualIndex];
            const isCurrent = actualIndex === currentIndex;
            
            // Compact view for completed stops
            if (isCompleted) {
                return `
                    <div class="route-stop route-stop-completed" data-stop-index="${actualIndex}">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="checkbox" 
                                   checked 
                                   onchange="toggleRouteStepCompletion(${actualIndex})"
                                   style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--color-success);">
                            <div style="flex: 1;">
                                <span style="font-weight: 600;">Stop ${actualIndex + 1}: ${stop.location}</span>
                                <span style="margin-left: 12px; color: var(--color-success);">✓ Completed</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Full view for non-completed stops
            return `
                <div class="route-stop ${isCurrent ? 'route-stop-current' : ''}" data-stop-index="${actualIndex}" draggable="true">
                    <div class="route-stop-header">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                            <input type="checkbox" 
                                   ${isCompleted ? 'checked' : ''} 
                                   onchange="toggleRouteStepCompletion(${actualIndex})"
                                   style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--color-success);">
                            <div class="route-stop-title">Stop ${actualIndex + 1}: ${stop.location}</div>
                        </div>
                        <div class="route-cargo-status">Cargo: ${stop.cargoAfterStop}/${selectedShip ? shipCapacity : '--'} SCU</div>
                    </div>
                    
                    ${hasDeliveries ? `
                        <div class="route-action-section">
                            <div class="route-action-header" style="color: var(--color-success);">
                                <span style="font-size: 16px; margin-right: 8px;">▼</span> DELIVERY
                            </div>
                            ${stop.deliveries.map(item => {
                                const group = cargoGroups[stop.locationKey || normalizeLocation(stop.location)];
                                return `
                                    <div class="route-mission-item" style="border-left: 3px solid ${group?.color || '#888'}; padding-left: 12px; margin-left: 20px;">
                                        <span class="mission-number">Mission ${item.missionNum}:</span>
                                        <span class="commodity">${item.commodity}</span>
                                        <span>(${item.scu} SCU)</span>
                                        <span style="color: ${group?.color || '#888'}; font-weight: 600; margin-left: 8px;">Group ${group?.label || '?'}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}

                    ${hasPickups ? `
                        <div class="route-action-section">
                            <div class="route-action-header" style="color: var(--color-warning);">
                                <span style="font-size: 16px; margin-right: 8px;">▲</span> PICKUP
                            </div>
                            ${stop.pickups.map(item => {
                                const group = cargoGroups[item.destination];
                                return `
                                    <div class="route-mission-item" style="border-left: 3px solid ${group?.color || '#888'}; padding-left: 12px; margin-left: 20px;">
                                        <span class="mission-number">Mission ${item.missionNum}:</span>
                                        <span class="commodity">${item.commodity}</span>
                                        <span>(${item.scu} SCU)</span>
                                        <span style="color: ${group?.color || '#888'}; font-weight: 600; margin-left: 8px;">→ Group ${group?.label || '?'}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('')}
    `;
}

// =============================================================================
// ROUTE COMPLETION MANAGEMENT
// =============================================================================

/**
 * Toggle completion status of a route stop
 */
function toggleRouteStepCompletion(stopIndex) {
    routeStepCompletion[stopIndex] = !routeStepCompletion[stopIndex];
    generateRoutePlan();
    saveSession();
}

/**
 * Change route view mode
 */
function changeRouteViewMode(mode) {
    routeViewMode = mode;
    generateRoutePlan();
    localStorage.setItem('haulerHelperRouteViewMode', mode);
}

/**
 * Load route view mode preference
 */
function loadRouteViewMode() {
    const saved = localStorage.getItem('haulerHelperRouteViewMode');
    if (saved) {
        routeViewMode = saved;
        const select = document.getElementById('routeViewModeSelect');
        if (select) select.value = saved;
    }
}

/**
 * Get current uncompleted step index
 */
function getCurrentStepIndex(totalSteps) {
    for (let i = 0; i < totalSteps; i++) {
        if (!routeStepCompletion[i]) {
            return i;
        }
    }
    return totalSteps - 1; // All completed, show last one
}

/**
 * Reset all route completion checkboxes
 */
function resetRouteCompletion() {
    routeStepCompletion = {};
    generateRoutePlan();
    saveSession();
}

// =============================================================================
// ROUTE DRAG & DROP REORDERING
// =============================================================================

let draggedRouteStop = null;

function handleRouteStopDragStart(e) {
    const stopElement = e.currentTarget === document ? e.target : e.currentTarget;
    draggedRouteStop = parseInt(stopElement.getAttribute('data-stop-index'));
    console.log('🔵 Dragging route stop:', draggedRouteStop);
    stopElement.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleRouteStopDragEnd(e) {
    const stopElement = e.currentTarget === document ? e.target : e.currentTarget;
    stopElement.style.opacity = '1';
    draggedRouteStop = null;
}

function handleRouteStopDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleRouteStopDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    if (draggedRouteStop === null) return false;
    
    const targetElement = e.currentTarget === document ? e.target : e.currentTarget;
    const targetStop = targetElement.closest('.route-stop');
    if (!targetStop) return false;
    
    const targetIndex = parseInt(targetStop.getAttribute('data-stop-index'));
    
    if (draggedRouteStop === targetIndex) return false;
    
    console.log('🔄 Swapping stops:', draggedRouteStop, '↔️', targetIndex);
    
    // Swap stops in array
    const temp = routeStops[draggedRouteStop];
    routeStops[draggedRouteStop] = routeStops[targetIndex];
    routeStops[targetIndex] = temp;
    
    // Re-render with new order
    renderRoutePlan(routeStops);
    
    return false;
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export state for session management
window.RouteState = {
    getStops: () => routeStops,
    getCompletion: () => routeStepCompletion,
    getViewMode: () => routeViewMode,
    setCompletion: (completion) => { routeStepCompletion = completion; },
    setViewMode: (mode) => { routeViewMode = mode; }
};
