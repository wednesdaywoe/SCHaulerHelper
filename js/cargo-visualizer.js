/**
 * CARGO VISUALIZER MODULE
 * Handles cargo grid layout, rendering, and interaction for Hauler Helper
 * Version: 3.3.6
 */

// =============================================================================
// VISUALIZER STATE
// =============================================================================

let cargoGridLayout = {cols: 3, rows: 3}; // Track cargo grid layout
let cargoGridOrder = []; // Track custom order of groups in cargo grid
let cargoGridExpanded = false; // Track if cargo grid cards are expanded

// =============================================================================
// GRID LAYOUT MANAGEMENT
// =============================================================================

/**
 * Update cargo grid layout based on columns and rows dropdowns
 */
function updateGridLayout() {
    const cols = parseInt(document.getElementById('gridColumns').value);
    const rows = parseInt(document.getElementById('gridRows').value);
    
    cargoGridLayout = {cols: cols, rows: rows};
    localStorage.setItem('haulerHelperCargoGridLayout', JSON.stringify(cargoGridLayout));
    
    generateCargoGrid();
}

/**
 * Load cargo grid layout preference
 */
function loadCargoGridLayout() {
    const saved = localStorage.getItem('haulerHelperCargoGridLayout');
    if (saved) {
        try {
            cargoGridLayout = JSON.parse(saved);
            document.getElementById('gridColumns').value = cargoGridLayout.cols || 3;
            document.getElementById('gridRows').value = cargoGridLayout.rows || 3;
        } catch (e) {
            cargoGridLayout = {cols: 3, rows: 3};
        }
    } else {
        cargoGridLayout = {cols: 3, rows: 3};
    }
}

/**
 * Load cargo grid expanded state
 */
function loadCargoGridExpandedState() {
    const saved = localStorage.getItem('haulerHelperCargoGridExpanded');
    if (saved === 'true') {
        cargoGridExpanded = true;
    }
}

// =============================================================================
// GRID GENERATION
// =============================================================================

/**
 * Generate cargo grid with free positioning
 * Creates visual representation of cargo groups with drag-and-drop
 */
function generateCargoGrid() {
    const container = document.getElementById('cargoGrid');
    
    if (!container) {
        console.error('❌ cargoGrid container not found!');
        return;
    }
    
    // Get cargo groups from missions - include BOTH destinations AND pickup-only locations
    const groupData = {};
    
    missions.forEach((mission, missionIndex) => {
        mission.commodities.forEach(commodity => {
            if (!commodity.pickup || !commodity.destination || !commodity.commodity || !commodity.quantity) {
                return;
            }
            
            const scu = parseInt(commodity.quantity) || 0;
            const destination = commodity.destination;
            const pickup = commodity.pickup;
            
            // Create group for DESTINATION (delivery location)
            if (!groupData[destination]) {
                groupData[destination] = {
                    location: destination,
                    type: 'delivery', // This is a delivery location
                    totalSCU: 0,
                    items: []
                };
            }
            
            groupData[destination].totalSCU += scu;
            groupData[destination].items.push({
                missionNum: missionIndex + 1,
                commodity: commodity.commodity,
                scu: scu,
                pickup: commodity.pickup,
                maxBoxSize: parseInt(commodity.maxBoxSize) || 4,
                type: 'delivery' // This item is being delivered here
            });
            
            // Also create group for PICKUP location (if different from destination)
            if (pickup !== destination) {
                if (!groupData[pickup]) {
                    groupData[pickup] = {
                        location: pickup,
                        type: 'pickup', // This is a pickup-only location
                        totalSCU: 0,
                        items: []
                    };
                }
                
                // Only add to pickup group if it's not already counted as a delivery
                groupData[pickup].totalSCU += scu;
                groupData[pickup].items.push({
                    missionNum: missionIndex + 1,
                    commodity: commodity.commodity,
                    scu: scu,
                    destination: commodity.destination,
                    maxBoxSize: parseInt(commodity.maxBoxSize) || 4,
                    type: 'pickup' // This item is being picked up here
                });
            } else {
                // This location has both pickup and delivery
                groupData[destination].type = 'both';
            }
        });
    });
    
    if (Object.keys(groupData).length === 0) {
        container.innerHTML = '<div class="empty-state">No cargo groups to display</div>';
        container.style.gridTemplateColumns = 'repeat(2, 1fr)';
        return;
    }
    
    // Assign colors and labels to groups
    const theme = document.body.getAttribute('data-theme');
    const palette = window.THEME_COLOR_PALETTES[theme] || window.THEME_COLOR_PALETTES['stardust'];
    let groupIndex = Object.keys(cargoGroups).length; // Start from existing count
    
    Object.keys(groupData).forEach(location => {
        if (!cargoGroups[location]) {
            const groupLetter = String.fromCharCode(65 + groupIndex);
            cargoGroups[location] = {
                label: groupLetter,
                color: palette[groupIndex % palette.length],
                position: null  // Will be set by user
            };
            groupIndex++;
        }
    });
    
    // Calculate grid dimensions
    const cols = cargoGridLayout.cols || 3;
    const rows = cargoGridLayout.rows || 3;
    const totalCells = rows * cols;
    
    // Build grid with positioned groups
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    // Create array of cells
    const cells = [];
    for (let i = 0; i < totalCells; i++) {
        cells.push({ position: i, group: null });
    }
    
    // Place groups in their positions (or auto-place if no position set)
    let autoPosition = 0;
    Object.keys(groupData).forEach(location => {
        const group = cargoGroups[location];
        const data = groupData[location];
        
        // Use saved position or auto-place
        let position = group.position;
        if (position === null || position === undefined || position >= totalCells) {
            // Auto-place in next available spot
            while (autoPosition < totalCells && cells[autoPosition].group !== null) {
                autoPosition++;
            }
            position = autoPosition;
            group.position = position;
        }
        
        if (position < totalCells) {
            cells[position].group = {
                location: location,
                type: data.type, // 'pickup', 'delivery', or 'both'
                label: group.label,
                color: group.color,
                position: group.position,
                totalSCU: data.totalSCU,
                items: data.items  // Explicitly take items from data
            };
        }
    });
    
    // Render grid
    container.innerHTML = cells.map((cell, index) => {
        if (!cell.group) {
            // Empty cell - drop target
            return `
                <div class="cargo-group-cell empty-cell" 
                     data-position="${index}">
                </div>
            `;
        }
        
        const g = cell.group;
        
        // Separate items by type for organized display
        const pickupItems = (g.items || []).filter(item => item.type === 'pickup');
        const deliveryItems = (g.items || []).filter(item => item.type === 'delivery');
        
        return `
            <div class="cargo-group-card" 
                 data-location="${g.location}"
                 data-type="${g.type}"
                 data-position="${index}"
                 style="border-color: ${g.color}"
                 draggable="true">
                <div class="cargo-group-header">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <div class="cargo-drag-handle" title="Drag to reposition">⋮⋮</div>
                        <div class="cargo-group-label-edit" 
                             style="color: ${g.color}; cursor: pointer; pointer-events: auto;"
                             onclick="event.stopPropagation(); editCargoGroupLabel('${g.location}', event)">
                            ${g.label}
                        </div>
                    </div>
                    <div class="cargo-group-scu">${g.totalSCU} SCU</div>
                </div>
                <div class="cargo-group-color-edit"
                     style="background-color: ${g.color}; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; margin: 8px 0;"
                     onclick="event.stopPropagation(); editCargoGroupColor('${g.location}')">
                </div>
                <div class="cargo-group-destination">${g.location}</div>
                <div class="expand-indicator" onclick="event.stopPropagation(); toggleCargoGroupExpand(this.parentElement)">Click to expand</div>
                <div class="cargo-group-details">
                    ${pickupItems.length > 0 ? `
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 11px; font-weight: 600; color: var(--color-warning); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
                                📦 PICKUPS:
                            </div>
                            ${pickupItems.map(item => {
                                const boxes = calculateBoxBreakdown(item.scu, item.maxBoxSize);
                                return `
                                    <div class="cargo-group-details-item">
                                        <span class="mission-num">Mission ${item.missionNum}:</span>
                                        <span class="commodity">${item.commodity}</span>
                                        <span>(${item.scu} SCU → ${item.destination})</span>
                                    </div>
                                    <div class="box-breakdown" style="padding-left: 10px; margin-bottom: 8px;">
                                        ${Object.entries(boxes).map(([size, count]) => `
                                            <div class="box-icon">
                                                ${getBoxIconSVG(size)}
                                                <span class="box-count">× ${count}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                    ${deliveryItems.length > 0 ? `
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 11px; font-weight: 600; color: var(--color-success); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
                                📭 DROPOFFS:
                            </div>
                            ${deliveryItems.map(item => {
                                const boxes = calculateBoxBreakdown(item.scu, item.maxBoxSize);
                                return `
                                    <div class="cargo-group-details-item">
                                        <span class="mission-num">Mission ${item.missionNum}:</span>
                                        <span class="commodity">${item.commodity}</span>
                                        <span>(${item.scu} SCU ← ${item.pickup})</span>
                                    </div>
                                    <div class="box-breakdown" style="padding-left: 10px; margin-bottom: 8px;">
                                        ${Object.entries(boxes).map(([size, count]) => `
                                            <div class="box-icon">
                                                ${getBoxIconSVG(size)}
                                                <span class="box-count">× ${count}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Attach drag handlers and apply expanded state after rendering
    setTimeout(() => {
        attachCargoGridDragHandlers();
        
        // Apply expanded state to all cards
        if (cargoGridExpanded) {
            document.querySelectorAll('.cargo-group-card').forEach(card => {
                card.classList.add('expanded');
            });
        }
        
        console.log('✅ Cargo grid rendering complete');
    }, 0);
}

// =============================================================================
// GRID EDITING
// =============================================================================

/**
 * Edit cargo group label
 */
function editCargoGroupLabel(destination, event) {
    event.stopPropagation();
    const newLabel = prompt('Enter new label for this cargo group:', cargoGroups[destination].label);
    if (newLabel !== null && newLabel.trim() !== '') {
        cargoGroups[destination].label = newLabel.trim();
        generateCargoGrid();
        generateRoutePlan(); // Update route planner too
        saveSession();
    }
}

/**
 * Edit cargo group color
 */
function editCargoGroupColor(destination) {
    currentColorTarget = destination;
    const modal = document.getElementById('colorPickerModal');
    modal.classList.add('active');
    
    const currentColor = cargoGroups[destination].color;
    document.getElementById('customColorInput').value = currentColor;
}

/**
 * Toggle cargo group expansion
 */
function toggleCargoGroupExpand(card) {
    // Toggle the global expanded state
    cargoGridExpanded = !cargoGridExpanded;
    
    // Apply to all cards
    document.querySelectorAll('.cargo-group-card').forEach(c => {
        if (cargoGridExpanded) {
            c.classList.add('expanded');
        } else {
            c.classList.remove('expanded');
        }
    });
    
    // Save state
    localStorage.setItem('haulerHelperCargoGridExpanded', cargoGridExpanded);
}

// =============================================================================
// DRAG & DROP
// =============================================================================

let draggedCargoGroup = null;

/**
 * Attach drag handlers to all cargo cards after grid generation
 */
function attachCargoGridDragHandlers() {
    const cards = document.querySelectorAll('.cargo-group-card');
    
    cards.forEach(card => {
        // Remove any existing handlers first
        card.ondragstart = null;
        card.ondragend = null;
        card.ondragover = null;
        card.ondrop = null;
        
        // Attach new handlers (though document-level handlers will catch them)
        card.addEventListener('dragstart', handleCargoGridDragStart, false);
        card.addEventListener('dragend', handleCargoGridDragEnd, false);
        card.addEventListener('dragover', handleCargoGridDragOver, false);
        card.addEventListener('drop', handleCargoGridDrop, false);
    });
    
    // Also attach to empty cells
    const emptyCells = document.querySelectorAll('.empty-cell');
    
    emptyCells.forEach(cell => {
        cell.ondragover = null;
        cell.ondrop = null;
        cell.addEventListener('dragover', handleCargoGridDragOver, false);
        cell.addEventListener('drop', handleCargoGridDrop, false);
    });
}

function handleCargoGridDragStart(e) {
    // When called from document listener, use e.target instead of e.currentTarget
    const cardElement = e.currentTarget === document ? e.target : e.currentTarget;
    
    draggedCargoGroup = cardElement.getAttribute('data-location');
    console.log('🔵 Drag start:', draggedCargoGroup);
    
    if (!draggedCargoGroup) {
        console.log('❌ No location attribute found!');
        return;
    }
    
    cardElement.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', draggedCargoGroup);
}

function handleCargoGridDragEnd(e) {
    const cardElement = e.currentTarget === document ? e.target : e.currentTarget;
    cardElement.style.opacity = '1';
    console.log('🔴 DRAG END');
}

function handleCargoGridDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleCargoGridDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🟢 DROP EVENT FIRED');
    
    if (!draggedCargoGroup) {
        console.log('❌ No dragged group!');
        return false;
    }
    
    const target = e.currentTarget === document ? e.target : e.currentTarget;
    const targetPosition = parseInt(target.getAttribute('data-position'));
    const targetLocation = target.getAttribute('data-location');
    
    console.log('🎯 DROP TARGET:', {
        targetPosition,
        targetLocation,
        draggedGroup: draggedCargoGroup,
        draggedPosition: cargoGroups[draggedCargoGroup]?.position
    });
    
    // Get dragged item's current position
    const draggedPosition = cargoGroups[draggedCargoGroup].position;
    
    if (targetLocation && targetLocation !== draggedCargoGroup) {
        // Swap positions with another card
        console.log('🔄 SWAPPING:', draggedCargoGroup, '↔️', targetLocation);
        const temp = cargoGroups[targetLocation].position;
        cargoGroups[targetLocation].position = draggedPosition;
        cargoGroups[draggedCargoGroup].position = targetPosition;
    } else if (!targetLocation) {
        // Drop on empty cell - just move
        console.log('📦 MOVING to empty cell:', targetPosition);
        cargoGroups[draggedCargoGroup].position = targetPosition;
    } else {
        console.log('⚠️ Dropped on self, no action');
    }
    
    // Regenerate grid and save
    console.log('♻️ Regenerating grid...');
    generateCargoGrid();
    saveSession();
    
    draggedCargoGroup = null;
    return false;
}

// =============================================================================
// DEBUG HELPERS
// =============================================================================

/**
 * Diagnostic function - Check actual DOM state
 */
window.diagnoseCargoGrid = function() {
    const cards = document.querySelectorAll('.cargo-group-card');
    console.log('=== CARGO GRID DIAGNOSTICS ===');
    console.log('Found cards:', cards.length);
    
    cards.forEach((card, i) => {
        console.log(`Card ${i}:`, {
            draggable: card.draggable,
            hasAttribute: card.hasAttribute('draggable'),
            getAttribute: card.getAttribute('draggable'),
            ondragstart: card.ondragstart,
            location: card.getAttribute('data-location'),
            type: card.getAttribute('data-type'),
            classList: Array.from(card.classList),
            computedStyle: {
                pointerEvents: getComputedStyle(card).pointerEvents,
                userDrag: getComputedStyle(card).webkitUserDrag || getComputedStyle(card).userDrag
            }
        });
        
        // Check first child (drag handle)
        const dragHandle = card.querySelector('.cargo-drag-handle');
        if (dragHandle) {
            console.log('  Drag handle:', {
                computedStyle: {
                    pointerEvents: getComputedStyle(dragHandle).pointerEvents
                }
            });
        }
    });
    
    console.log('=== END DIAGNOSTICS ===');
};

// =============================================================================
// EXPORTS
// =============================================================================

// Export state for session management
window.CargoVisualizerState = {
    getLayout: () => cargoGridLayout,
    getExpanded: () => cargoGridExpanded,
    setLayout: (layout) => { cargoGridLayout = layout; },
    setExpanded: (expanded) => { cargoGridExpanded = expanded; }
};
