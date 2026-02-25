# 🔑 Pinata API Keys Setup Guide

## What is Pinata?

Pinata is a pinning service for IPFS (InterPlanetary File System). It provides:
- Permanent storage for your data on IPFS
- Fast, reliable IPFS gateways
- Easy-to-use API for uploading files and JSON
- Free tier with generous limits

## Step-by-Step Setup

### Step 1: Create Pinata Account (2 minutes)

1. Go to **https://app.pinata.cloud/**
2. Click **"Sign Up"** (top right)
3. Choose sign-up method:
   - Email + Password
   - Or sign in with Google/GitHub
4. Verify your email address
5. Complete the onboarding

**Free Tier Includes:**
- 1 GB storage
- Unlimited pins
- Unlimited bandwidth
- Perfect for development and small projects

### Step 2: Generate API Keys (2 minutes)

1. **Login to Pinata Dashboard**
   - Go to https://app.pinata.cloud/

2. **Navigate to API Keys**
   - Click on your profile (top right)
   - Select **"API Keys"** from the menu
   - Or go directly to: https://app.pinata.cloud/developers/api-keys

3. **Create New Key**
   - Click **"New Key"** button (top right)

4. **Configure Permissions**
   - Enable these permissions:
     - ✅ **pinFileToIPFS** (required for photo uploads)
     - ✅ **pinJSONToIPFS** (required for registry snapshots)
     - ✅ **unpin** (optional - for removing old pins)
   - Leave other permissions unchecked for security

5. **Name Your Key**
   - Key Name: `BlueCarbon-Registry-Dev`
   - Or any name you prefer

6. **Generate Key**
   - Click **"Generate Key"** button
   - ⚠️ **IMPORTANT**: Copy both keys immediately!
     - **API Key**: Starts with letters/numbers
     - **API Secret**: Long string of characters
   - You won't be able to see the secret again!

7. **Save Keys Securely**
   - Copy to a password manager
   - Or save to a secure note
   - Never commit these to git!

### Step 3: Add Keys to Backend (1 minute)

1. **Open your backend `.env` file**
   ```bash
   # Location: backend/.env
   ```

2. **Update the Pinata variables**
   ```env
   # Replace these placeholder values with your actual keys
   PINATA_API_KEY=your_actual_api_key_here
   PINATA_SECRET_KEY=your_actual_secret_key_here
   ```

3. **Example (with fake keys)**
   ```env
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/blue-carbon-registry
   
   # JWT Secret
   JWT_SECRET=blue_carbon_dev_secret_key_2024_change_this_in_production
   
   # Server Port
   PORT=5000
   
   # Pinata IPFS API Keys
   PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
   PINATA_SECRET_KEY=1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Save the file**
   - Press `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)

### Step 4: Restart Backend Server (30 seconds)

1. **Stop the current backend server**
   - Press `Ctrl+C` in the terminal running the backend

2. **Start the backend again**
   ```bash
   cd backend
   npm start
   ```

3. **Verify Pinata is connected**
   - Look for this in the startup message:
   ```
   ╔══════════════════════════════════════════════════╗
   ║  🌊 Blue Carbon Registry API Server             ║
   ║  📡 Running on: http://localhost:5000           ║
   ║  📦 MongoDB: Connected ✅                        ║
   ║  🔗 IPFS: Pinata Connected                      ║  ← Should say "Pinata Connected"
   ╚══════════════════════════════════════════════════╝
   ```

### Step 5: Test Pinata Integration (1 minute)

Run the test script to verify everything works:

```bash
cd backend
node test-ipfs-sync.js
```

**Expected Output:**
```
🧪 Testing IPFS Sync Functionality

📦 Connecting to MongoDB...
✅ MongoDB connected

🔑 Checking Pinata configuration...
✅ Pinata API keys configured          ← Should say "configured" not "fallback"

📸 Creating registry snapshot...
✅ Registry snapshot created: QmXxxx...
✅ Snapshot hash saved
✅ Snapshot created successfully!

📊 Snapshot Details:
   IPFS Hash: QmXxxx...                ← Real IPFS hash (starts with Qm)
   IPFS URL: https://gateway.pinata.cloud/ipfs/QmXxxx...
   ...

🎉 All tests passed!
```

### Step 6: Verify on Pinata Dashboard (Optional)

1. Go to **https://app.pinata.cloud/pinmanager**
2. You should see your uploaded files:
   - Registry snapshots (JSON files)
   - Project photos (if any uploaded)
3. Each pin shows:
   - CID (IPFS hash)
   - Name (e.g., "BlueCarbon-Registry-2024-...")
   - Size
   - Date pinned

## Troubleshooting

### Issue: "Pinata API keys not configured"

**Cause**: Keys are empty or still have placeholder values

**Solution**:
1. Check `backend/.env` file
2. Ensure keys don't contain:
   - `your_pinata_api_key`
   - `your_pinata_secret_key`
   - Empty values
3. Restart backend server

### Issue: "IPFS upload failed: 401 Unauthorized"

**Cause**: Invalid API keys

**Solution**:
1. Verify keys are copied correctly (no extra spaces)
2. Check key permissions in Pinata dashboard
3. Generate new keys if needed
4. Update `.env` and restart server

### Issue: "IPFS upload failed: 403 Forbidden"

**Cause**: API key doesn't have required permissions

**Solution**:
1. Go to Pinata API Keys page
2. Delete old key
3. Create new key with these permissions:
   - ✅ pinFileToIPFS
   - ✅ pinJSONToIPFS
4. Update `.env` with new keys

### Issue: "Rate limit exceeded"

**Cause**: Too many requests to Pinata API

**Solution**:
- Free tier limits: 100 requests/minute
- Wait a minute and try again
- Consider upgrading Pinata plan for production

### Issue: Backend still shows "Local Fallback"

**Cause**: Server not restarted after adding keys

**Solution**:
1. Stop backend server (`Ctrl+C`)
2. Start again: `npm start`
3. Check startup message for "Pinata Connected"

## Verifying Real IPFS Upload

### Test with a Project Submission

1. **Start both servers**
   ```bash
   # Terminal 1
   cd backend
   npm start
   
   # Terminal 2
   cd frontend
   npm run dev
   ```

2. **Submit a test project**
   - Login as a user
   - Go to "Submit Project"
   - Fill in details and upload a photo
   - Submit

3. **Check backend logs**
   ```
   🔄 Auto-syncing new project to IPFS...
   ✅ Registry snapshot created: QmXxxx...
   ✅ Snapshot hash saved
   ```

4. **Verify on Pinata**
   - Go to https://app.pinata.cloud/pinmanager
   - You should see new pins:
     - Project photo (if uploaded)
     - Registry snapshot (JSON)

5. **Access via IPFS Gateway**
   - Copy the IPFS hash from logs
   - Visit: `https://gateway.pinata.cloud/ipfs/QmXxxx...`
   - You should see the JSON data

## Security Best Practices

### ✅ DO:
- Store keys in `.env` file only
- Add `.env` to `.gitignore`
- Use different keys for dev/staging/production
- Rotate keys periodically
- Use minimal required permissions

### ❌ DON'T:
- Commit keys to git
- Share keys publicly
- Use production keys in development
- Give unnecessary permissions
- Store keys in frontend code

## Production Deployment

### Environment Variables

When deploying to production (Heroku, Railway, Vercel, etc.):

1. **Set environment variables in hosting platform**
   - Don't use `.env` file in production
   - Use platform's environment variable settings

2. **Example for Heroku**
   ```bash
   heroku config:set PINATA_API_KEY=your_key
   heroku config:set PINATA_SECRET_KEY=your_secret
   ```

3. **Example for Vercel/Netlify**
   - Go to project settings
   - Add environment variables
   - Redeploy

### Separate Keys for Production

1. Create a new API key in Pinata for production
2. Name it: `BlueCarbon-Registry-Production`
3. Use different keys than development
4. Monitor usage in Pinata dashboard

## Pinata Dashboard Features

### Pin Manager
- View all pinned files
- Search by name or CID
- Delete old pins to free space
- Download files

### Analytics
- Track bandwidth usage
- Monitor request counts
- View storage usage

### Billing
- Check current plan limits
- Upgrade if needed
- View usage history

## Cost Considerations

### Free Tier (Perfect for Development)
- 1 GB storage
- Unlimited pins
- Unlimited bandwidth
- 100 requests/minute

### Paid Plans (For Production)
- **Picnic**: $20/month - 100 GB storage
- **Submarine**: $100/month - 1 TB storage
- **Custom**: Enterprise pricing

### Optimization Tips
- Delete old snapshots periodically
- Compress images before upload
- Use efficient JSON structures
- Monitor usage in dashboard

## Alternative IPFS Services

If you prefer alternatives to Pinata:

1. **Web3.Storage** (https://web3.storage/)
   - Free 5 GB storage
   - Backed by Protocol Labs

2. **NFT.Storage** (https://nft.storage/)
   - Free unlimited storage
   - Designed for NFT metadata

3. **Infura IPFS** (https://infura.io/)
   - 5 GB free storage
   - Part of Infura suite

4. **Self-hosted IPFS Node**
   - Complete control
   - Requires server maintenance

## Support

### Pinata Support
- Documentation: https://docs.pinata.cloud/
- Discord: https://discord.gg/pinata
- Email: team@pinata.cloud

### Project Support
- Check `IPFS_INTEGRATION_GUIDE.md`
- Run test script: `node backend/test-ipfs-sync.js`
- Check backend logs for errors

---

## Quick Reference

### Get API Keys
1. https://app.pinata.cloud/developers/api-keys
2. Click "New Key"
3. Enable: pinFileToIPFS, pinJSONToIPFS
4. Copy both keys immediately

### Add to Backend
```env
# backend/.env
PINATA_API_KEY=your_actual_key
PINATA_SECRET_KEY=your_actual_secret
```

### Restart Server
```bash
cd backend
npm start
```

### Test
```bash
node test-ipfs-sync.js
```

### Verify
- Check startup message: "Pinata Connected"
- View pins: https://app.pinata.cloud/pinmanager

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
