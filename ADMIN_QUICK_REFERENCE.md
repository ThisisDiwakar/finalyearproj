# 🎯 Admin Dashboard - Quick Reference Card

## 🚀 Quick Start (3 Steps)

```bash
# 1. Setup environment
cd frontend && cp .env.example .env

# 2. Start servers
cd backend && npm start
cd frontend && npm run dev

# 3. Create admin user and login
# Register with role: "admin" at http://localhost:5173/register
```

## 🔑 Admin Credentials (Test)

```
Email: admin@test.gov.in
Password: admin123
Role: admin
```

## 📍 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/admin` | Admin only | Main dashboard |
| `/dashboard` | All users | Regular dashboard (admins redirected to `/admin`) |
| `/login` | Public | Login page |
| `/register` | Public | Registration with admin option |

## 🎨 Color Codes

```css
Primary:  #00E0B8  /* Teal */
Pending:  #FF4D4F  /* Red */
Review:   #FFC107  /* Amber */
Approved: #00C853  /* Green */
Rejected: #6C757D  /* Grey */
```

## 🔌 API Endpoints

```
GET    /api/admin/ipfs-hash                    # Get IPFS hash
GET    /api/admin/stats                        # Get statistics
POST   /api/admin/projects/:id/approve         # Approve project
POST   /api/admin/projects/:id/reject          # Reject project
POST   /api/admin/projects/:id/send-to-verifier # Send to verifier
```

## 📦 Components Tree

```
AdminDashboard
├── AdminHeader (sticky nav)
├── StatsCards (4 cards)
│   ├── ProjectsCard
│   ├── AreaCard
│   ├── CarbonCard
│   └── EarningsCard
├── QuickActions (action bar)
├── MapSection
│   ├── FiltersBar
│   ├── IndiaMap (Leaflet)
│   └── ProjectDrawer (slide-in)
├── ActivityFeed (timeline)
├── ProjectsTable (data grid)
└── AnalyticsPanel (toggle)
```

## 🎯 Key Features

| Feature | Status | Location |
|---------|--------|----------|
| Role-based access | ✅ | `App.jsx` AdminRoute |
| IPFS sync | ✅ | `ipfsService.js` |
| Interactive map | ✅ | `IndiaMap.jsx` |
| Project actions | ✅ | `ProjectDrawer.jsx` |
| Analytics | ✅ | `AnalyticsPanel.jsx` |
| Activity feed | ✅ | `ActivityFeed.jsx` |

## 🔧 Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
VITE_IPFS_ENABLED=false  # true for production

# Backend (.env)
MONGO_URI=mongodb://localhost:27017/blue-carbon
JWT_SECRET=your_secret_key
PORT=5000
```

## 🐛 Debugging Commands

```javascript
// Check user role
JSON.parse(localStorage.getItem('bcr_user')).role

// Check token
localStorage.getItem('bcr_token')

// Check IPFS config
import.meta.env.VITE_IPFS_ENABLED

// Clear auth
localStorage.clear()
```

## 📊 Mock Data Structure

```javascript
{
  totalProjects: 24,
  pendingProjects: 5,
  reviewProjects: 8,
  approvedProjects: 9,
  rejectedProjects: 2,
  totalArea: 156.75,
  monthlyAreaIncrease: 12.5,
  totalCarbon: 3420.5,
  equivalentCars: 743,
  totalEarnings: 2850000,
  statesCount: 8,
  projects: [...],
  activityFeed: [...]
}
```

## 🎬 User Flow

```
1. Admin registers with role="admin"
   ↓
2. Login with admin credentials
   ↓
3. Auto-redirect to /admin
   ↓
4. Dashboard loads (zero-state)
   ↓
5. Click "Refresh IPFS"
   ↓
6. Data syncs and populates
   ↓
7. Interact with map/table/analytics
   ↓
8. Approve/reject projects
```

## 🔒 Security Checklist

- [x] JWT authentication
- [x] Role-based authorization
- [x] Route guards (frontend)
- [x] Middleware (backend)
- [x] IPFS hash validation
- [x] Input sanitization
- [x] Error handling
- [x] Secure token storage

## 📱 Responsive Breakpoints

```css
Desktop:  > 1200px  (4-column grid)
Tablet:   768-1200px (2-column grid)
Mobile:   < 768px   (1-column stack)
```

## 🎨 Animation Timings

```css
Fade-in:     0.5s ease-out
Slide-in:    0.3s ease-out
Hover:       0.3s ease
Glow pulse:  2s infinite
```

## 🧪 Testing Scenarios

| Test | Expected Result |
|------|----------------|
| Login as admin | Redirect to `/admin` |
| Login as user | Stay on `/dashboard` |
| Access `/admin` as user | Redirect to `/dashboard` |
| Click "Refresh IPFS" | Toast + data updates |
| Click map pin | Drawer opens |
| Click "Approve" | Success toast |
| Toggle analytics | Panel appears |

## 📚 Documentation Files

```
ADMIN_DASHBOARD_README.md       # Complete feature docs
ADMIN_SETUP_GUIDE.md           # Step-by-step setup
ADMIN_IMPLEMENTATION_SUMMARY.md # Technical summary
ADMIN_QUICK_REFERENCE.md       # This file
```

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Can't access `/admin` | Check user role is "admin" |
| IPFS sync fails | Set `VITE_IPFS_ENABLED=false` |
| Map not loading | Import Leaflet CSS |
| 403 errors | Verify JWT token |
| Stats show 0 | Click "Refresh IPFS" |

## 🚀 Production Deployment

```bash
# 1. Update environment
VITE_IPFS_ENABLED=true
VITE_API_URL=https://api.production.com/api

# 2. Build frontend
cd frontend && npm run build

# 3. Deploy backend
cd backend && npm start

# 4. Configure CORS
# Update FRONTEND_URL in backend/.env

# 5. Test admin access
# Login and verify all features work
```

## 📞 Support

- **Setup Issues**: Check `ADMIN_SETUP_GUIDE.md`
- **Feature Docs**: Check `ADMIN_DASHBOARD_README.md`
- **Technical Details**: Check `ADMIN_IMPLEMENTATION_SUMMARY.md`
- **Quick Help**: This file

---

**Print this card for quick reference! 📋**
