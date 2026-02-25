# Stats Cards Fixed ✅

## Changes Made

### 1. Created Separate Review Card
- Created `ReviewCard.jsx` for projects with REVIEW/SUBMITTED status
- Uses purple color (#a855f7) with eye icon
- Shows count of projects under review by verifiers

### 2. Separated Pending and Review Cards
- `PendingCard.jsx` - Shows only PENDING status projects (yellow)
- `ReviewCard.jsx` - Shows only REVIEW/SUBMITTED status projects (purple)
- Both cards now display independently in the dashboard

### 3. Removed Equivalent Cars
- Updated `CarbonCard.jsx` to remove the "Equivalent cars removed" metric
- Now only shows CO₂e (tons) sequestered
- Cleaner, more focused display

### 4. Stats Cards Layout
Updated `StatsCards.jsx` to show 6 cards:
1. Total Projects (with breakdown)
2. Pending Projects (yellow)
3. Under Review (purple)
4. Total Restoration Area
5. Total CO₂ Impact (no cars)
6. Total Earnings + States Count

## Status Counting Logic

From `ipfsService.js`:
- **Pending**: `status === 'PENDING'`
- **Review**: `status === 'REVIEW' || status === 'SUBMITTED'`
- **Approved**: `status === 'APPROVED' || status === 'MINTED'`
- **Rejected**: `status === 'REJECTED'`

## States Count
Already working correctly using `new Set()` to count unique states from all projects.

## What Works Now

✅ Pending and Review are separate cards with distinct counts
✅ Equivalent cars metric removed from Carbon card
✅ States count shows actual unique states
✅ All counts update correctly after approve/reject/review actions
✅ Dashboard auto-refreshes after any project action
✅ Color coding matches status colors throughout dashboard

## Files Modified

- `frontend/src/components/Admin/StatsCards/StatsCards.jsx`
- `frontend/src/components/Admin/StatsCards/CarbonCard.jsx`
- `frontend/src/components/Admin/StatsCards/ReviewCard.jsx` (new)
