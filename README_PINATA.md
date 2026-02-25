# 🌊 Blue Carbon Registry - Pinata IPFS Setup

## Overview

This project uses **Pinata** for IPFS storage. Pinata provides permanent, decentralized storage for:
- Project photos uploaded by users
- Registry snapshots for admin dashboard
- Metadata and project details

## Why Pinata?

✅ **Easy to use** - Simple API integration
✅ **Reliable** - 99.9% uptime guarantee
✅ **Free tier** - 1 GB storage, unlimited bandwidth
✅ **Fast** - Global CDN for quick access
✅ **Secure** - Enterprise-grade infrastructure

## Quick Setup (5 Minutes)

### Option 1: Follow the Checklist
Open `PINATA_CHECKLIST.md` and check off each step.

### Option 2: Quick Commands

```bash
# 1. Get API keys from Pinata
# Visit: https://app.pinata.cloud/developers/api-keys

# 2. Add to backend/.env
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_KEY=your_secret_key_here

# 3. Restart backend
cd backend
npm start

# 4. Test
node test-ipfs-sync.js
```

## Documentation

Choose your learning style:

### 📋 **Checklist Format**
- **File**: `PINATA_CHECKLIST.md`
- **Best for**: Step-by-step setup
- **Time**: 10 minutes

### 🚀 **Quick Start**
- **File**: `PINATA_QUICK_START.md`
- **Best for**: Fast setup
- **Time**: 5 minutes

### 📖 **Detailed Guide**
- **File**: `PINATA_SETUP_GUIDE.md`
- **Best for**: Understanding everything
- **Time**: 15 minutes

### 🏗️ **Technical Details**
- **File**: `IPFS_INTEGRATION_GUIDE.md`
- **Best for**: Developers
- **Time**: 30 minutes

## Current Status

### Without Pinata Keys (Current)
```
🔗 IPFS: Local Fallback
```
- Uses mock IPFS hashes
- Data stored in MongoDB only
- Everything works normally
- Good for development

### With Pinata Keys (Recommended)
```
🔗 IPFS: Pinata Connected
```
- Real IPFS storage
- Permanent data pinning
- Decentralized access
- Production-ready

## How to Get Pinata Keys

### Step 1: Create Account
1. Go to https://app.pinata.cloud/
2. Sign up (free)
3. Verify email

### Step 2: Generate Keys
1. Go to: https://app.pinata.cloud/developers/api-keys
2. Click "New Key"
3. Enable:
   - ✅ pinFileToIPFS
   - ✅ pinJSONToIPFS
4. Name: `BlueCarbon-Registry`
5. Click "Generate Key"
6. **Copy both keys!**

### Step 3: Add to Project
Edit `backend/.env`:
```env
PINATA_API_KEY=paste_your_key_here
PINATA_SECRET_KEY=paste_your_secret_here
```

### Step 4: Restart
```bash
cd backend
npm start
```

## Verification

### Check Backend Startup
```
╔══════════════════════════════════════════════════╗
║  🌊 Blue Carbon Registry API Server             ║
║  📡 Running on: http://localhost:5000           ║
║  📦 MongoDB: Connected ✅                        ║
║  🔗 IPFS: Pinata Connected  ← Should say this   ║
╚══════════════════════════════════════════════════╝
```

### Run Test Script
```bash
cd backend
node test-ipfs-sync.js
```

Expected output:
```
✅ Pinata API keys configured
✅ Registry snapshot created: QmXxxx...
🎉 All tests passed!
```

### Check Pinata Dashboard
1. Go to https://app.pinata.cloud/pinmanager
2. You should see uploaded files
3. Click to view details

## What Gets Uploaded to IPFS?

### 1. Project Photos
- Uploaded when users submit projects
- Stored permanently on IPFS
- Accessible via gateway URL

### 2. Registry Snapshots
- Created automatically after project changes
- Contains all project data and statistics
- Used by admin dashboard

### 3. Metadata
- Project details
- Community information
- Carbon calculations

## IPFS Gateway URLs

All uploaded data is accessible via:
```
https://gateway.pinata.cloud/ipfs/[IPFS-HASH]
```

Example:
```
https://gateway.pinata.cloud/ipfs/QmXxxx...
```

## Free Tier Limits

Pinata free tier includes:
- **Storage**: 1 GB
- **Pins**: Unlimited
- **Bandwidth**: Unlimited
- **Requests**: 100/minute

Perfect for:
- Development
- Testing
- Small projects
- Proof of concept

## Upgrading (Optional)

For production with many users:

### Picnic Plan - $20/month
- 100 GB storage
- Dedicated gateway
- Priority support

### Submarine Plan - $100/month
- 1 TB storage
- Custom gateway domain
- Advanced analytics

## Troubleshooting

### Issue: Backend shows "Local Fallback"

**Solution**:
1. Check `backend/.env` has keys
2. Restart backend server
3. Run test script

### Issue: "401 Unauthorized"

**Solution**:
1. Verify keys are correct
2. No extra spaces in `.env`
3. Generate new keys if needed

### Issue: "403 Forbidden"

**Solution**:
1. Check key permissions
2. Must have pinFileToIPFS + pinJSONToIPFS
3. Create new key with correct permissions

### Issue: Files not in Pinata dashboard

**Solution**:
1. Run test script
2. Check for errors
3. Verify internet connection
4. Check Pinata account status

## Security

### ✅ DO:
- Store keys in `.env` only
- Add `.env` to `.gitignore`
- Use different keys for dev/prod
- Rotate keys periodically

### ❌ DON'T:
- Commit keys to git
- Share keys publicly
- Use prod keys in dev
- Store keys in frontend

## Alternative: Run Without Pinata

The system works perfectly without Pinata:

1. Leave keys empty in `.env`
2. System uses database fallback
3. All features work normally
4. Good for development

To switch back:
1. Remove keys from `.env`
2. Restart backend
3. System auto-detects and uses fallback

## Support Resources

### Pinata
- **Dashboard**: https://app.pinata.cloud/
- **Docs**: https://docs.pinata.cloud/
- **Discord**: https://discord.gg/pinata
- **Email**: team@pinata.cloud

### Project
- **Setup Guide**: `PINATA_SETUP_GUIDE.md`
- **Quick Start**: `PINATA_QUICK_START.md`
- **Checklist**: `PINATA_CHECKLIST.md`
- **IPFS Guide**: `IPFS_INTEGRATION_GUIDE.md`

## Quick Links

| Resource | URL |
|----------|-----|
| Pinata Dashboard | https://app.pinata.cloud/ |
| API Keys | https://app.pinata.cloud/developers/api-keys |
| Pin Manager | https://app.pinata.cloud/pinmanager |
| Documentation | https://docs.pinata.cloud/ |
| Gateway | https://gateway.pinata.cloud/ipfs/ |

## Next Steps

1. ✅ Get Pinata API keys
2. ✅ Add to `backend/.env`
3. ✅ Restart backend
4. ✅ Run test script
5. ✅ Verify in Pinata dashboard
6. ✅ Test with project submission
7. ✅ Check admin dashboard

## Summary

**Without Pinata**: System works with database fallback
**With Pinata**: Real IPFS storage, production-ready

**Recommendation**: Set up Pinata for production deployment

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0

**Ready to set up Pinata? Start with `PINATA_QUICK_START.md`!**
