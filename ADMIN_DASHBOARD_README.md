# 🌊 Blue Carbon Registry - National Admin Dashboard

## Overview

A government-grade National Admin Dashboard for managing the Blue Carbon Registry platform. This dashboard is exclusively accessible to users with the `admin` role and provides comprehensive oversight of all projects, analytics, and IPFS-synced data.

## Features

### 🔐 Role-Based Access Control
- Only users with `role: 'admin'` can access `/admin` route
- Automatic redirect for non-admin users to regular dashboard
- Admin users are automatically redirected from `/dashboard` to `/admin`

### 📊 Dashboard Components

#### 1. Stats Cards (4-Card Overview)
- **Total Projects**: Shows breakdown by status (Pending, Review, Approved, Rejected)
- **Total Restoration Area**: Displays hectares with monthly increase sparkline
- **Total CO₂ Impact**: Shows tons sequestered and equivalent cars removed
- **Total Earnings**: Displays distributed earnings across states

#### 2. India Map with Project Pins
- Interactive Leaflet map centered on India
- Color-coded pins based on project status:
  - 🔴 Red: Pending
  - 🟡 Amber: Review
  - 🟢 Green: Approved
  - ⚫ Grey: Rejected
- Click pins to open project drawer
- Filter by status and state

#### 3. Project Drawer (Slide-in Panel)
- Displays detailed project information
- Action buttons:
  - Approve Project
  - Reject Project
  - Send to Verifier
- Smooth slide-in animation (300ms)

#### 4. Quick Actions Bar
- Review Pending (with count badge)
- Generate Report
- Export CSV
- Refresh IPFS (triggers data sync)

#### 5. Projects Table
- Sortable columns: Project ID, State, Area, CO₂, Community, Submitted, Status
- Status pills with color coding
- View button to open project drawer
- Sticky header with alternating row shading

#### 6. Activity Feed
- Real-time timeline of project activities
- Color-coded status indicators
- Relative timestamps (e.g., "2h ago")
- Scrollable container

#### 7. Analytics Panel (Toggle)
- State-wise bar chart (top 5 states)
- CO₂ sequestration overview grid
- Project status distribution
- Financial overview with averages

## Design System

### Color Palette
```css
--admin-primary: #00E0B8 (Teal accent)
--admin-pending: #FF4D4F (Red)
--admin-review: #FFC107 (Amber)
--admin-approved: #00C853 (Green)
--admin-rejected: #6C757D (Grey)
--admin-bg: #061B2B (Dark ocean)
```

### Background Gradient
```css
background: radial-gradient(circle at center, #0D2E3F 0%, #0A2236 40%, #061B2B 100%);
```

### Glass Morphism Cards
```css
background: rgba(255,255,255,0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.1);
box-shadow: 0 0 30px rgba(0,224,184,0.05);
border-radius: 16px;
```

## IPFS Integration

### Zero-State Behavior
All metrics display `0` until IPFS data is successfully fetched:
```javascript
{
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
}
```

### IPFS Service Flow
1. `getLatestIPFSHash()` - Fetch hash from backend
2. `validateHash()` - Validate CID format
3. `fetchFromIPFS()` - Retrieve data from IPFS gateway
4. `parseAndValidateData()` - Parse and calculate metrics
5. Update dashboard state and re-render UI

### Development Mode
Set `VITE_IPFS_ENABLED=false` in `.env` to use mock data during development.

## API Endpoints

### Admin Routes (`/api/admin`)

#### Get IPFS Hash
```
GET /api/admin/ipfs-hash
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "data": {
    "hash": "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    "timestamp": "2024-02-24T10:30:00Z"
  }
}
```

#### Approve Project
```
POST /api/admin/projects/:id/approve
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "message": "Project approved successfully",
  "data": { "project": {...} }
}
```

#### Reject Project
```
POST /api/admin/projects/:id/reject
Authorization: Bearer <token>
Role: admin
Body: { "reason": "Insufficient documentation" }

Response:
{
  "success": true,
  "message": "Project rejected successfully",
  "data": { "project": {...} }
}
```

#### Send to Verifier
```
POST /api/admin/projects/:id/send-to-verifier
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "message": "Project sent to verifier successfully",
  "data": { "project": {...} }
}
```

#### Get Admin Stats
```
GET /api/admin/stats
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "data": {
    "totalProjects": 24,
    "pendingProjects": 5,
    "reviewProjects": 8,
    "approvedProjects": 9,
    "rejectedProjects": 2,
    "totalArea": 156.75,
    "totalCarbon": 3420.5
  }
}
```

## File Structure

```
frontend/src/components/Admin/
├── AdminDashboard.jsx          # Main dashboard container
├── AdminDashboard.css          # Global admin styles
├── AdminHeader.jsx             # Sticky navigation header
├── AdminHeader.css
├── StatsCards/
│   ├── StatsCards.jsx          # Stats grid container
│   ├── StatsCards.css
│   ├── ProjectsCard.jsx        # Total projects card
│   ├── AreaCard.jsx            # Restoration area card
│   ├── CarbonCard.jsx          # CO₂ impact card
│   └── EarningsCard.jsx        # Earnings card
├── MapSection/
│   ├── MapSection.jsx          # Map container
│   ├── MapSection.css
│   ├── IndiaMap.jsx            # Leaflet map component
│   ├── FiltersBar.jsx          # Status/state filters
│   ├── FiltersBar.css
│   ├── ProjectDrawer.jsx       # Slide-in project details
│   └── ProjectDrawer.css
├── QuickActions.jsx            # Action buttons bar
├── QuickActions.css
├── ProjectsTable.jsx           # Projects data table
├── ProjectsTable.css
├── ActivityFeed.jsx            # Timeline feed
├── ActivityFeed.css
├── AnalyticsPanel.jsx          # Advanced analytics
└── AnalyticsPanel.css

frontend/src/services/
└── ipfsService.js              # IPFS data fetching logic

backend/routes/
└── admin.js                    # Admin API endpoints
```

## Setup Instructions

### 1. Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
VITE_IPFS_ENABLED=false
```

### 2. Install Dependencies

Frontend already has required packages:
- `react-leaflet` - Map component
- `leaflet` - Map library
- `react-hot-toast` - Notifications

### 3. Create Admin User

Register a user with `role: 'admin'`:
```javascript
{
  "name": "Admin User",
  "email": "admin@bluecarbonregistry.gov.in",
  "password": "securepassword",
  "role": "admin",
  "governmentAgency": "National Centre for Coastal Research (NCCR)",
  "employeeId": "12345678",
  "idProof": [file upload]
}
```

### 4. Access Dashboard

1. Login with admin credentials
2. You'll be automatically redirected to `/admin`
3. Or click "Admin Panel" in the navbar

## Security Features

### Backend Middleware
- JWT authentication required
- Role-based authorization (`authorize('admin')`)
- Input validation and sanitization
- IPFS hash format validation

### Frontend Guards
- `AdminRoute` wrapper component
- Automatic redirect for non-admin users
- Token validation on every request
- Secure localStorage token handling

## UX Behaviors

### Animations
- Fade-in: Stats cards, tables (0.5s ease-out)
- Slide-in: Project drawer (0.3s ease-out)
- Glow: Map pins (2s infinite pulse)
- Count-up: Numbers animate after IPFS load

### Loading States
- Spinner with "Loading..." message
- Disabled buttons during updates
- Skeleton states for empty data

### Error Handling
- Toast notifications for IPFS failures
- Fallback to zero-state on errors
- Retry mechanism for failed requests
- User-friendly error messages

## Testing

### Manual Testing Steps

1. **Admin Access**
   - Login as admin → Should redirect to `/admin`
   - Login as non-admin → Should NOT access `/admin`

2. **IPFS Sync**
   - Click "Refresh IPFS" → Should show loading toast
   - On success → Stats update, map renders pins
   - On failure → Error toast, zero-state persists

3. **Map Interaction**
   - Click project pin → Drawer opens
   - Click overlay → Drawer closes
   - Filter by status → Pins update

4. **Project Actions**
   - Click "Approve" → Success toast, status updates
   - Click "Reject" → Success toast, status updates
   - Click "Send to Verifier" → Success toast, status updates

5. **Analytics Toggle**
   - Click "Analytics" in header → Panel appears
   - Charts render with data
   - Close button hides panel

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Export to PDF reports
- [ ] Advanced filtering (date range, CO₂ range)
- [ ] User management interface
- [ ] Audit log viewer
- [ ] Bulk project actions
- [ ] Email notifications
- [ ] Custom IPFS pinning service integration

## Support

For issues or questions:
- Check console for error logs
- Verify admin role in user object
- Ensure backend admin routes are registered
- Confirm IPFS gateway is accessible

---

**Built with ❤️ for Blue Carbon Registry**
