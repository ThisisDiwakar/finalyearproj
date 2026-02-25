# 🔧 Fix Pinata Connection - Quick Guide

## Run Diagnostic First

```bash
cd backend
node diagnose-pinata.js
```

This will tell you exactly what's wrong.

---

## Common Issues & Fixes

### Issue 1: Keys Are Empty

**Symptom**:
```
❌ PINATA_API_KEY is empty or not set
```

**Fix**:
1. Go to: https://app.pinata.cloud/developers/api-keys
2. Click "New Key"
3. Enable: `pinFileToIPFS` + `pinJSONToIPFS`
4. Click "Generate Key"
5. **IMMEDIATELY COPY** both keys
6. Open `backend/.env`
7. Paste keys:
   ```env
   PINATA_API_KEY=paste_your_key_here
   PINATA_SECRET_KEY=paste_your_secret_here
   ```
8. Save file
9. Restart backend

---

### Issue 2: Keys Have Spaces

**Symptom**:
```
⚠️  API Key contains spaces
```

**Fix**:
```env
# ❌ WRONG
PINATA_API_KEY= abc123def456

# ✅ CORRECT
PINATA_API_KEY=abc123def456
```

Remove ALL spaces from the keys.

---

### Issue 3: Keys Have Quotes

**Symptom**:
```
⚠️  API Key contains quotes
```

**Fix**:
```env
# ❌ WRONG
PINATA_API_KEY="abc123def456"
PINATA_API_KEY='abc123def456'

# ✅ CORRECT
PINATA_API_KEY=abc123def456
```

Remove ALL quotes from the keys.

---

### Issue 4: Authentication Failed (401)

**Symptom**:
```
❌ Authentication failed
Status: 401
```

**Fix**:
1. Keys are invalid or revoked
2. Go to Pinata dashboard
3. Delete old keys
4. Create NEW keys
5. Copy immediately
6. Update `.env`
7. Restart backend

---

### Issue 5: Missing Permissions (403)

**Symptom**:
```
❌ Authentication failed
Status: 403
```

**Fix**:
1. Go to: https://app.pinata.cloud/developers/api-keys
2. Delete current key
3. Create new key
4. **MUST enable**:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
5. Update `.env`
6. Restart backend

---

### Issue 6: No Internet / Firewall

**Symptom**:
```
❌ Cannot reach Pinata API
```

**Fix**:
1. Check internet connection
2. Test: `ping api.pinata.cloud`
3. Check firewall settings
4. Try different network
5. Contact IT if corporate network

---

## Step-by-Step Fix

### 1. Get Fresh Keys

```
1. Open: https://app.pinata.cloud/developers/api-keys
2. Delete any existing keys
3. Click "New Key"
4. Name: BlueCarbon-Production
5. Enable:
   ✅ pinFileToIPFS
   ✅ pinJSONToIPFS
6. Click "Generate Key"
7. COPY BOTH KEYS NOW!
```

### 2. Update .env File

```bash
# Open file
code backend/.env
# or
notepad backend/.env
```

**Add keys EXACTLY like this**:
```env
PINATA_API_KEY=your_actual_api_key_here
PINATA_SECRET_KEY=your_actual_secret_key_here
```

**Example** (with fake keys):
```env
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PINATA_SECRET_KEY=1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr
```

**Rules**:
- ❌ No spaces before/after `=`
- ❌ No quotes around keys
- ❌ No line breaks in keys
- ✅ Complete key on one line

### 3. Save and Restart

```bash
# Save .env file (Ctrl+S)

# Stop backend (Ctrl+C)

# Start backend
cd backend
npm start
```

**Look for**:
```
🔗 IPFS: Pinata Connected
```

### 4. Test Connection

```bash
cd backend
node diagnose-pinata.js
```

**Should see**:
```
✅ Authentication successful!
✅ Test upload successful!
✅ Pinata connection is working correctly!
```

### 5. Test Full Flow

```bash
node test-ipfs-sync.js
```

**Should see**:
```
✅ Pinata API keys configured
✅ Registry snapshot created: QmXxxx...
🎉 All tests passed!
```

---

## Still Not Working?

### Option A: Use Alternative Storage

See `SECURE_STORAGE_SOLUTIONS.md` for:
- Web3.Storage (free unlimited)
- NFT.Storage (free unlimited)
- Local storage (already working)

### Option B: Keep Local Storage

Your system already works with local storage:
- ✅ No setup needed
- ✅ Fast and reliable
- ✅ Good for development
- ✅ Projects save to MongoDB
- ✅ Admin dashboard works

**To use local storage**:
1. Leave Pinata keys empty in `.env`
2. System automatically uses fallback
3. Everything works normally

---

## Verify .env Format

Your `backend/.env` should look like this:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/blue-carbon-registry

# JWT Secret
JWT_SECRET=blue_carbon_dev_secret_key_2024_change_this_in_production

# Server Port
PORT=5000

# Pinata IPFS API Keys
PINATA_API_KEY=your_actual_api_key_here
PINATA_SECRET_KEY=your_actual_secret_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Check**:
- [ ] No spaces around `=`
- [ ] No quotes around values
- [ ] Keys are complete (not cut off)
- [ ] No placeholder text like "your_pinata_api_key"

---

## Test Commands

### Check .env File
```bash
cat backend/.env | grep PINATA
```

Should show your keys (not empty).

### Test Pinata API
```bash
curl https://api.pinata.cloud/data/testAuthentication \
  -H "pinata_api_key: YOUR_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET"
```

Should return success message.

### Run Diagnostic
```bash
cd backend
node diagnose-pinata.js
```

Shows exactly what's wrong.

---

## Summary

1. **Run diagnostic**: `node diagnose-pinata.js`
2. **Follow the errors** it shows
3. **Get fresh keys** from Pinata
4. **Update .env** correctly
5. **Restart backend**
6. **Test again**

**If still fails**: Use local storage (already working)

---

**Need more help?**
- `SECURE_STORAGE_SOLUTIONS.md` - All storage options
- `PINATA_SETUP_GUIDE.md` - Detailed Pinata guide
- `PINATA_VISUAL_GUIDE.md` - Visual walkthrough

---

**Last Updated**: February 24, 2026
