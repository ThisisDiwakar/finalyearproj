# 🏗️ Admin Dashboard Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Admin Dashboard (React)                  │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │  │
│  │  │ Stats  │ │  Map   │ │ Table  │ │Activity│        │  │
│  │  │ Cards  │ │Section │ │        │ │  Feed  │        │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   IPFS SERVICE LAYER                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  fetchIPFSData() → getHash() → validate() → parse()  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/admin/* → auth → authorize('admin') → handler  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATA STORAGE                             │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐     │
│  │ MongoDB  │        │   IPFS   │        │  Pinata  │     │
│  │(Projects)│        │(Registry)│        │ (Backup) │     │
│  └──────────┘        └──────────┘        └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
└── AdminRoute (role guard)
    └── AdminDashboard
        ├── AdminHeader
        │   ├── Logo
        │   ├── Navigation
        │   └── User Badge
        │
        ├── StatsCards
        │   ├── ProjectsCard (with donut chart)
        │   ├── AreaCard (with sparkline)
        │   ├── CarbonCard (with metrics)
        │   └── EarningsCard (with totals)
        │
        ├── QuickActions
        │   ├── Review Pending Button
        │   ├── Generate Report Button
        │   ├── Export CSV Button
        │   └── Refresh IPFS Button
        │
        ├── MapSection
        │   ├── FiltersBar
        │   │   ├── Status Filter
        │   │   └── State Filter
        │   ├── IndiaMap (Leaflet)
        │   │   └── Markers (color-coded)
        │   └── ProjectDrawer (conditional)
        │       ├── Project Details
        │       └── Action Buttons
        │
        ├── ActivityFeed
        │   └── Timeline Items
        │
        ├── ProjectsTable
        │   ├── Table Header (sticky)
        │   └── Table Rows
        │       └── View Button
        │
        └── AnalyticsPanel (conditional)
            ├── State Distribution Chart
            ├── CO₂ Overview Grid
            ├── Status Distribution
            └── Financial Overview
```

## Data Flow

### 1. Authentication Flow
```
User Login
    ↓
JWT Token Generated
    ↓
Token Stored (localStorage)
    ↓
Role Checked (admin?)
    ↓
Redirect to /admin
```

### 2. IPFS Sync Flow
```
Click "Refresh IPFS"
    ↓
fetchIPFSData()
    ↓
GET /api/admin/ipfs-hash
    ↓
Validate Hash Format
    ↓
Fetch from IPFS Gateway
    ↓
Parse & Calculate Metrics
    ↓
Update Dashboard State
    ↓
Re-render All Components
```

### 3. Project Action Flow
```
Click Project Pin/Row
    ↓
Open ProjectDrawer
    ↓
Click "Approve" Button
    ↓
POST /api/admin/projects/:id/approve
    ↓
Update Project Status
    ↓
Show Success Toast
    ↓
Close Drawer
    ↓
Refresh Data
```

## State Management

```javascript
// AdminDashboard.jsx
const [dashboardData, setDashboardData] = useState({
  // Zero-state by default
  totalProjects: 0,
  pendingProjects: 0,
  reviewProjects: 0,
  approvedProjects: 0,
  rejectedProjects: 0,
  totalArea: 0.0,
  monthlyAreaIncrease: 0.0,
  totalCarbon: 0.0,
  equivalentCars: 0,
  totalEarnings: 0,
  statesCount: 0,
  projects: [],
  activityFeed: []
});

const [loading, setLoading] = useState(true);
const [showAnalytics, setShowAnalytics] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);
```

## API Request Flow

```
Frontend Component
    ↓
ipfsService.js
    ↓
axios.get('/api/admin/ipfs-hash', {
  headers: { Authorization: `Bearer ${token}` }
})
    ↓
Backend: auth middleware
    ↓
Backend: authorize('admin') middleware
    ↓
Backend: route handler
    ↓
Response with data
    ↓
Parse & update state
    ↓
UI re-renders
```

## Security Layers

```
┌─────────────────────────────────────┐
│  Layer 1: Route Guard (Frontend)   │
│  AdminRoute checks user.role        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Layer 2: JWT Validation            │
│  auth middleware verifies token     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Layer 3: Role Authorization        │
│  authorize('admin') checks role     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Layer 4: Input Validation          │
│  Validate request parameters        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Layer 5: Database Access           │
│  Execute authorized operation       │
└─────────────────────────────────────┘
```

## File Dependencies

```
AdminDashboard.jsx
├── imports AdminHeader.jsx
├── imports StatsCards/StatsCards.jsx
│   ├── imports ProjectsCard.jsx
│   ├── imports AreaCard.jsx
│   ├── imports CarbonCard.jsx
│   └── imports EarningsCard.jsx
├── imports MapSection/MapSection.jsx
│   ├── imports IndiaMap.jsx
│   ├── imports FiltersBar.jsx
│   └── imports ProjectDrawer.jsx
├── imports QuickActions.jsx
├── imports ProjectsTable.jsx
├── imports ActivityFeed.jsx
├── imports AnalyticsPanel.jsx
├── imports ipfsService.js
└── imports AuthContext.jsx
```

## CSS Architecture

```
AdminDashboard.css (global styles)
├── Ocean gradient background
├── Glass card base styles
├── Status pill styles
├── Animation keyframes
└── Responsive breakpoints

Component-specific CSS files:
├── AdminHeader.css
├── StatsCards.css
├── MapSection.css
├── FiltersBar.css
├── ProjectDrawer.css
├── QuickActions.css
├── ProjectsTable.css
├── ActivityFeed.css
└── AnalyticsPanel.css
```

## Responsive Design Strategy

```
Desktop (> 1200px)
├── 4-column stats grid
├── 70/30 map/feed split
└── Full navigation

Tablet (768-1200px)
├── 2-column stats grid
├── Stacked map/feed
└── Collapsed navigation

Mobile (< 768px)
├── 1-column stack
├── Full-width components
└── Hamburger menu
```

## Performance Optimization

```
1. Code Splitting
   └── Lazy load AnalyticsPanel

2. Memoization
   └── React.memo for heavy components

3. Debouncing
   └── Filter changes debounced

4. Virtual Scrolling
   └── Large tables use windowing

5. Image Optimization
   └── Lazy load map tiles

6. Bundle Optimization
   └── Tree-shaking unused code
```

## Error Handling Strategy

```
Try-Catch Blocks
    ↓
Log Error to Console
    ↓
Show User-Friendly Toast
    ↓
Fallback to Zero-State
    ↓
Retry Mechanism Available
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         CDN (Frontend)              │
│  Static files, images, CSS, JS      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Load Balancer (HTTPS)          │
│  SSL termination, routing           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    Backend API Servers (Node.js)    │
│  Express, JWT auth, role checks     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Database Cluster (MongoDB)     │
│  Replica set, sharding              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      IPFS Network (Distributed)     │
│  Pinata, Infura, local nodes        │
└─────────────────────────────────────┘
```

## Monitoring & Logging

```
Frontend
├── Console errors
├── Performance metrics
└── User analytics

Backend
├── Request logs
├── Error tracking
├── Performance monitoring
└── Security alerts

IPFS
├── Sync status
├── Hash validation
└── Gateway health
```

## Scalability Considerations

```
Horizontal Scaling
├── Multiple backend instances
├── Load balancer distribution
└── Session-less JWT auth

Vertical Scaling
├── Increase server resources
├── Database optimization
└── Caching layer (Redis)

Data Scaling
├── IPFS distributed storage
├── MongoDB sharding
└── CDN for static assets
```

## Testing Strategy

```
Unit Tests
├── Component rendering
├── Service functions
└── Utility helpers

Integration Tests
├── API endpoints
├── Auth flow
└── IPFS sync

E2E Tests
├── User login
├── Dashboard interaction
└── Project actions

Performance Tests
├── Load testing
├── Stress testing
└── Benchmark metrics
```

---

**This architecture supports:**
- ✅ Scalability (horizontal & vertical)
- ✅ Security (multi-layer)
- ✅ Performance (optimized)
- ✅ Maintainability (modular)
- ✅ Reliability (error handling)
