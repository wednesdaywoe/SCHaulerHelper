# CLAUDE.md - SCHaulerHelper

**Last Updated**: 2025-12-01
**Project**: Star Citizen Cargo Hauling Helper Tool
**Status**: Work in Progress (WIP)

## Project Overview

SCHaulerHelper is a single-page web application designed to help Star Citizen players plan and organize cargo hauling missions. The tool provides ship capacity tracking, mission planning, commodity management, and delivery organization features.

**Live Purpose**: Calculate optimal cargo loads, track multiple missions, organize deliveries by location or commodity, and provide visual box breakdown calculations for in-game cargo management.

## Architecture

### Tech Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage API
- **No Dependencies**: Zero external libraries or frameworks
- **Single File Architecture**: Entire application contained in `index.html`

### Design Pattern
- **Component-based UI**: Dynamic DOM manipulation with template literals
- **State Management**: Global JavaScript objects (`missions`, `locationColors`, `deliveryOrder`, etc.)
- **Event-driven**: Inline event handlers for user interactions
- **Persistent State**: Auto-save to LocalStorage on every data change

## File Structure

```
SCHaulerHelper/
├── README.md           # Minimal project description
├── index.html          # Complete application (HTML + CSS + JS)
└── CLAUDE.md          # This file
```

## Key Components & Data Models

### 1. Data Structures

#### Ship Object
```javascript
{
  id: "ship_identifier",
  name: "Display Name",
  capacity: 123,        // SCU capacity
  grids: 4             // Optional: cargo grid count
}
```

#### Mission Object
```javascript
{
  id: "mission_1",
  payout: "50k",       // String format: "123k"
  commodities: []      // Array of Commodity objects
}
```

#### Commodity Object
```javascript
{
  id: "mission_1_commodity_0",
  pickup: "Location Name",
  commodity: "Commodity Name",
  quantity: "24",              // String (SCU)
  maxBoxSize: "4",            // String: "1", "2", "4", "8", "16", "24", "32"
  destination: "Location Name"
}
```

#### Location Color Mapping
```javascript
locationColors = {
  "Location Name": {
    color: "#4dd4ac",    // Hex color
    label: "1"          // Marker label (customizable)
  }
}
```

### 2. Global State Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `missionCounter` | Number | Auto-increment for mission IDs |
| `selectedShip` | Object/null | Currently selected ship |
| `selectedSystem` | String/null | Currently selected system |
| `selectedCategory` | String/null | Mission category ("planetary", "local", "stellar") |
| `missions` | Array | All mission data |
| `locationColors` | Object | Color/label mappings for delivery markers |
| `deliveryOrder` | Array | Custom sort order for location-based view |
| `commodityOrder` | Array | Custom sort order for commodity-based view |
| `organizerGroupBy` | String | "location" or "commodity" |
| `currentColorTarget` | String/null | Active location in color picker |

### 3. Database Objects

#### Ships Database
- 47 ships with capacities ranging from 1 SCU to 4608 SCU
- Located in `ships` array (lines 1369-1417)
- Includes manufacturers: Aegis, Anvil, Argo, Crusader, Drake, MISC, Origin, RSI, Gatac

#### Locations Database
- Organized by mission category: `planetary`, `local`, `stellar`
- Planetary: 21 locations (Microtech region)
- Local: 7 locations
- Stellar: 13 locations
- Located in `locations` object (lines 1420-1436)

#### Commodities Database
- Category-specific commodity lists
- Planetary: 18 commodities
- Local: 10 commodities
- Stellar: 14 commodities
- Located in `commodities` object (lines 1439-1454)

#### Payouts Database
- Pre-defined payout values per category
- Planetary: 24 payout options (30k - 394k)
- Local: 6 payout options (52.5k - 163.75k)
- Stellar: 29 payout options (51.5k - 383k)
- Located in `payouts` object (lines 1457-1472)

## Core Features

### 1. Mission Management
- **Add Mission**: Creates new mission panel with payout selector
- **Remove Mission**: Deletes mission and updates all stats
- **Max 4 Commodities**: Each mission limited to 4 commodity entries
- **Auto-defaults**: New commodity rows inherit previous row's location/commodity

### 2. Commodity Management
- **Box Size Calculator**: `calculateBoxBreakdown(scu, maxBoxSize)`
  - Greedy algorithm: fills largest boxes first
  - Supports: 32, 24, 16, 8, 4, 2, 1 SCU boxes
  - Respects max box size constraint
- **Dynamic dropdowns**: Location/commodity lists filtered by selected category
- **Copy-forward**: Previous commodity values auto-populate new rows

### 3. Delivery Organizer
- **Two view modes**: Group by Location OR by Commodity
- **Drag-and-drop reordering**: Custom delivery sequence
- **Color-coded markers**: Visual identification system
- **Editable labels**: Click marker to change label text
- **Layout toggle**: Single column ⇄ Two column grid
- **Box breakdown display**: Shows optimal box configuration per delivery

### 4. Statistics Panel
- **Total Payout**: Sum of all mission payouts (displayed in K format)
- **SCU Total**: Sum of all commodity quantities
- **Capacity Meter**:
  - Visual progress bar
  - Flashing red animation when over capacity
  - Shows current/max in text format

### 5. Theme System
- **10 themes**: Stardust (default), Lux, Pulse, Flow, Dark, Wednesday, Moonshine, ARGO, Cargo Explorer, Starkitten
- **CSS Custom Properties**: All themes use CSS variables
- **Theme-specific palettes**: Each theme has 8 custom colors for markers
- **Special styling**: Some themes have unique component styling (e.g., Lux theme cyan values)

### 6. Persistence Layer
- **Session Save**: Triggered on every data change
- **Saved data**:
  - Ship selection
  - System & category selections
  - All missions with commodities
  - Location color mappings
  - Custom delivery order
  - Theme preference
  - Layout preference
  - Grouping preference
- **LocalStorage keys**:
  - `haulerHelperSession` - Main session data
  - `haulerHelperTheme` - Selected theme
  - `haulerHelperDeliveryLayout` - Layout mode
  - `haulerHelperDeliveryOrder` - Location sort order
  - `haulerHelperCommodityOrder` - Commodity sort order
  - `haulerHelperOrganizerGroupBy` - Grouping mode

## Development Workflows

### Adding a New Ship
1. Locate `ships` array (line 1369)
2. Add object with format: `{id: "manufacturer_model", name: "Display Name", capacity: NUMBER}`
3. Optional: Add `grids: NUMBER` for ships with cargo grids
4. Ships auto-populate in dropdown via `populateShipSelect()`

### Adding a New Location
1. Locate `locations` object (line 1420)
2. Add location string to appropriate category array
3. Location will auto-appear in dropdowns when category is selected

### Adding a New Commodity
1. Locate `commodities` object (line 1439)
2. Add commodity string to appropriate category array
3. Commodity will auto-appear in dropdowns when category is selected

### Adding a New Payout Option
1. Locate `payouts` object (line 1457)
2. Add payout string (format: "123k") to appropriate category array
3. Keep arrays sorted ascending for better UX

### Creating a New Theme
1. Add theme option to `themeSelect` dropdown (line 1262)
2. Create theme CSS variables block following existing pattern (lines 28-463)
3. Add color palette to `themeColorPalettes` object (line 1355)
4. Add marker colors to `.theme-colors` section (lines 465-573)
5. Test all components with new theme

### Modifying Box Sizes
1. Locate `calculateBoxBreakdown()` function (line 1882)
2. Modify `allBoxSizes` array
3. Update max box size dropdown options (lines 1814-1822)

## Key Functions Reference

### Initialization
- `init()` - Main initialization, calls all load functions
- `populateShipSelect()` - Populates ship datalist
- `loadSession()` - Restores session from LocalStorage
- `loadTheme()` - Applies saved theme
- `loadDeliveryLayout()` - Applies layout preference
- `updateColorPalette()` - Sets color picker palette

### Mission Operations
- `addMissionPanel()` - Creates new mission
- `removeMissionPanel(missionId)` - Deletes mission
- `createMissionPanel(missionId, missionNumber)` - Returns mission DOM element
- `updateMissionPayout(missionId, payout)` - Sets mission payout

### Commodity Operations
- `addCommodityRow(missionId)` - Adds commodity to mission
- `removeCommodityRow(missionId, commodityId)` - Removes commodity
- `createCommodityRow(missionId, commodityId, showRemove)` - Returns commodity DOM element
- `updateCommodity(commodityId, field, value)` - Updates commodity property

### Delivery Organizer
- `updateDeliverySummary()` - Refreshes delivery view (delegates to grouping method)
- `updateDeliverySummaryByLocation(container)` - Renders location-grouped view
- `updateDeliverySummaryByCommodity(container)` - Renders commodity-grouped view
- `changeOrganizerGrouping()` - Switches grouping mode

### Drag & Drop
- `handleDragStart(e)` - Initiates drag
- `handleDragEnd(e)` - Cleanup after drag
- `handleDragOver(e)` - Allows drop
- `handleDrop(e)` - Reorders items
- `saveDeliveryOrder()` - Persists location order
- `saveCommodityOrder()` - Persists commodity order

### Statistics
- `updateStats()` - Recalculates all statistics
- `calculateBoxBreakdown(scu, maxBoxSize)` - Returns optimal box configuration

### Color Management
- `openColorPicker(location)` - Shows color modal
- `closeColorPicker()` - Hides color modal
- `confirmColor()` - Applies selected color
- `updateMarkerLabel(location, label)` - Updates marker text

### Persistence
- `saveSession()` - Writes current state to LocalStorage
- `loadSession()` - Reads state from LocalStorage
- `resetAll()` - Clears all data (with confirmation)

## Coding Conventions

### Naming
- **Functions**: camelCase (`addMissionPanel`, `updateStats`)
- **Variables**: camelCase (`missionCounter`, `selectedShip`)
- **IDs**: snake_case for data (`mission_1`), camelCase for DOM (`missionsContainer`)
- **CSS Classes**: kebab-case (`mission-panel`, `delivery-location`)

### HTML Generation
- **Template literals**: All dynamic HTML uses template strings
- **Inline event handlers**: `onclick`, `onchange`, `ondrag*` attributes
- **Data attributes**: `data-location`, `data-id` for element metadata

### CSS Architecture
- **CSS Custom Properties**: All colors/values use CSS variables
- **Theme-first**: Base styles reference variables, themes override them
- **BEM-inspired**: Component-based class naming
- **Responsive**: Uses CSS Grid and Flexbox

### State Management
- **Single source of truth**: Global state objects
- **Update pattern**: User action → Update state → Refresh UI → Save session
- **No state diffing**: Full re-renders on updates

## Browser Compatibility

### Requirements
- **LocalStorage**: Required for persistence
- **ES6+**: Template literals, arrow functions, const/let
- **CSS Grid**: Main layout system
- **CSS Custom Properties**: Theme system
- **Drag and Drop API**: Delivery reordering

### Tested Browsers
- Modern Chrome, Firefox, Safari, Edge
- **Not compatible**: IE11 and below

## Extension Points

### Adding Game Systems
Currently hardcoded to Stanton. To add new systems:
1. Expand `systemSelect` options (line 1247)
2. Add system-specific location databases
3. Modify location filtering logic in `createCommodityRow()`

### Adding Reputation/Faction Data
Could extend missions to track:
```javascript
mission: {
  // ... existing fields
  faction: "Crusader Industries",
  reputation: "+5"
}
```

### Adding Route Optimization
Potential feature: auto-sort deliveries by proximity
- Would need location coordinate data
- Implement TSP/nearest-neighbor algorithm
- Add "Optimize Route" button

### Adding Import/Export
Currently no data portability. Could add:
- JSON export/import buttons
- Share links with encoded mission data
- Copy to clipboard functionality

### Adding Multi-Ship Planning
Currently single-ship. Could extend to:
- Multi-ship fleet management
- Cargo distribution across ships
- Ship comparison view

## Testing Considerations

### Manual Testing Checklist
- [ ] Ship selection updates capacity meter
- [ ] Mission category changes filter locations/commodities/payouts
- [ ] Adding/removing missions updates stats
- [ ] Adding/removing commodities updates delivery organizer
- [ ] Drag-and-drop reordering persists
- [ ] Theme changes apply correctly
- [ ] Color picker updates markers
- [ ] Layout toggle works
- [ ] Grouping toggle switches views
- [ ] LocalStorage persists across refresh
- [ ] Reset button clears all data
- [ ] Over-capacity shows red flashing meter
- [ ] Box breakdown calculations correct
- [ ] Custom marker labels save

### Edge Cases
- **No ship selected**: Capacity meter shows 0/0
- **Over capacity**: Red flashing animation
- **Empty state**: "No deliveries planned" message
- **Invalid ship name**: Clears input, sets `selectedShip = null`
- **Max commodities**: Alert prevents adding 5th commodity
- **No category selected**: Alert prevents adding mission

### Known Limitations
- **No validation**: Commodity quantity can be negative or non-integer
- **No duplicate detection**: Same commodity can be added multiple times
- **No conflict warnings**: Can select same pickup/destination
- **No data versioning**: LocalStorage schema changes break old sessions
- **No offline detection**: LocalStorage errors not handled

## Deployment

### Static Hosting
Since this is a single HTML file with no server dependencies:
1. **GitHub Pages**: Push to `gh-pages` branch
2. **Netlify**: Drag-and-drop `index.html`
3. **Vercel**: Deploy static files
4. **S3 + CloudFront**: Upload to S3 bucket

### Configuration
No build process required. No environment variables.

### Performance
- **Initial load**: ~200KB (all inline CSS/JS)
- **Runtime**: Lightweight DOM manipulation
- **LocalStorage**: Small data footprint (<100KB typical)

## Common AI Assistant Tasks

### "Add a new feature"
1. Understand feature requirements
2. Check if data model needs extension
3. Add UI controls to appropriate section
4. Implement business logic function
5. Wire event handlers
6. Update `saveSession()`/`loadSession()` if persisting data
7. Test all edge cases
8. Update this CLAUDE.md

### "Fix a bug"
1. Reproduce issue in browser console
2. Locate relevant function(s)
3. Add console.log debugging if needed
4. Fix logic error
5. Test fix with multiple scenarios
6. Check if related features affected

### "Refactor code"
1. **IMPORTANT**: This is a single-file app by design
2. Consider impact on readability vs. optimization
3. Test thoroughly after refactoring (no safety net)
4. Maintain inline event handler pattern
5. Keep global state pattern consistent

### "Add a theme"
1. Get color palette from user (8+ colors)
2. Follow theme creation workflow above
3. Test all components render correctly
4. Verify color contrast for accessibility
5. Add theme to dropdown

### "Update game data"
When Star Citizen updates ship capacities, locations, or commodities:
1. User provides update source/data
2. Locate appropriate database object
3. Update/add/remove entries
4. Verify dropdown population works
5. Test with existing sessions (data migration may be needed)

## Important Notes for AI Assistants

### DO
✅ Maintain single-file architecture
✅ Use inline event handlers
✅ Update `saveSession()`/`loadSession()` when adding persisted data
✅ Follow existing naming conventions
✅ Test in browser after changes
✅ Keep functions self-contained and readable
✅ Add new LocalStorage keys to "Reset All" function
✅ Update this CLAUDE.md after significant changes

### DON'T
❌ Add external dependencies or frameworks
❌ Split into multiple files without explicit request
❌ Change global state management pattern
❌ Remove LocalStorage auto-save behavior
❌ Break existing session data format without migration
❌ Add server-side requirements
❌ Implement complex build processes
❌ Remove inline styles/scripts without user approval

## Debugging Tips

### Browser Console Inspection
```javascript
// View current state
console.log(missions);
console.log(locationColors);
console.log(deliveryOrder);

// View LocalStorage
console.log(localStorage.getItem('haulerHelperSession'));

// Test box breakdown
calculateBoxBreakdown(100, 32);
```

### Common Issues
1. **Deliveries not showing**: Check `selectedCategory` is set
2. **Colors not persisting**: Verify `saveSession()` called after color change
3. **Drag-and-drop broken**: Check event handlers attached, browser compatibility
4. **Stats not updating**: Ensure `updateStats()` called after data change
5. **Theme not loading**: Check LocalStorage key and CSS custom properties

## Future Enhancements (Ideas)

- [ ] Route optimization algorithm
- [ ] Multi-ship fleet management
- [ ] Profit margin calculator (buy/sell prices)
- [ ] Mission timer/tracker
- [ ] Reputation tracking
- [ ] Export to PDF/image
- [ ] Share functionality (URL params)
- [ ] Mobile-responsive design
- [ ] Dark mode toggle (independent of theme)
- [ ] Undo/redo functionality
- [ ] Mission templates/presets
- [ ] Integration with external APIs (if available)
- [ ] Multi-language support

## Project Metadata

**Author**: wednesdaywoe
**YouTube**: [@wednesdaywoeplays](https://www.youtube.com/@wednesdaywoeplays)
**License**: Not specified (assume personal/fan project)
**Game**: Star Citizen (unofficial fan tool)
**Repository**: wednesdaywoe/SCHaulerHelper

---

*This CLAUDE.md file is designed to help AI assistants understand and work with this codebase effectively. Keep it updated as the project evolves.*
