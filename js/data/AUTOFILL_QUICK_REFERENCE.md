# AUTOFILL PATTERNS - QUICK REFERENCE CARD

## 🎯 WHERE TO EDIT
**File:** `C:\Projects\Cargo Hauler\js\data\autofill-patterns.js`

---

## 📋 PATTERN STRUCTURE

```javascript
{
    pickups: [location1, location2, location3, location4],      // Optional, use null to skip
    destinations: [location1, location2, location3, location4], // Optional, use null to skip
    commodities: [commodity1, commodity2, commodity3, commodity4] // REQUIRED
}
```

---

## 🔢 PATTERN PRIORITY ORDER

1. **Payout-Specific** (Highest) → System + Commodity + Exact Payout
2. **Commodity-Only** (Medium) → System + Commodity
3. **Universal Sequence** (Lowest) → Commodity only

---

## ✏️ HOW TO ADD PATTERNS

### TYPE 1: Payout-Specific Pattern

**When to use:** Mission at specific payout always has same layout

```javascript
payoutPatterns.hurston['Aluminum'] = {
    '95k': {
        pickups: [LOCATIONS.EVERUS_HARBOR, LOCATIONS.EVERUS_HARBOR, null, null],
        destinations: ['HDMS-Hahn', 'HDMS-Ryder', null, null],
        commodities: ['Aluminum', 'Titanium', 'Carbon', 'Silicon']
    }
};
```

### TYPE 2: Commodity-Only Pattern

**When to use:** Commodity always follows same pattern in a system (any payout)

```javascript
commodityPatterns.microtech['Scrap'] = {
    pickups: ['Rayari Keltag', 'Rayari Keltag', 'Rayari Keltag', 'Rayari Keltag'],
    commodities: ['Scrap', 'Waste', 'Scrap', 'Waste']
};
```

### TYPE 3: Universal Sequence

**When to use:** Commodity sequence is same everywhere (any system, any payout)

```javascript
universalCommoditySequences['Beryl'] = ['Beryl', 'Beryl', 'Titanium', 'Titanium'];
```

---

## 📍 LOCATION CONSTANTS

### Add New Locations:

```javascript
const LOCATIONS = {
    // microTech
    MICROTECH_DEPOT: 'Covalex S4DC05',
    NEW_BABBAGE: 'New Babbage',
    
    // Hurston
    HURSTON_CASSILLO: 'HDPC-Cassillo',
    EVERUS_HARBOR: 'Everus Harbor',
    
    // YOUR NEW LOCATIONS HERE:
    YOUR_LOCATION: 'Full Location Name',
};
```

**Then use them:**
```javascript
pickups: [LOCATIONS.YOUR_LOCATION, LOCATIONS.EVERUS_HARBOR, null, null]
```

---

## 💡 TIPS

### Use `null` for Optional Fields:
```javascript
// Only fill in first 2 pickups, leave last 2 blank:
pickups: [LOCATIONS.EVERUS_HARBOR, LOCATIONS.EVERUS_HARBOR, null, null]

// Let user fill in all destinations:
destinations: [null, null, null, null]

// Don't include pickups at all (user fills everything):
{
    commodities: ['Quartz', 'Corundum', 'Quartz', 'Corundum']
    // No pickups or destinations defined
}
```

### Test Your Patterns:
1. Open Hauler Helper
2. Set System + Category
3. Add a mission
4. Select the first commodity
5. Watch browser console (F12):
   - ✅ `Found payout-specific pattern` = Success!
   - ✅ `Found commodity-only pattern` = Success!
   - ❌ `No autofill pattern found` = Pattern didn't match

---

## 🔍 DEBUG CONSOLE MESSAGES

```javascript
// When you select the first commodity:
🔍 Checking autofill: hurston / Press Ice / Payout: 60.75k

// If pattern found:
✅ Found payout-specific pattern: hurston / Press Ice / 60.75k
✨ Auto-filling hurston mission with Press Ice (payout-specific pattern)

// If no pattern:
❌ No autofill pattern found
```

---

## 📝 REAL EXAMPLES FROM FILE

### Example 1: Hurston Fuel Run (Payout-Specific)
```javascript
payoutPatterns.hurston['Quantum Fuel'] = {
    '60.75k': {
        pickups: [LOCATIONS.HURSTON_CASSILLO, LOCATIONS.HURSTON_CASSILLO, 
                  LOCATIONS.HURSTON_CASSILLO, LOCATIONS.HURSTON_CASSILLO],
        destinations: [LOCATIONS.HURSTON_OPEREI, LOCATIONS.HURSTON_OPEREI,
                      LOCATIONS.HURSTON_OPEREI, LOCATIONS.HURSTON_OPEREI],
        commodities: ['Quantum Fuel', 'Hydrogen Fuel', 'Hydrogen Fuel', 'Ship Ammo']
    }
};
```

### Example 2: microTech Stims (Commodity-Only)
```javascript
commodityPatterns.microtech['Stims'] = {
    pickups: [LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT, 
              LOCATIONS.MICROTECH_DEPOT, LOCATIONS.MICROTECH_DEPOT],
    commodities: ['Stims', 'Stims', 'Stims', 'Stims']
};
```

### Example 3: Universal Waste Pattern
```javascript
universalCommoditySequences['Waste'] = ['Waste', 'Scrap', 'Waste', 'Scrap'];
```

---

## ⚠️ COMMON MISTAKES

### ❌ Wrong System Name:
```javascript
payoutPatterns.Hurston['Aluminum'] = { ... }  // WRONG - capital H
payoutPatterns.hurston['Aluminum'] = { ... }  // CORRECT - lowercase
```

### ❌ Missing Commodities:
```javascript
{
    pickups: [...],
    destinations: [...]
    // Missing commodities array! - WRONG
}

{
    pickups: [...],
    destinations: [...],
    commodities: [...]  // CORRECT
}
```

### ❌ Wrong Number of Elements:
```javascript
commodities: ['Aluminum', 'Titanium']  // WRONG - only 2, need 4

commodities: ['Aluminum', 'Titanium', 'Carbon', 'Silicon']  // CORRECT - 4 items
```

### ❌ Quotes Around Payout:
```javascript
'60.75k': { ... }  // CORRECT - payout in quotes
60.75k: { ... }    // WRONG - no quotes
```

---

## 🚀 QUICK START

1. Open `autofill-patterns.js`
2. Find the pattern type you want
3. Copy an existing example
4. Change values to match your mission
5. Save file
6. Refresh browser (Ctrl + Shift + R)
7. Test it!

---

## 📞 HELP

**Pattern not triggering?**
- Check console for debug messages
- Verify system name is lowercase
- Make sure payout matches exactly (including 'k')
- Confirm category is correct
- Check that commodities array has 4 items

**Pattern triggers but fills wrong data?**
- Check array order (pickup, destination, commodity all use same order)
- Verify location names match exactly
- Make sure commodity names are correct

**File not loading?**
- Check file is in `js/data/` folder
- Verify filename is `autofill-patterns.js`
- Hard refresh browser (Ctrl + Shift + R)
- Check browser console for errors

---

**File Location:** `C:\Projects\Cargo Hauler\js\data\autofill-patterns.js`  
**Last Updated:** 2025-12-05  
**Version:** 3.3.2
