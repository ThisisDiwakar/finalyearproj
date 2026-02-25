# ✅ Pinata Setup Checklist

Follow these steps in order:

## 🔐 Account Setup

- [ ] Go to https://app.pinata.cloud/
- [ ] Click "Sign Up"
- [ ] Create account (email or Google/GitHub)
- [ ] Verify email address
- [ ] Login to dashboard

## 🔑 Generate API Keys

- [ ] Click profile icon (top right)
- [ ] Select "API Keys"
- [ ] Click "New Key" button
- [ ] Enable permission: **pinFileToIPFS** ✅
- [ ] Enable permission: **pinJSONToIPFS** ✅
- [ ] Name key: `BlueCarbon-Registry-Dev`
- [ ] Click "Generate Key"
- [ ] **Copy API Key** (save it!)
- [ ] **Copy API Secret** (save it!)
- [ ] Store keys securely (password manager)

## 📝 Update Backend Configuration

- [ ] Open file: `backend/.env`
- [ ] Find line: `PINATA_API_KEY=`
- [ ] Paste your API key after the `=`
- [ ] Find line: `PINATA_SECRET_KEY=`
- [ ] Paste your secret key after the `=`
- [ ] Save file (`Ctrl+S` or `Cmd+S`)
- [ ] Verify no extra spaces or quotes

## 🔄 Restart Backend

- [ ] Open terminal in backend folder
- [ ] Stop current server (press `Ctrl+C`)
- [ ] Run: `npm start`
- [ ] Wait for server to start
- [ ] Look for: `🔗 IPFS: Pinata Connected`
- [ ] Verify no error messages

## 🧪 Test Integration

- [ ] Open new terminal
- [ ] Navigate to backend: `cd backend`
- [ ] Run test: `node test-ipfs-sync.js`
- [ ] Check output shows: `✅ Pinata API keys configured`
- [ ] Check output shows: `✅ Registry snapshot created`
- [ ] Check output shows: `🎉 All tests passed!`
- [ ] Note the IPFS hash (starts with `Qm`)

## ✅ Verify on Pinata

- [ ] Go to https://app.pinata.cloud/pinmanager
- [ ] Look for your uploaded file
- [ ] File name should contain: `BlueCarbon-Registry`
- [ ] Click on file to see details
- [ ] Copy CID (IPFS hash)
- [ ] Visit: `https://gateway.pinata.cloud/ipfs/[your-CID]`
- [ ] Verify JSON data loads

## 🎯 Test Full Flow

- [ ] Start backend: `cd backend && npm start`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Login as user
- [ ] Submit a test project
- [ ] Check backend logs for: `🔄 Auto-syncing...`
- [ ] Check backend logs for: `✅ Registry snapshot created`
- [ ] Login as admin
- [ ] Click "Refresh" button
- [ ] Verify data loads in dashboard
- [ ] Check Pinata dashboard for new pins

## 🔒 Security Check

- [ ] Verify `.env` is in `.gitignore`
- [ ] Never commit API keys to git
- [ ] Don't share keys publicly
- [ ] Use different keys for production
- [ ] Store keys in password manager

## 📊 Monitor Usage

- [ ] Go to Pinata dashboard
- [ ] Check "Pin Manager" for uploaded files
- [ ] Monitor storage usage (1 GB free)
- [ ] Check bandwidth usage
- [ ] Review request counts

---

## ✅ Success Criteria

You're done when:

1. ✅ Backend shows "Pinata Connected" on startup
2. ✅ Test script passes all checks
3. ✅ Files appear in Pinata dashboard
4. ✅ IPFS gateway URLs work
5. ✅ Admin dashboard loads data from IPFS
6. ✅ Auto-sync triggers after project submission

---

## 🆘 If Something Goes Wrong

### Backend still shows "Local Fallback"
1. Check `.env` file has correct keys
2. Restart backend server
3. Run test script again

### Test script fails
1. Verify MongoDB is running
2. Check API keys are correct
3. Check internet connection
4. Try generating new keys

### 401 Unauthorized error
1. Keys copied incorrectly (check for spaces)
2. Generate new keys in Pinata
3. Update `.env` file
4. Restart server

### 403 Forbidden error
1. API key missing permissions
2. Delete old key in Pinata
3. Create new key with correct permissions
4. Update `.env` file

### Files not appearing in Pinata
1. Check test script output for errors
2. Verify keys have pinFileToIPFS permission
3. Check Pinata account is active
4. Try manual upload in Pinata dashboard

---

## 📚 Documentation

- **Quick Start**: `PINATA_QUICK_START.md`
- **Detailed Guide**: `PINATA_SETUP_GUIDE.md`
- **IPFS Integration**: `IPFS_INTEGRATION_GUIDE.md`
- **Troubleshooting**: `SETUP_COMPLETE.md`

---

## 🎉 Completion

Once all checkboxes are ✅, you have:

- Real IPFS storage via Pinata
- Automatic data synchronization
- Permanent data pinning
- Fast gateway access
- Production-ready setup

**Congratulations! Your IPFS integration is complete!** 🌊

---

**Last Updated**: February 24, 2026
