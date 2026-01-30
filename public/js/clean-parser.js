// ============================================================================
// CLEAN STAR CITIZEN MISSION PARSER
// ============================================================================
// Purpose: Extract mission data from OCR text
// Returns: { payout: number, segments: [{ commodity, pickup, delivery, quantity }] }
//
// Key Design Principles:
// 1. Segment-based parsing (1:1 mapping of delivery lines to commodity rows)
// 2. Use OCR mappings for normalization (no manual string replacement)
// 3. Simple, focused preprocessing (fix only what breaks the regex)
// 4. No complex distribution logic - each delivery line = one segment
// ============================================================================

/**
 * Parse Star Citizen mission from OCR text
 * @param {string} text - Raw OCR text from mission screenshot
 * @returns {object} - { payout: number, segments: Array }
 */
function parseStarCitizenMission(text) {
    console.log('🔍 Parsing Star Citizen mission...');
    
    // Step 1: Extract payout
    const payout = extractPayout(text);
    
    // Step 2: Preprocess text to fix line breaks and OCR errors
    text = preprocessText(text);
    
    // Step 3: Extract commodity segments
    const segments = extractSegments(text);
    
    console.log(`✅ Extracted: ${payout ? '₡' + payout.toLocaleString() : 'No payout'}, ${segments.length} segments`);
    
    return { payout, segments };
}

/**
 * Extract mission payout from text
 * Handles OCR errors where "Reward" or "=" are misread
 */
function extractPayout(text) {
    // Pattern 1: Standard "Reward" with flexible separator
    // Handles: =, a, x, &, 1, u, Â®, or any garbage before the number
    // Matches: "Reward = 99,500" or "Reward 1 90,750" or "Reward Â® 90,250"
    // Strategy: Match "Reward", skip up to 10 chars (but not newline), then find 5+ digit number with commas
    let match = text.match(/Reward[^\n]{0,10}?(\d{2,3},\d{3}|\d{5,})/i);
    
    if (match) {
        const payout = parseInt(match[1].replace(/,/g, ''), 10);
        console.log(`💰 Payout: ₡${payout.toLocaleString()}`);
        return payout;
    }
    
    // Pattern 2: OCR misread "Reward" as "EEL]" or similar
    // Matches: "EEL] = 90,250"
    match = text.match(/(?:EEL\]|REE|RRE)[^\n]{0,10}?(\d{2,3},\d{3}|\d{5,})/i);
    
    if (match) {
        const payout = parseInt(match[1].replace(/,/g, ''), 10);
        console.log(`💰 Payout (alt pattern): ₡${payout.toLocaleString()}`);
        return payout;
    }
    
    console.log('💰 Payout: Not found');
    return null;
}

/**
 * Preprocess OCR text to fix common issues
 * Only fixes things that would break the regex patterns
 */
function preprocessText(text) {
    console.log('📝 Preprocessing text...');
    
    // Fix 1: Join location names that break across lines
    // Example: "Sakura Sun\nGoldenrod" → "Sakura Sun Goldenrod"
    text = text.replace(/Sakura Sun\s*\n\s*Goldenrod/gi, 'Sakura Sun Goldenrod');
    text = text.replace(/Greycat Stanton IV\s*\n\s*Production/gi, 'Greycat Stanton IV Production');
    text = text.replace(/Rayari (\w+)\s*\n\s*Research/gi, 'Rayari $1 Research');
    text = text.replace(/NB Int\.?\s*\n\s*Spaceport/gi, 'NB Int. Spaceport');
    
    // Fix 2: Join facility codes that break across lines
    // Example: "SMO-\n18" → "SMO-18"
    text = text.replace(/SMO-\s*\n\s*(\d+)/gi, 'SMO-$1');
    text = text.replace(/SM0-\s*\n\s*(\d+)/gi, 'SMO-$1');
    text = text.replace(/SMCa-\s*\n\s*(\d+)/gi, 'SMCa-$1');
    text = text.replace(/S4DC\s*\n\s*(\d+)/gi, 'S4DC$1');
    text = text.replace(/S4LD\s*\n\s*(\d+)/gi, 'S4LD$1');
    
    // Fix 3: Join "Facility" or "Mining" prefix with code on next line
    // Example: "Mining\nSMO-18" → "Mining SMO-18"
    text = text.replace(/Mining\s*\n\s*(SMO-?\d+|SMCa-?\d+)/gi, 'Mining $1');
    text = text.replace(/Facility\s*\n\s*(SMO-?\d+|S4DC\d+)/gi, 'Facility $1');
    
    console.log('  ✅ Preprocessing complete');
    return text;
}

/**
 * Extract commodity segments from preprocessed text
 * Each segment represents one delivery line
 */
function extractSegments(text) {
    console.log('🚚 Extracting delivery segments...');
    const segments = [];
    
    // Pattern: "Deliver 0/3 SCU of Stims to Shubin Mining Facility SMCa-6 on Calliope"
    // Captures: quantity (0/3 or 3), commodity (Stims), location (Shubin Mining Facility SMCa-6)
    const deliverPattern = /Deliver\s+(0\/\d+|\d+)\s+SCU\s+(?:of\s+)?([\w\s\(\)]+?)\s+to\s+([\w\s\-\.\']+?)\s+(?:on|above)\s+/gi;
    
    let match;
    while ((match = deliverPattern.exec(text)) !== null) {
        const quantityStr = match[1];
        const commodityRaw = match[2].trim();
        const deliveryRaw = match[3].trim();
        const deliverPos = match.index;
        
        // Parse quantity (handle "0/3" format)
        const quantity = parseQuantity(quantityStr);
        
        // Clean commodity name
        const commodity = cleanCommodity(commodityRaw);
        
        // Clean delivery location
        const delivery = cleanLocation(deliveryRaw);
        
        // Find matching pickup location (search backwards)
        const pickup = findPickupLocation(text, commodity, deliverPos);
        
        if (pickup && delivery && commodity && quantity > 0) {
            segments.push({ commodity, pickup, delivery, quantity });
            console.log(`  ✓ ${quantity} ${commodity}: ${pickup} → ${delivery}`);
        } else {
            console.log(`  ⚠️ Incomplete segment (skipping):`, { commodity, pickup, delivery, quantity });
        }
    }
    
    console.log(`  ✅ Extracted ${segments.length} segments`);
    return segments;
}

/**
 * Parse quantity string from OCR text
 * Handles formats: "0/3", "3", "075" (OCR errors)
 */
function parseQuantity(str) {
    // Format: "0/3" (game UI shows progress/total)
    if (str.includes('/')) {
        const parts = str.split('/');
        return parseInt(parts[1], 10);
    }
    
    // Format: "075" (OCR sometimes adds leading zero)
    // Just remove leading zeros
    const cleaned = str.replace(/^0+/, '') || '0';
    return parseInt(cleaned, 10);
}

/**
 * Clean commodity name
 * Removes parentheses and applies OCR mappings
 */
function cleanCommodity(commodity) {
    // Remove (Raw), (Refined), etc.
    let cleaned = commodity.replace(/\s*\([^)]+\)\s*/g, ' ').trim();
    
    // Apply OCR mappings if available
    if (window.OCR_MAPPINGS) {
        cleaned = window.OCR_MAPPINGS.applyCommodityAlias(cleaned);
    }
    
    return cleaned;
}

/**
 * Clean location name
 * Applies OCR mappings and handles common patterns
 */
function cleanLocation(location) {
    let cleaned = location.trim();
    
    // Apply OCR mappings if available
    if (window.OCR_MAPPINGS) {
        cleaned = window.OCR_MAPPINGS.applyLocationAlias(cleaned);
    }
    
    return cleaned;
}

/**
 * Find pickup location by searching backwards from delivery position
 * Looks for "Collect [commodity] from [location]"
 */
function findPickupLocation(text, commodity, deliverPos) {
    // Search backwards from delivery (up to 1000 chars before)
    const searchStart = Math.max(0, deliverPos - 1000);
    const textBefore = text.substring(searchStart, deliverPos);
    
    // Pattern: "Collect Stims from Port Tressler."
    // Use flexible commodity matching (replace spaces with \s+)
    const commodityPattern = commodity.replace(/\s+/g, '\\s+');
    const collectPattern = new RegExp(
        `Collect\\s+${commodityPattern}\\s+(?:\\([^)]+\\)\\s+)?from\\s+([\\w\\s\\-\\.\']+?)(?:\\.|\\n)`,
        'gi'
    );
    
    // Find ALL matches, take the LAST one (closest to delivery)
    const matches = Array.from(textBefore.matchAll(collectPattern));
    
    if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const pickupRaw = lastMatch[1].trim();
        return cleanLocation(pickupRaw);
    }
    
    return null;
}

// ============================================================================
// EXPORT FOR USE IN OCR SCANNER
// ============================================================================

// Make available globally for use in ocr-scanner.html
if (typeof window !== 'undefined') {
    window.parseStarCitizenMission = parseStarCitizenMission;
}
