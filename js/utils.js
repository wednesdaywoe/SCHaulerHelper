/**
 * UTILITIES MODULE
 * Helper functions for box calculations, SVG icons, and common utilities for Hauler Helper
 * Version: 3.3.6
 */

// =============================================================================
// BOX CALCULATIONS
// =============================================================================

/**
 * Calculate box breakdown for a given SCU quantity
 * Returns object with box sizes and counts
 * 
 * @param {number} scu - Total SCU to break down
 * @param {number} maxBoxSize - Maximum box size allowed (1, 2, 4, 8, 16, 24, or 32)
 * @returns {Object} - Box sizes as keys, counts as values (e.g. {32: 1, 8: 1, 4: 1})
 */
function calculateBoxBreakdown(scu, maxBoxSize = 32) {
    const allBoxSizes = [32, 24, 16, 8, 4, 2, 1];
    const boxSizes = allBoxSizes.filter(size => size <= maxBoxSize);
    const breakdown = {};
    let remaining = scu;
    
    for (const size of boxSizes) {
        const count = Math.floor(remaining / size);
        if (count > 0) {
            breakdown[size] = count;
            remaining -= size * count;
        }
    }
    
    return breakdown;
}

// =============================================================================
// SVG ICON GENERATION
// =============================================================================

/**
 * Get SVG icon for a specific box size
 * Returns inline SVG markup with custom designs for each size
 * 
 * @param {string|number} size - Box size (1, 2, 4, 8, 16, 24, or 32)
 * @returns {string} - SVG markup
 */
function getBoxIconSVG(size) {
    const svgs = {
        '1': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="box-icon-svg"><path fill="currentColor" d="M15.88,7.74v8.52h-7.75V7.74h7.75M16.88,6.74H7.12v10.52h9.75V6.74h0Z"/><path fill="currentColor" d="M12.11,9.15h.9v6.01h-1.3v-4.68l-1.04.26-.27-1.08,1.71-.51Z"/></svg>',
        '2': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="box-icon-svg"><path fill="currentColor" d="M15.88,3.53v16.94h-7.75V3.53h7.75M16.88,2.53H7.12v18.94h9.75V2.53h0Z"/><path fill="currentColor" d="M10.76,11.21l-.92-.74c.59-.8,1.16-1.24,2.23-1.24,1.27,0,2.06.73,2.06,1.85,0,1-.51,1.5-1.57,2.32l-.97.75h2.6v1.13h-4.42v-1.04l1.99-1.63c.74-.61,1.03-.94,1.03-1.43s-.33-.78-.8-.78-.78.26-1.22.8Z"/></svg>',
        '4': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="box-icon-svg"><path fill="currentColor" d="M20.49,3.53v16.94H3.51V3.53h16.98M21.49,2.53H2.51v18.94h18.98V2.53h0Z"/><path fill="currentColor" d="M13.55,9.53v3.66h.8v1.07h-.8v1.29h-1.25v-1.29h-2.92l-.21-.93,3.28-3.8h1.11ZM12.3,11.33l-1.59,1.86h1.59v-1.86Z"/></svg>',
        '8': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="box-icon-svg"><path fill="currentColor" d="M11.15,11.38c0-.37.31-.69.85-.69s.85.33.85.7c0,.43-.33.74-.85.74s-.85-.32-.85-.75Z"/><path fill="currentColor" d="M13.03,13.91c0,.43-.38.75-1.03.75s-1.03-.32-1.03-.75c0-.47.43-.74,1.03-.74s1.03.27,1.03.74Z"/><path fill="currentColor" d="M2.51,2.73v18.94h18.98V2.73H2.51ZM12,15.74c-1.32,0-2.3-.68-2.3-1.73,0-.73.33-1.16.96-1.45-.46-.28-.76-.66-.76-1.31,0-.92.84-1.65,2.1-1.65s2.1.73,2.1,1.65c0,.65-.3,1.03-.76,1.31.6.32.96.7.96,1.42,0,1.12-.98,1.76-2.3,1.76Z"/></svg>',
        '16': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="box-icon-svg"><path fill="currentColor" d="M13.94,12.76c-.65,0-1.03.36-1.03.87s.39.9,1.04.9,1.03-.37,1.03-.89-.4-.88-1.04-.88Z"/><path fill="currentColor" d="M2.51,2.73v18.94h18.98V2.73H2.51ZM3.72,20.37v-4.71l4.7,4.71H3.72ZM10.33,15.55h-1.3v-4.68l-1.04.26-.27-1.08,1.71-.51h.9v6.01ZM14,15.66c-.77,0-1.3-.23-1.72-.64-.43-.44-.71-1.08-.71-2.27,0-1.85.84-3.27,2.62-3.27.81,0,1.34.24,1.87.66l-.69,1.01c-.39-.3-.71-.48-1.22-.48-.74,0-1.12.6-1.2,1.39.3-.2.64-.39,1.23-.39,1.19,0,2.1.66,2.1,1.91s-.98,2.08-2.28,2.08ZM20.18,8.75l-4.7-4.7h4.7v4.7Z"/></svg>',
        '24': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="box-icon-svg"><path fill="currentColor" d="M2.51,2.73v18.94h18.98V2.73H2.51ZM12,15.74c-1.32,0-2.3-.68-2.3-1.73,0-.73.33-1.16.96-1.45-.46-.28-.76-.66-.76-1.31,0-.92.84-1.65,2.1-1.65s2.1.73,2.1,1.65c0,.65-.3,1.03-.76,1.31.6.32.96.7.96,1.42,0,1.12-.98,1.76-2.3,1.76Z"/></svg>',
        '32': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="box-icon-svg"><path fill="currentColor" d="M2.51,2.54v18.94h18.98V2.54H2.51ZM3.84,3.75h4.7l-4.7,4.7V3.75ZM3.77,20.17v-4.7l4.7,4.7H3.77ZM9.34,15.11c-1.07,0-1.81-.43-2.33-1.03l.9-.87c.42.46.83.72,1.44.72.49,0,.85-.28.85-.73,0-.5-.42-.77-1.17-.77h-.55l-.2-.84,1.43-1.43h-2.36v-1.13h4.05v.99l-1.51,1.44c.82.14,1.59.57,1.59,1.69s-.82,1.96-2.14,1.96ZM12.41,13.96l1.98-1.62c.73-.62,1.02-.94,1.02-1.44s-.32-.77-.8-.77c-.45,0-.77.25-1.21.8l-.93-.74c.6-.81,1.17-1.24,2.24-1.24,1.26,0,2.05.73,2.05,1.85,0,1-.52,1.5-1.58,2.32l-.96.75h2.6v1.14h-4.41v-1.05ZM20.16,20.21h-4.7l4.7-4.7v4.7ZM20.23,8.56l-4.7-4.71h4.7v4.71Z"/></svg>'
    };
    
    return svgs[size] || svgs['4']; // Default to 4 SCU if size not found
}

// =============================================================================
// DELIVERY ORDER MANAGEMENT (Legacy compatibility)
// =============================================================================

/**
 * Load delivery order from localStorage
 * Note: Delivery organizer removed in v3.3.0+, kept for backwards compatibility
 */
function loadDeliveryOrder() {
    const saved = localStorage.getItem('haulerHelperDeliveryOrder');
    if (saved) {
        try {
            // Parse but don't use - feature removed
            console.log('Legacy delivery order data found (ignored)');
        } catch (e) {
            console.warn('Could not parse legacy delivery order');
        }
    }
}

/**
 * Load commodity order from localStorage
 * Note: Delivery organizer removed in v3.3.0+, kept for backwards compatibility
 */
function loadCommodityOrder() {
    const saved = localStorage.getItem('haulerHelperCommodityOrder');
    if (saved) {
        try {
            // Parse but don't use - feature removed
            console.log('Legacy commodity order data found (ignored)');
        } catch (e) {
            console.warn('Could not parse legacy commodity order');
        }
    }
}

/**
 * Load delivery layout preference
 * Note: Delivery organizer removed in v3.3.0+, kept for backwards compatibility
 */
function loadDeliveryLayout() {
    const saved = localStorage.getItem('haulerHelperDeliveryLayout');
    if (saved) {
        console.log('Legacy delivery layout found (ignored)');
    }
}
