# India Choropleth Map Implementation Plan

## Goal
Create a choropleth (colored regions) map of India where each state is colored based on project density.

## Color Scheme
- 🔴 Dark Red: 10+ projects (Very High)
- 🟠 Orange: 5-9 projects (High)
- 🟡 Yellow: 2-4 projects (Medium)
- 🟢 Light Green: 1 project (Low)
- ⚪ Gray: 0 projects (No data)

## Implementation Approach

### Option 1: GeoJSON with Leaflet (Recommended)
- Use India state boundaries GeoJSON
- Color each state polygon based on project count
- Add hover effects showing state name and count
- Click to show state details

### Option 2: SVG India Map
- Custom SVG with state paths
- Simpler but less flexible
- Good for basic visualization

## Features to Include
1. State-level coloring based on project density
2. Hover tooltip showing:
   - State name
   - Project count
   - Status breakdown
3. Click to filter projects by state
4. Legend showing color scale
5. Smooth transitions when data updates

## Technical Requirements
- GeoJSON file for India state boundaries
- State name mapping (handle variations)
- Project aggregation by state
- Color interpolation function
- Interactive tooltips

## Next Steps
1. Find/create India states GeoJSON
2. Implement choropleth layer in Leaflet
3. Add state-level aggregation logic
4. Style and add interactivity
5. Keep existing pinpoint markers as overlay option

This will give a professional heat map visualization showing project distribution across India!
