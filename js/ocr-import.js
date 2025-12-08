/**
 * OCR IMPORT MODULE
 * Handles OCR scanner integration, location/payout matching, and data import for Hauler Helper
 * Version: 3.3.6
 */

// =============================================================================
// LOCATION MATCHING
// =============================================================================

/**
 * Match abbreviated/OCR location name to full database name
 * Handles common OCR errors and fuzzy matching
 */
function matchLocation(ocrName, system, category) {
    if (!ocrName || !system || !category) return '';
    
    // Get locations for this system/category
    const systemData = window.LOCATIONS_DATABASE[system];
    if (!systemData || !systemData[category]) return ocrName;
    
    const locations = systemData[category];
    
    // Try exact match first
    if (locations.includes(ocrName)) {
        return ocrName;
    }
    
    // === PREPROCESSING: Normalize OCR errors ===
    let normalized = ocrName;
    
    // Fix common OCR character confusions
    normalized = normalized
        .replace(/\bSM0-/g, 'SMO-')        // SM0 (zero) → SMO (letter O)
        .replace(/\bSMo-/g, 'SMO-')        // SMo → SMO
        .replace(/\bSMc-/g, 'SMC-')        // SMc → SMC
        .replace(/\bSMca-/g, 'SMCa-')      // SMca → SMCa
        .replace(/\bS4DC0/g, 'S4DC')       // S4DC0 (zero) → S4DC
        .replace(/\bS4DCO/g, 'S4DC')       // S4DCO (letter O) → S4DC
        .replace(/\bl1\b/gi, 'L1')         // l1 → L1
        .replace(/\bl2\b/gi, 'L2')         // l2 → L2
        .replace(/\bl3\b/gi, 'L3')         // l3 → L3
        .replace(/\bl4\b/gi, 'L4')         // l4 → L4
        .replace(/\bl5\b/gi, 'L5');        // l5 → L5
    
    // Try exact match on normalized
    if (locations.includes(normalized)) {
        return normalized;
    }
    
    // === FACILITY CODE EXTRACTION ===
    // Extract codes like "SMO-13", "S4DC05", "SMCa-6" from longer names
    const codePatterns = [
        /\b(SMO-\d+)\b/i,           // SMO-13, SMO-10, etc.
        /\b(SMC[a-z]?-\d+)\b/i,     // SMCa-6, SMC-8, etc.
        /\b(S4DC\d+)\b/i,           // S4DC05, S4DC10, etc.
        /\b(S4LD\d+)\b/i,           // S4LD01, S4LD13, etc.
        /\b(MT\s*L\d+)\b/i,         // MT L1, MT L2, etc.
        /\b([A-Z]{3}-L\d+)\b/i,     // ARC-L1, CRU-L4, MIC-L2, etc.
        /\b(Cry-Astro\s+\d+-\d+)\b/i, // Cry-Astro 19-02
        /\b(Rayari\s+\w+)\b/i,      // Rayari Anvik, etc.
    ];
    
    for (const pattern of codePatterns) {
        const match = normalized.match(pattern);
        if (match) {
            const code = match[1].trim();
            
            // Try exact match on extracted code
            const exactCode = locations.find(loc => 
                loc.toLowerCase() === code.toLowerCase()
            );
            if (exactCode) return exactCode;
            
            // Try to find location containing this code
            const containsCode = locations.find(loc =>
                loc.toLowerCase().includes(code.toLowerCase())
            );
            if (containsCode) return containsCode;
        }
    }

    // === CLEANUP: Remove verbose parts ===
    let cleaned = normalized
        .replace(/\b(Mining Facility|Distribution Center|Complex|Depot|Logistics)\b/gi, '')
        .replace(/\b(Harbor|Station|Point)\b/gi, '')
        .replace(/\b(above|at|on)\s+\w+$/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Try exact match on cleaned
    const exactCleaned = locations.find(loc => 
        loc.toLowerCase() === cleaned.toLowerCase()
    );
    if (exactCleaned) return exactCleaned;
    
    // === BIDIRECTIONAL FUZZY MATCHING ===
    const match = locations.find(loc => {
        const locLower = loc.toLowerCase();
        const ocrLower = ocrName.toLowerCase();
        const normLower = normalized.toLowerCase();
        const cleanLower = cleaned.toLowerCase();
        
        return (
            // OCR name contains database location
            ocrLower.includes(locLower) ||
            normLower.includes(locLower) ||
            cleanLower.includes(locLower) ||
            // Database location contains OCR name
            locLower.includes(ocrLower) ||
            locLower.includes(normLower) ||
            locLower.includes(cleanLower) ||
            // Starts with matching
            loc.startsWith(ocrName) ||
            ocrName.startsWith(loc) ||
            loc.startsWith(normalized) ||
            normalized.startsWith(loc) ||
            loc.startsWith(cleaned) ||
            cleaned.startsWith(loc)
        );
    });
    
    return match || ocrName;
}

// =============================================================================
// PAYOUT MATCHING
// =============================================================================

/**
 * Match payout number to database format and find closest match
 */
function matchPayout(payoutNumber, system, category) {
    if (!payoutNumber || !system || !category) return '';
    
    // Convert number to "k" format (40750 → "40.75k")
    let payoutK = payoutNumber / 1000;
    
    // Get payouts for this system/category
    const systemData = window.PAYOUTS_DATABASE[system];
    if (!systemData || !systemData[category]) return '';
    
    const payouts = systemData[category];
    
    // Try to find exact or closest match
    let bestMatch = '';
    let smallestDiff = Infinity;
    
    for (const payout of payouts) {
        // Parse payout string "40.75k" → 40.75
        const value = parseFloat(payout.replace('k', ''));
        const diff = Math.abs(value - payoutK);
        
        if (diff < smallestDiff) {
            smallestDiff = diff;
            bestMatch = payout;
        }
        
        // If exact match, stop  
        if (diff < 0.1) break;
    }
    
    return bestMatch;
}

// =============================================================================
// SINGLE MISSION IMPORT
// =============================================================================

/**
 * Check for and import single mission from OCR Scanner
 */
function checkForOCRImport() {
    const importData = localStorage.getItem('haulerHelperOCRImport');
    if (!importData) return;
    
    try {
        const data = JSON.parse(importData);
        console.log('📥 OCR Import detected:', data);

        // Clear the import flag immediately
        localStorage.removeItem('haulerHelperOCRImport');

        // Extract mission data from the first mission
        const missionData = data.missions && data.missions[0] ? data.missions[0] : data;

        // Add a new mission with the imported data
        addMissionPanel();

        // Get the newly created mission
        const lastMission = missions[missions.length - 1];

        // Set payout if available
        if (missionData.payout) {
            // Match payout to database format
            const matchedPayout = matchPayout(missionData.payout, selectedSystem, selectedCategory);
            console.log('💰 Payout matching:', missionData.payout, '→', matchedPayout);
        
            if (matchedPayout) {
                lastMission.payout = matchedPayout;
                const missionPanel = document.getElementById(lastMission.id);
                const payoutSelect = missionPanel.querySelector('select');
                if (payoutSelect) {
                    payoutSelect.value = matchedPayout;
                }
            }
        }
        
        // Add commodities
        if (missionData.commodities && missionData.commodities.length > 0) {
            // Remove the default empty commodity row
            if (lastMission.commodities.length > 0) {
                const firstCommodityId = lastMission.commodities[0].id;
                removeCommodityRow(lastMission.id, firstCommodityId);
            }
            
            // Add each imported commodity
            missionData.commodities.forEach((commodity, index) => {
                if (commodity.commodity || commodity.pickup || commodity.destination) {
                    addCommodityRow(lastMission.id);
                    const commodityId = `${lastMission.id}_commodity_${index}`;
                    const commodityData = lastMission.commodities[index];
                    
                    // Match locations to database names
                    const matchedPickup = matchLocation(commodity.pickup, selectedSystem, selectedCategory);
                    const matchedDestination = matchLocation(commodity.destination, selectedSystem, selectedCategory);
                    
                    // Update the commodity data
                    Object.assign(commodityData, {
                        commodity: commodity.commodity || '',
                        pickup: matchedPickup || '',
                        destination: matchedDestination || '',
                        quantity: commodity.quantity || '',
                        maxBoxSize: commodity.maxBoxSize || '4'
                    });
                    
                    // Update the UI with matched locations
                    const row = document.getElementById(commodityId);
                    if (row) {
                        const selects = row.querySelectorAll('select');
                        const input = row.querySelector('input[type="number"]');
                        if (selects[0]) selects[0].value = matchedPickup || '';
                        if (selects[1]) selects[1].value = commodity.commodity || '';
                        if (input) input.value = commodity.quantity || '';
                        if (selects[2]) selects[2].value = commodity.maxBoxSize || '4';
                        if (selects[3]) selects[3].value = matchedDestination || '';
                    }
                }
            });
        }
        
        generateCargoGrid();
        generateRoutePlan();
        updateStats();
        saveSession();
        
    } catch (e) {
        console.error('Error importing OCR data:', e);
        localStorage.removeItem('haulerHelperOCRImport');
    }
}

// =============================================================================
// BATCH MISSION IMPORT
// =============================================================================

/**
 * Check for and import multiple missions from OCR Scanner (Import All)
 */
function checkForOCRImportAll() {
    const importData = localStorage.getItem('haulerHelperOCRImportAll');
    if (!importData) return;
    
    try {
        const data = JSON.parse(importData);
        console.log('📦 OCR Batch Import detected:', data.missions?.length, 'missions');
        
        // Clear the import flag immediately
        localStorage.removeItem('haulerHelperOCRImportAll');
        
        if (!data.missions || data.missions.length === 0) {
            console.warn('No missions in batch import data');
            return;
        }
        
        // Import each mission
        let successCount = 0;
        data.missions.forEach((missionData, missionIndex) => {
            try {
                // Add a new mission panel
                addMissionPanel();
                const lastMission = missions[missions.length - 1];
                
                // Set payout if available
                if (missionData.payout) {
                    const matchedPayout = matchPayout(missionData.payout, selectedSystem, selectedCategory);
                    console.log(`💰 Mission ${missionIndex + 1} payout:`, missionData.payout, '→', matchedPayout);
                    
                    if (matchedPayout) {
                        lastMission.payout = matchedPayout;
                        const missionPanel = document.getElementById(lastMission.id);
                        const payoutSelect = missionPanel.querySelector('select');
                        if (payoutSelect) {
                            payoutSelect.value = matchedPayout;
                        }
                    }
                }
                
                // Add commodities
                if (missionData.commodities && missionData.commodities.length > 0) {
                    // Remove the default empty commodity row
                    if (lastMission.commodities.length > 0) {
                        const firstCommodityId = lastMission.commodities[0].id;
                        removeCommodityRow(lastMission.id, firstCommodityId);
                    }
                    
                    // Add each imported commodity
                    missionData.commodities.forEach((commodity, index) => {
                        if (commodity.commodity || commodity.pickup || commodity.destination) {
                            addCommodityRow(lastMission.id);
                            const commodityId = `${lastMission.id}_commodity_${index}`;
                            const commodityData = lastMission.commodities[index];
                            
                            // Match locations to database names
                            const matchedPickup = matchLocation(commodity.pickup, selectedSystem, selectedCategory);
                            const matchedDestination = matchLocation(commodity.destination, selectedSystem, selectedCategory);
                            
                            console.log(`📍 Mission ${missionIndex + 1}, Commodity ${index + 1}:`, 
                                commodity.pickup, '→', matchedPickup,
                                '|', commodity.destination, '→', matchedDestination);
                            
                            // Update the commodity data
                            Object.assign(commodityData, {
                                commodity: commodity.commodity || '',
                                pickup: matchedPickup || '',
                                destination: matchedDestination || '',
                                quantity: commodity.quantity || '',
                                maxBoxSize: commodity.maxBoxSize || '4'
                            });
                            
                            // Update the UI with matched locations
                            const row = document.getElementById(commodityId);
                            if (row) {
                                const selects = row.querySelectorAll('select');
                                const input = row.querySelector('input[type="number"]');
                                if (selects[0]) selects[0].value = matchedPickup || '';
                                if (selects[1]) selects[1].value = commodity.commodity || '';
                                if (input) input.value = commodity.quantity || '';
                                if (selects[2]) selects[2].value = commodity.maxBoxSize || '4';
                                if (selects[3]) selects[3].value = matchedDestination || '';
                            }
                        }
                    });
                }
                
                successCount++;
            } catch (e) {
                console.error(`Error importing mission ${missionIndex + 1}:`, e);
            }
        });
        
        generateCargoGrid();
        generateRoutePlan();
        updateStats();
        saveSession();
        
    } catch (e) {
        console.error('Error importing batch OCR data:', e);
        localStorage.removeItem('haulerHelperOCRImportAll');
    }
}
