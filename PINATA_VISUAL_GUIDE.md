# 🎨 Pinata Setup - Visual Guide

## Step-by-Step with Screenshots

### Step 1: Get to Pinata API Keys Page

```
1. Open browser
2. Go to: https://app.pinata.cloud/
3. Login or Sign Up
4. Click your profile icon (top right corner)
5. Select "API Keys" from dropdown
```

**Or go directly to:**
```
https://app.pinata.cloud/developers/api-keys
```

---

### Step 2: Create New API Key

```
┌─────────────────────────────────────────────────┐
│  API Keys                          [+ New Key]  │ ← Click this button
├─────────────────────────────────────────────────┤
│  No API keys yet                                │
│  Create your first API key to get started       │
└─────────────────────────────────────────────────┘
```

---

### Step 3: Configure Permissions

```
┌─────────────────────────────────────────────────┐
│  Create API Key                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Key Name:                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ BlueCarbon-Registry-Dev                   │ │ ← Enter name
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Permissions:                                   │
│  ☐ Admin                                        │
│  ☑ pinFileToIPFS        ← Check this           │
│  ☑ pinJSONToIPFS        ← Check this           │
│  ☐ unpin                                        │
│  ☐ pinByHash                                    │
│  ☐ userPinnedDataTotal                          │
│                                                 │
│              [Cancel]  [Generate Key]           │ ← Click Generate
└─────────────────────────────────────────────────┘
```

---

### Step 4: Copy Your Keys

```
┌─────────────────────────────────────────────────┐
│  ⚠️  Save Your Keys Now!                        │
│  You won't be able to see them again            │
├─────────────────────────────────────────────────┤
│                                                 │
│  API Key:                                       │
│  ┌───────────────────────────────────────────┐ │
│  │ a1b2c3d4e5f6g7h8i9j0                      │ │ ← Copy this
│  └───────────────────────────────────────────┘ │
│                                      [Copy]     │
│                                                 │
│  API Secret:                                    │
│  ┌───────────────────────────────────────────┐ │
│  │ 1234567890abcdefghijklmnopqrstuvwxyz...   │ │ ← Copy this
│  └───────────────────────────────────────────┘ │
│                                      [Copy]     │
│                                                 │
│                              [Done]             │
└─────────────────────────────────────────────────┘
```

**⚠️ IMPORTANT**: Copy both keys before clicking "Done"!

---

### Step 5: Open Your Project

```
Your Project Folder:
├── backend/
│   ├── .env          ← Open this file
│   ├── .env.example
│   ├── server.js
│   └── ...
├── frontend/
└── ...
```

**Open in your code editor:**
```
File: backend/.env
```

---

### Step 6: Paste Keys in .env File

**BEFORE (with placeholders):**
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/blue-carbon-registry

# JWT Secret
JWT_SECRET=blue_carbon_dev_secret_key_2024_change_this_in_production

# Server Port
PORT=5000

# Pinata IPFS API Keys
PINATA_API_KEY=                    ← Empty
PINATA_SECRET_KEY=                 ← Empty

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**AFTER (with your keys):**
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/blue-carbon-registry

# JWT Secret
JWT_SECRET=blue_carbon_dev_secret_key_2024_change_this_in_production

# Server Port
PORT=5000

# Pinata IPFS API Keys
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0              ← Paste API Key here
PINATA_SECRET_KEY=1234567890abcdefghijklmnopqr... ← Paste Secret here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Rules:**
- ✅ No spaces before or after the `=`
- ✅ No quotes around the keys
- ✅ Paste the entire key
- ❌ Don't add extra lines
- ❌ Don't modify other variables

---

### Step 7: Save the File

```
Windows/Linux: Ctrl + S
Mac: Cmd + S
```

**Verify:**
- File saved indicator disappears
- No unsaved changes marker

---

### Step 8: Restart Backend Server

**In your terminal:**

```bash
# If server is running, stop it first
Press: Ctrl + C

# Navigate to backend folder
cd backend

# Start server again
npm start
```

**Wait for startup message:**
```
╔══════════════════════════════════════════════════╗
║  🌊 Blue Carbon Registry API Server             ║
║  📡 Running on: http://localhost:5000           ║
║  📦 MongoDB: Connected ✅                        ║
║  🔗 IPFS: Pinata Connected  ← Look for this!    ║
╚══════════════════════════════════════════════════╝
```

---

### Step 9: Run Test Script

**In terminal:**
```bash
# Make sure you're in backend folder
cd backend

# Run test
node test-ipfs-sync.js
```

**Expected output:**
```
🧪 Testing IPFS Sync Functionality

📦 Connecting to MongoDB...
✅ MongoDB connected

🔑 Checking Pinata configuration...
✅ Pinata API keys configured          ← Should say "configured"

📸 Creating registry snapshot...
✅ Registry snapshot created: QmXxxx...
✅ Snapshot hash saved
✅ Snapshot created successfully!

📊 Snapshot Details:
   IPFS Hash: QmXxxx...
   IPFS URL: https://gateway.pinata.cloud/ipfs/QmXxxx...
   Timestamp: 2024-02-24T10:30:00.000Z
   Total Projects: 1
   Pending: 0
   In Review: 1
   Approved: 0
   Rejected: 0

🔍 Verifying saved snapshot...
✅ Snapshot saved and retrieved successfully!
   File location: backend/data/latest-snapshot.json

🎉 All tests passed!                   ← Success!
```

---

### Step 10: Verify on Pinata Dashboard

**Go to:**
```
https://app.pinata.cloud/pinmanager
```

**You should see:**
```
┌─────────────────────────────────────────────────────────┐
│  Pin Manager                                            │
├─────────────────────────────────────────────────────────┤
│  Name                          CID           Size  Date │
│  ─────────────────────────────────────────────────────  │
│  BlueCarbon-Registry-2024...   QmXxxx...    2KB   Now  │ ← Your file!
└─────────────────────────────────────────────────────────┘
```

---

## Common Mistakes to Avoid

### ❌ Wrong: Extra spaces
```env
PINATA_API_KEY= a1b2c3d4e5f6g7h8i9j0    ← Space after =
PINATA_SECRET_KEY=1234567890abcdef      ← Space before key
```

### ✅ Correct: No spaces
```env
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
PINATA_SECRET_KEY=1234567890abcdef
```

---

### ❌ Wrong: Quotes around keys
```env
PINATA_API_KEY="a1b2c3d4e5f6g7h8i9j0"
PINATA_SECRET_KEY='1234567890abcdef'
```

### ✅ Correct: No quotes
```env
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
PINATA_SECRET_KEY=1234567890abcdef
```

---

### ❌ Wrong: Incomplete key
```env
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
PINATA_SECRET_KEY=1234567890abcdef...    ← Missing rest of key
```

### ✅ Correct: Complete key
```env
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
PINATA_SECRET_KEY=1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr
```

---

### ❌ Wrong: Forgot to restart server
```
Server still running with old config
Shows: "Local Fallback"
```

### ✅ Correct: Restart server
```bash
Ctrl + C  (stop)
npm start (restart)
Shows: "Pinata Connected"
```

---

## Verification Checklist

After setup, verify these:

```
✅ backend/.env file has both keys
✅ No spaces or quotes around keys
✅ File is saved
✅ Backend server restarted
✅ Startup shows "Pinata Connected"
✅ Test script passes
✅ Files appear in Pinata dashboard
✅ IPFS gateway URLs work
```

---

## Quick Troubleshooting

### Problem: Still shows "Local Fallback"

**Check:**
1. Keys pasted correctly in `.env`?
2. File saved?
3. Server restarted?
4. No typos in variable names?

**Fix:**
```bash
# 1. Check .env file
cat backend/.env | grep PINATA

# 2. Should show your keys (not empty)
# 3. Restart server
cd backend
npm start
```

---

### Problem: "401 Unauthorized"

**Check:**
1. Keys copied completely?
2. No extra characters?
3. Keys from correct Pinata account?

**Fix:**
1. Go back to Pinata
2. Delete old key
3. Create new key
4. Copy carefully
5. Paste in `.env`
6. Restart server

---

### Problem: "403 Forbidden"

**Check:**
1. Key has pinFileToIPFS permission?
2. Key has pinJSONToIPFS permission?

**Fix:**
1. Go to Pinata API Keys
2. Check key permissions
3. If missing, create new key
4. Enable both permissions
5. Update `.env`
6. Restart server

---

## Success Indicators

### ✅ You're done when you see:

1. **Backend startup:**
   ```
   🔗 IPFS: Pinata Connected
   ```

2. **Test script:**
   ```
   ✅ Pinata API keys configured
   🎉 All tests passed!
   ```

3. **Pinata dashboard:**
   ```
   Files uploaded and visible
   ```

4. **IPFS gateway:**
   ```
   https://gateway.pinata.cloud/ipfs/QmXxxx...
   JSON data loads successfully
   ```

---

## Need Help?

### Quick References:
- **5-min guide**: `PINATA_QUICK_START.md`
- **Detailed guide**: `PINATA_SETUP_GUIDE.md`
- **Checklist**: `PINATA_CHECKLIST.md`
- **Main README**: `README_PINATA.md`

### Support:
- **Pinata Docs**: https://docs.pinata.cloud/
- **Pinata Discord**: https://discord.gg/pinata
- **Project Issues**: Check backend console logs

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
