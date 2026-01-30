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
 * Populate global location datalist with all available locations
 */
function populateLocationList() {
    const datalist = document.getElementById('globalLocationList');
    if (!datalist) {
        console.warn('⚠️ Location datalist not found');
        return;
    }
    
    if (!window.GLOBAL_LOCATIONS || window.GLOBAL_LOCATIONS.length === 0) {
        console.error('❌ GLOBAL_LOCATIONS not loaded!');
        return;
    }
    
    datalist.innerHTML = '';
    window.GLOBAL_LOCATIONS.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        datalist.appendChild(option);
    });
    
    console.log('✅ Populated global location list:', window.GLOBAL_LOCATIONS.length, 'locations');
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
    // No category required - allow free mission creation
    
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
    
    panel.innerHTML = `
        <div class="mission-header">
            <div class="mission-title">Mission ${missionNumber}</div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <div class="mission-payout">
                    <label>Payout:</label>
                    <input type="text" 
                           class="payout-input" 
                           placeholder="e.g., 163.75k"
                           onchange="updateMissionPayout('${missionId}', this.value)"
                           onfocus="this.select()"
                           autocomplete="off">
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
    const textInputs = row.querySelectorAll('input[type="text"]');
    const selects = row.querySelectorAll('select');
    
    // Set location inputs (text inputs)
    if (textInputs[0]) textInputs[0].value = newCommodity.pickup;
    if (textInputs[1]) textInputs[1].value = newCommodity.destination;
    
    // Set commodity and maxBoxSize selects
    if (selects[0]) selects[0].value = newCommodity.commodity;
    if (selects[1]) selects[1].value = newCommodity.maxBoxSize;
    
    saveSession();
}

/**
 * Create commodity row HTML structure
 */
function createCommodityRow(missionId, commodityId, showRemove) {
    const row = document.createElement('div');
    row.className = 'commodity-row';
    row.id = commodityId;
    
    // Use global commodities instead of category-specific
    const globalCommodities = window.GLOBAL_COMMODITIES || [];
    
    row.innerHTML = `
        <div class="location-input-wrapper">
            <input type="text" 
                   list="globalLocationList" 
                   placeholder="Pickup"
                   class="location-input"
                   onchange="updateCommodity('${commodityId}', 'pickup', this.value)"
                   onfocus="clearLocationInput(this)"
                   onkeydown="handleLocationInputKeydown(event)"
                   autocomplete="off">
            <button class="btn-clear-location" onclick="clearAndFocusLocation(this)" title="Clear and select new location">✕</button>
        </div>
        
        <select onchange="updateCommodity('${commodityId}', 'commodity', this.value)">
            <option value="">Commodity</option>
            ${globalCommodities.map(c => `<option value="${c}">${c}</option>`).join('')}
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
        
        <div class="location-input-wrapper">
            <input type="text" 
                   list="globalLocationList" 
                   placeholder="Dropoff"
                   class="location-input"
                   onchange="updateCommodity('${commodityId}', 'destination', this.value)"
                   onfocus="clearLocationInput(this)"
                   onkeydown="handleLocationInputKeydown(event)"
                   autocomplete="off">
            <button class="btn-clear-location" onclick="clearAndFocusLocation(this)" title="Clear and select new location">✕</button>
        </div>
        
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
// =============================================================================
// LOCATION INPUT HELPERS
// =============================================================================

/**
 * Clear location input and show dropdown list on focus
 */
function clearLocationInput(input) {
    // Only clear if it has a value and user is focusing to change it
    if (input.value && input.selectionStart === 0 && input.selectionEnd === input.value.length) {
        // Text is already selected, clear it and let dropdown show
        setTimeout(() => {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }, 0);
    }
}

/**
 * Clear location input on button click and open dropdown
 */
function clearAndFocusLocation(button) {
    const wrapper = button.closest('.location-input-wrapper');
    if (!wrapper) return;
    
    const input = wrapper.querySelector('.location-input');
    if (!input) return;
    
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    
    // Trigger the dropdown to show by simulating typing
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
}

/**
 * Handle keydown in location inputs for better UX
 */
function handleLocationInputKeydown(event) {
    // If user presses Escape, clear the input and show fresh dropdown
    if (event.key === 'Escape') {
        event.target.value = '';
        event.target.dispatchEvent(new Event('input', { bubbles: true }));
        event.preventDefault();
    }
}