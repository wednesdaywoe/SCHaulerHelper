/**
 * MISSION MANAGER MODULE
 * Handles mission panel creation, editing, and commodity management for Hauler Helper
 * Version: 3.3.6
 */

// =============================================================================
// SHIP SELECTION
// =============================================================================

/**
 * Populate ship selection dropdown with all available ships
 */
function populateShipSelect() {
    const datalist = document.getElementById('shipList');
    datalist.innerHTML = '';
    ships.forEach(ship => {
        const option = document.createElement('option');
        option.value = ship.name;
        option.setAttribute('data-id', ship.id);
        datalist.appendChild(option);
    });
}

/**
 * Update selected ship based on user input
 */
function updateShip() {
    const input = document.getElementById('shipSelect');
    const selectedName = input.value;
    
    // Find ship by name
    const ship = ships.find(s => s.name === selectedName);
    
    if (ship) {
        selectedShip = ship;
        input.value = ship.name; // Set to full name
    } else {
        selectedShip = null;
        input.value = ''; // Clear invalid input
    }
    
    updateStats();
    saveSession();
}

// =============================================================================
// SYSTEM & CATEGORY SELECTION
// =============================================================================

/**
 * Update system selection and apply system-specific rules
 */
function updateSystem() {
    selectedSystem = document.getElementById('systemSelect').value;
    
    // Update category dropdown based on system rules
    const categorySelect = document.getElementById('categorySelect');
    const localOption = categorySelect.querySelector('option[value="local"]');
    const planetaryOption = categorySelect.querySelector('option[value="planetary"]');
    const stellarOption = categorySelect.querySelector('option[value="stellar"]');
    const interstellarOption = categorySelect.querySelector('option[value="interstellar"]');
    
    // Reset all options
    if (localOption) localOption.disabled = false;
    if (planetaryOption) planetaryOption.disabled = false;
    if (stellarOption) stellarOption.disabled = false;
    if (interstellarOption) interstellarOption.disabled = false;
    
    // Apply system-specific rules
    if (selectedSystem === 'arccorp' || selectedSystem === 'crusader') {
        // No Local missions for ArcCorp and Crusader
        if (localOption) localOption.disabled = true;
        if (selectedCategory === 'local') {
            selectedCategory = '';
            categorySelect.value = '';
            alert('Local missions are not available for ' + selectedSystem + '. Please select Planetary, Stellar, or Interstellar.');
        }
    } else if (selectedSystem === 'nyx') {
        // Only Interstellar missions for Nyx
        if (localOption) localOption.disabled = true;
        if (planetaryOption) planetaryOption.disabled = true;
        if (stellarOption) stellarOption.disabled = true;
        if (selectedCategory !== 'interstellar') {
            selectedCategory = '';
            categorySelect.value = '';
            alert('Nyx only has Interstellar missions. Please select Interstellar category.');
        }
    }
    
    saveSession();
}

/**
 * Update selected mission category
 */
function updateCategory() {
    selectedCategory = document.getElementById('categorySelect').value;
    saveSession();
}

// =============================================================================
// MISSION PANEL MANAGEMENT
// =============================================================================

/**
 * Add a new mission panel to the UI
 */
function addMissionPanel() {
    if (!selectedCategory) {
        alert('Please select a mission category first');
        return;
    }

    missionCounter++;
    const missionId = `mission_${missionCounter}`;
    
    const mission = {
        id: missionId,
        payout: '',
        commodities: []
    };
    
    missions.push(mission);
    
    const container = document.getElementById('missionsContainer');
    const panel = createMissionPanel(missionId, missionCounter);
    container.appendChild(panel);
    
    // Add first commodity row by default
    addCommodityRow(missionId);
    
    saveSession();
}

/**
 * Create mission panel HTML structure
 */
function createMissionPanel(missionId, missionNumber) {
    const panel = document.createElement('div');
    panel.className = 'mission-panel';
    panel.id = missionId;
    
    const system = selectedSystem || 'microtech';
    const category = selectedCategory || 'planetary';
    
    // For interstellar missions, use universal data instead of system-specific
    const isInterstellar = category === 'interstellar';
    const dataSource = isInterstellar ? 'universal' : system;
    
    const categoryLocations = (locations[dataSource] && locations[dataSource][category]) || [];
    const categoryCommodities = (commodities[dataSource] && commodities[dataSource][category]) || [];
    const categoryPayouts = (payouts[dataSource] && payouts[dataSource][category]) || [];
    console.log(`✅ ${system}.${category} - Found ${categoryPayouts.length} payouts`);
    
    panel.innerHTML = `
        <div class="mission-header">
            <div class="mission-title">Mission ${missionNumber}</div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <div class="mission-payout">
                    <label>Payout:</label>
                    <select onchange="updateMissionPayout('${missionId}', this.value)">
                        <option value="">-</option>
                        ${categoryPayouts.map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>
                </div>
                <button class="btn-remove-mission" onclick="removeMissionPanel('${missionId}')">Remove</button>
            </div>
        </div>
        <div id="${missionId}_commodities"></div>
        <button class="btn-add-commodity" onclick="addCommodityRow('${missionId}')">+ Add Commodity</button>
    `;
    
    return panel;
}

/**
 * Remove a mission panel from the UI
 */
function removeMissionPanel(missionId) {
    missions = missions.filter(m => m.id !== missionId);
    document.getElementById(missionId).remove();
    generateRoutePlan();
    generateCargoGrid();
    updateStats();
    saveSession();
}

/**
 * Update mission payout value
 */
function updateMissionPayout(missionId, payout) {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
        mission.payout = payout;
    }
    updateStats();
    saveSession();
}

// =============================================================================
// COMMODITY ROW MANAGEMENT
// =============================================================================

/**
 * Add a commodity row to a mission panel
 */
function addCommodityRow(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (mission.commodities.length >= 8) {
        alert('Maximum 8 commodities per mission');
        return;
    }
    
    // Get previous commodity for defaults
    const previousCommodity = mission.commodities[mission.commodities.length - 1];
    
    const commodityId = `${missionId}_commodity_${mission.commodities.length}`;
    mission.commodities.push({
        id: commodityId,
        pickup: previousCommodity?.pickup || '',
        commodity: previousCommodity?.commodity || '',
        quantity: '',
        maxBoxSize: previousCommodity?.maxBoxSize || '4',
        destination: previousCommodity?.destination || ''
    });
    
    const container = document.getElementById(`${missionId}_commodities`);
    const row = createCommodityRow(missionId, commodityId, mission.commodities.length > 1);
    container.appendChild(row);
    
    // Set default values in the new row
    const newCommodity = mission.commodities[mission.commodities.length - 1];
    const selects = row.querySelectorAll('select');
    if (selects[0]) selects[0].value = newCommodity.pickup;
    if (selects[1]) selects[1].value = newCommodity.commodity;
    if (selects[2]) selects[2].value = newCommodity.maxBoxSize;
    if (selects[3]) selects[3].value = newCommodity.destination;
    
    saveSession();
}

/**
 * Create commodity row HTML structure
 */
function createCommodityRow(missionId, commodityId, showRemove) {
    const row = document.createElement('div');
    row.className = 'commodity-row';
    row.id = commodityId;
    
    // Get category-specific locations and commodities
    const system = selectedSystem || 'microtech';
    const category = selectedCategory || 'planetary';
    
    // For interstellar missions, use universal data instead of system-specific
    const isInterstellar = category === 'interstellar';
    const dataSource = isInterstellar ? 'universal' : system;
    
    const categoryLocations = (locations[dataSource] && locations[dataSource][category]) || [];
    const categoryCommodities = (commodities[dataSource] && commodities[dataSource][category]) || [];
    
    row.innerHTML = `
        <select onchange="updateCommodity('${commodityId}', 'pickup', this.value)">
            <option value="">Pickup Location</option>
            ${categoryLocations.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
        </select>
        <select onchange="updateCommodity('${commodityId}', 'commodity', this.value)">
            <option value="">Commodity</option>
            ${categoryCommodities.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <input type="number" placeholder="SCU" min="1" onchange="updateCommodity('${commodityId}', 'quantity', this.value)">
        <select onchange="updateCommodity('${commodityId}', 'maxBoxSize', this.value)">
            <option value="1">Max: 1 SCU</option>
            <option value="2">Max: 2 SCU</option>
            <option value="4">Max: 4 SCU</option>
            <option value="8">Max: 8 SCU</option>
            <option value="16">Max: 16 SCU</option>
            <option value="24">Max: 24 SCU</option>
            <option value="32">Max: 32 SCU</option>
        </select>
        <select onchange="updateCommodity('${commodityId}', 'destination', this.value)">
            <option value="">Destination</option>
            ${categoryLocations.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
        </select>
        ${showRemove ? 
            `<button class="btn-remove-commodity" onclick="removeCommodityRow('${missionId}', '${commodityId}')">-</button>` :
            `<div></div>`
        }
    `;
    
    return row;
}

/**
 * Update commodity field value
 */
function updateCommodity(commodityId, field, value) {
    for (const mission of missions) {
        const commodity = mission.commodities.find(c => c.id === commodityId);
        if (commodity) {
            commodity[field] = value;
            
            // AUTO-FILL PATTERNS: If this is the first commodity and we're setting the commodity name
            const isFirstCommodity = commodity.id.includes('_commodity_0');
            const isSettingCommodity = field === 'commodity';
            const hasAutoFillSystem = selectedSystem === 'microtech' || selectedSystem === 'hurston';

            if (isFirstCommodity && isSettingCommodity && value && hasAutoFillSystem) {
                applyAutoFillPattern(mission, value, selectedSystem);
            }
            
            break;
        }
    }
    generateRoutePlan();
    generateCargoGrid();
    updateStats();
    saveSession();
}

/**
 * Remove a commodity row from a mission
 */
function removeCommodityRow(missionId, commodityId) {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
        mission.commodities = mission.commodities.filter(c => c.id !== commodityId);
        document.getElementById(commodityId).remove();
    }
    generateRoutePlan();
    generateCargoGrid();
    updateStats();
    saveSession();
}

// =============================================================================
// AUTO-FILL PATTERN APPLICATION
// =============================================================================

/**
 * Apply auto-fill pattern based on first commodity
 */
function applyAutoFillPattern(mission, firstCommodity, system) {
    // Only apply if mission has exactly 1 commodity (we're setting the first one)
    if (mission.commodities.length !== 1) return;
    
    // Get mission payout
    const missionPayout = mission.payout || '';
    
    // Get patterns from external file
    const { payoutPatterns, commodityPatterns, universalCommoditySequences } = window.AUTOFILL_PATTERNS || {};
    
    if (!payoutPatterns || !commodityPatterns || !universalCommoditySequences) {
        console.error('❌ Autofill patterns not loaded!');
        return;
    }
    
    let pattern = null;
    let patternType = '';
    
    // Step 1: Check for payout-specific pattern (most specific)
    if (payoutPatterns[system] && 
        payoutPatterns[system][firstCommodity] && 
        payoutPatterns[system][firstCommodity][missionPayout]) {
        pattern = payoutPatterns[system][firstCommodity][missionPayout];
        patternType = 'payout-specific';
        console.log(`✅ Found payout-specific pattern: ${system} / ${firstCommodity} / ${missionPayout}`);
    }
    
    // Step 2: Check for commodity-only pattern (less specific)
    if (!pattern && commodityPatterns[system] && commodityPatterns[system][firstCommodity]) {
        pattern = commodityPatterns[system][firstCommodity];
        patternType = 'commodity-only';
        console.log(`✅ Found commodity-only pattern: ${system} / ${firstCommodity}`);
    }
    
    // Step 3: Check for universal commodity sequence
    if (!pattern && universalCommoditySequences[firstCommodity]) {
        pattern = {
            commodities: universalCommoditySequences[firstCommodity]
        };
        patternType = 'universal-sequence';
        console.log(`✅ Found universal commodity sequence: ${firstCommodity}`);
    }
    
    if (!pattern) {
        console.log(`❌ No autofill pattern found`);
        return; // No pattern found
    }
    
    console.log(`✨ Auto-filling ${system} mission with ${firstCommodity} (${patternType} pattern)`);
    
    // Add 3 more commodity rows (we already have 1)
    for (let i = 1; i < 4; i++) {
        if (mission.commodities.length >= 4) break;
        addCommodityRow(mission.id);
    }
    
    // Wait for DOM to update, then fill in values
    setTimeout(() => {
        mission.commodities.forEach((commodity, index) => {
            // Fill pickups (if pattern specifies them and they're not null)
            if (pattern.pickups && pattern.pickups[index] !== null && pattern.pickups[index] !== undefined) {
                commodity.pickup = pattern.pickups[index];
                const pickupSelect = document.querySelector(`#${commodity.id} select:nth-of-type(1)`);
                if (pickupSelect) pickupSelect.value = pattern.pickups[index];
            }
            
            // Fill destinations (if pattern specifies them and they're not null)
            if (pattern.destinations && pattern.destinations[index] !== null && pattern.destinations[index] !== undefined) {
                commodity.destination = pattern.destinations[index];
                const destSelect = document.querySelector(`#${commodity.id} select:nth-of-type(4)`);
                if (destSelect) destSelect.value = pattern.destinations[index];
            }
            
            // Fill commodities (always)
            if (pattern.commodities && pattern.commodities[index]) {
                commodity.commodity = pattern.commodities[index];
                const commoditySelect = document.querySelector(`#${commodity.id} select:nth-of-type(2)`);
                if (commoditySelect) commoditySelect.value = pattern.commodities[index];
            }
        });
        
        // Update displays
        generateRoutePlan();
        generateCargoGrid();
        updateStats();
        saveSession();
    }, 100);
}
