# 🚀 Pinata Setup - 5 Minute Guide

## Step 1: Get API Keys (2 min)

1. Go to: **https://app.pinata.cloud/**
2. Sign up (free account)
3. Navigate to: **API Keys** → **New Key**
4. Enable permissions:
   - ✅ pinFileToIPFS
   - ✅ pinJSONToIPFS
5. Name: `BlueCarbon-Registry`
6. Click **Generate Key**
7. **Copy both keys immediately!** ⚠️

## Step 2: Add to Backend (1 min)

Open `backend/.env` and update:

```env
PINATA_API_KEY=paste_your_api_key_here
PINATA_SECRET_KEY=paste_your_secret_key_here
```

**Example:**
```env
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
PINATA_SECRET_KEY=1234567890abcdefghijklmnopqrstuvwxyz
```

## Step 3: Restart Backend (30 sec)

```bash
# Stop current server (Ctrl+C)
cd backend
npm start
```

Look for: `🔗 IPFS: Pinata Connected` ✅

## Step 4: Test (1 min)

```bash
cd backend
node test-ipfs-sync.js
```

Should show:
```
✅ Pinata API keys configured
✅ Registry snapshot created: QmXxxx...
🎉 All tests passed!
```

## Step 5: Verify (30 sec)

1. Go to: **https://app.pinata.cloud/pinmanager**
2. You should see your uploaded files!

---

## Troubleshooting

### Still shows "Local Fallback"?
- Check keys have no spaces
- Restart backend server
- Run test script

### "401 Unauthorized"?
- Keys copied incorrectly
- Generate new keys
- Update `.env`

### "403 Forbidden"?
- Missing permissions
- Create new key with pinFileToIPFS + pinJSONToIPFS

---

## What You Get

✅ Real IPFS storage (not mock hashes)
✅ Permanent data pinning
✅ Fast IPFS gateway access
✅ 1 GB free storage
✅ Unlimited bandwidth

---

## Quick Links

- **Pinata Dashboard**: https://app.pinata.cloud/
- **API Keys**: https://app.pinata.cloud/developers/api-keys
- **Pin Manager**: https://app.pinata.cloud/pinmanager
- **Documentation**: https://docs.pinata.cloud/

---

**Need detailed help?** See `PINATA_SETUP_GUIDE.md`
