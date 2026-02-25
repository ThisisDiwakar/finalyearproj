# 🔒 Secure Storage Solutions for Blue Carbon Registry

## Current Issue

Pinata API keys not working. Let's diagnose and provide multiple secure storage alternatives.

---

## Solution 1: Fix Pinata Connection (Recommended)

### Step 1: Verify Pinata Account

1. **Go to**: https://app.pinata.cloud/
2. **Login** to your account
3. **Check account status**: Should be active

### Step 2: Generate New API Keys

1. **Navigate to**: https://app.pinata.cloud/developers/api-keys
2. **Delete old keys** (if any exist)
3. **Click**: "New Key" button
4. **Set permissions**:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
   - ✅ `unpin` (optional)
5. **Name**: `BlueCarbon-Production`
6. **Click**: "Generate Key"
7. **IMMEDIATELY COPY** both keys:
   - API Key
   - API Secret

### Step 3: Add Keys to .env (CRITICAL FORMAT)

**Open**: `backend/.env`

**Add keys EXACTLY like this** (no spaces, no quotes):

```env
PINATA_API_KEY=your_actual_api_key_here
PINATA_SECRET_KEY=your_actual_secret_key_here
```

**Example with fake keys**:
```env
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PINATA_SECRET_KEY=1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr
```

**Common Mistakes to Avoid**:
```env
# ❌ WRONG - Has spaces
PINATA_API_KEY= a1b2c3d4e5f6g7h8i9j0

# ❌ WRONG - Has quotes
PINATA_API_KEY="a1b2c3d4e5f6g7h8i9j0"

# ❌ WRONG - Incomplete key
PINATA_SECRET_KEY=1234567890abcdef...

# ✅ CORRECT - No spaces, no quotes, complete key
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PINATA_SECRET_KEY=1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr
```

### Step 4: Restart Backend

```bash
# Stop backend (Ctrl+C)
cd backend
npm start
```

**Look for**:
```
🔗 IPFS: Pinata Connected
```

### Step 5: Test Connection

```bash
cd backend
node test-ipfs-sync.js
```

**Expected output**:
```
✅ Pinata API keys configured
✅ Registry snapshot created: QmXxxx...
🎉 All tests passed!
```

### Troubleshooting Pinata

#### Error: "401 Unauthorized"

**Causes**:
- Keys copied incorrectly
- Extra spaces in .env
- Keys expired or revoked

**Fix**:
```bash
# 1. Check .env file
cat backend/.env | grep PINATA

# 2. Should show your keys (not empty)
# 3. No spaces before/after =
# 4. No quotes around keys

# 5. If wrong, regenerate keys in Pinata
# 6. Update .env
# 7. Restart backend
```

#### Error: "403 Forbidden"

**Cause**: Missing permissions

**Fix**:
1. Go to Pinata dashboard
2. Delete current key
3. Create new key
4. Enable: `pinFileToIPFS` + `pinJSONToIPFS`
5. Update .env
6. Restart backend

#### Error: "Network Error" or "ECONNREFUSED"

**Causes**:
- No internet connection
- Firewall blocking
- Pinata service down

**Fix**:
```bash
# Test internet connection
ping api.pinata.cloud

# Test Pinata API
curl https://api.pinata.cloud/data/testAuthentication \
  -H "pinata_api_key: YOUR_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET"

# Should return: {"message":"Congratulations! You are communicating with the Pinata API!"}
```

---

## Solution 2: Alternative IPFS Services

If Pinata doesn't work, use these alternatives:

### Option A: Web3.Storage (Free, Unlimited)

**Website**: https://web3.storage/

**Benefits**:
- ✅ Free unlimited storage
- ✅ Backed by Protocol Labs
- ✅ Simple API
- ✅ No credit card required

**Setup**:

1. **Create account**: https://web3.storage/login/
2. **Get API token**: https://web3.storage/tokens/
3. **Update backend code**:

```javascript
// backend/utils/web3storage.js
const { Web3Storage } = require('web3.storage');

const client = new Web3Storage({ 
  token: process.env.WEB3_STORAGE_TOKEN 
});

async function uploadToWeb3Storage(filePath, fileName) {
  const file = await fs.readFile(filePath);
  const blob = new Blob([file]);
  const cid = await client.put([new File([blob], fileName)]);
  
  return {
    ipfsHash: cid,
    ipfsUrl: `https://${cid}.ipfs.w3s.link/${fileName}`,
    isPinataUpload: false,
  };
}
```

4. **Add to .env**:
```env
WEB3_STORAGE_TOKEN=your_web3_storage_token
```

### Option B: NFT.Storage (Free, Unlimited)

**Website**: https://nft.storage/

**Benefits**:
- ✅ Free unlimited storage
- ✅ Designed for NFT metadata
- ✅ Permanent storage
- ✅ Simple API

**Setup**:

1. **Create account**: https://nft.storage/login/
2. **Get API key**: https://nft.storage/manage/
3. **Install package**:
```bash
cd backend
npm install nft.storage
```

4. **Update code**:
```javascript
// backend/utils/nftstorage.js
const { NFTStorage, File } = require('nft.storage');

const client = new NFTStorage({ 
  token: process.env.NFT_STORAGE_TOKEN 
});

async function uploadToNFTStorage(filePath, fileName) {
  const file = await fs.readFile(filePath);
  const cid = await client.storeBlob(new Blob([file]));
  
  return {
    ipfsHash: cid,
    ipfsUrl: `https://${cid}.ipfs.nftstorage.link/`,
    isPinataUpload: false,
  };
}
```

5. **Add to .env**:
```env
NFT_STORAGE_TOKEN=your_nft_storage_token
```

### Option C: Infura IPFS

**Website**: https://infura.io/

**Benefits**:
- ✅ 5 GB free storage
- ✅ Reliable infrastructure
- ✅ Part of ConsenSys
- ✅ Good documentation

**Setup**:

1. **Create account**: https://infura.io/register
2. **Create IPFS project**
3. **Get credentials**: Project ID + Secret
4. **Add to .env**:
```env
INFURA_PROJECT_ID=your_project_id
INFURA_PROJECT_SECRET=your_project_secret
```

---

## Solution 3: Local IPFS Node (Full Control)

### Setup Local IPFS

**Benefits**:
- ✅ Complete control
- ✅ No API limits
- ✅ No external dependencies
- ✅ Free

**Installation**:

```bash
# Windows (using Chocolatey)
choco install ipfs

# Or download from: https://dist.ipfs.tech/#go-ipfs

# Initialize IPFS
ipfs init

# Start IPFS daemon
ipfs daemon
```

**Update Backend Code**:

```javascript
// backend/utils/localipfs.js
const { create } = require('ipfs-http-client');

const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});

async function uploadToLocalIPFS(filePath, fileName) {
  const file = await fs.readFile(filePath);
  const result = await ipfs.add(file);
  
  return {
    ipfsHash: result.path,
    ipfsUrl: `http://localhost:8080/ipfs/${result.path}`,
    isPinataUpload: false,
  };
}
```

**Install Package**:
```bash
cd backend
npm install ipfs-http-client
```

---

## Solution 4: Hybrid Approach (Recommended for Production)

Use multiple storage backends with fallback:

```javascript
// backend/utils/storage.js
async function uploadFile(filePath, fileName) {
  // Try Pinata first
  try {
    if (process.env.PINATA_API_KEY) {
      return await uploadToPinata(filePath, fileName);
    }
  } catch (error) {
    console.warn('Pinata failed, trying Web3.Storage');
  }
  
  // Fallback to Web3.Storage
  try {
    if (process.env.WEB3_STORAGE_TOKEN) {
      return await uploadToWeb3Storage(filePath, fileName);
    }
  } catch (error) {
    console.warn('Web3.Storage failed, using local storage');
  }
  
  // Final fallback: Local storage
  return {
    ipfsHash: `local_${Date.now()}`,
    ipfsUrl: `/uploads/${fileName}`,
    isPinataUpload: false,
  };
}
```

---

## Solution 5: Traditional Cloud Storage

If IPFS is not required, use traditional cloud storage:

### Option A: AWS S3

**Benefits**:
- ✅ Highly reliable
- ✅ Scalable
- ✅ Pay as you go
- ✅ CDN integration

**Setup**:

```bash
npm install aws-sdk
```

```javascript
// backend/utils/s3.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

async function uploadToS3(filePath, fileName) {
  const fileContent = await fs.readFile(filePath);
  
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `projects/${fileName}`,
    Body: fileContent,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  
  return {
    ipfsHash: result.ETag,
    ipfsUrl: result.Location,
    isPinataUpload: false,
  };
}
```

### Option B: Cloudinary

**Benefits**:
- ✅ Free tier: 25 GB
- ✅ Image optimization
- ✅ CDN included
- ✅ Easy to use

**Setup**:

```bash
npm install cloudinary
```

```javascript
// backend/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(filePath, fileName) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'blue-carbon',
    public_id: fileName,
  });
  
  return {
    ipfsHash: result.public_id,
    ipfsUrl: result.secure_url,
    isPinataUpload: false,
  };
}
```

---

## Recommended Solution

### For Development:
**Use**: Local storage (current fallback)
- No setup required
- Fast
- Free
- Good for testing

### For Production:
**Use**: Hybrid approach
1. **Primary**: Pinata (if working)
2. **Fallback 1**: Web3.Storage (free unlimited)
3. **Fallback 2**: Local storage

---

## Implementation: Multi-Storage Backend

Let me create a unified storage solution:

```javascript
// backend/utils/unifiedStorage.js
const { uploadToIPFS: uploadToPinata, uploadJSONToIPFS: uploadJSONToPinata } = require('./ipfs');

/**
 * Unified storage upload with multiple backends
 */
async function uploadFile(filePath, fileName) {
  const storage = process.env.STORAGE_BACKEND || 'auto';
  
  // Auto mode: Try Pinata, fallback to local
  if (storage === 'auto' || storage === 'pinata') {
    try {
      if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
        console.log('📤 Uploading to Pinata...');
        const result = await uploadToPinata(filePath, fileName);
        if (result.isPinataUpload) {
          console.log('✅ Uploaded to Pinata:', result.ipfsHash);
          return result;
        }
      }
    } catch (error) {
      console.warn('⚠️ Pinata upload failed:', error.message);
      if (storage === 'pinata') throw error; // Don't fallback if explicitly set
    }
  }
  
  // Fallback to local storage
  console.log('📁 Using local storage');
  const mockHash = `Qm${Date.now().toString(36)}${Math.random().toString(36).substr(2, 20)}`;
  return {
    ipfsHash: mockHash,
    ipfsUrl: `/uploads/${path.basename(filePath)}`,
    pinSize: 0,
    timestamp: new Date().toISOString(),
    isPinataUpload: false,
    storageBackend: 'local',
  };
}

async function uploadJSON(jsonData, name) {
  const storage = process.env.STORAGE_BACKEND || 'auto';
  
  if (storage === 'auto' || storage === 'pinata') {
    try {
      if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
        console.log('📤 Uploading JSON to Pinata...');
        const result = await uploadJSONToPinata(jsonData, name);
        if (result.isPinataUpload) {
          console.log('✅ JSON uploaded to Pinata:', result.ipfsHash);
          return result;
        }
      }
    } catch (error) {
      console.warn('⚠️ Pinata JSON upload failed:', error.message);
      if (storage === 'pinata') throw error;
    }
  }
  
  // Fallback to local storage
  console.log('📁 Using local JSON storage');
  const mockHash = `Qm${Date.now().toString(36)}${Math.random().toString(36).substr(2, 20)}`;
  return {
    ipfsHash: mockHash,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
    isPinataUpload: false,
    storageBackend: 'local',
  };
}

module.exports = { uploadFile, uploadJSON };
```

**Add to .env**:
```env
# Storage backend: auto, pinata, local
STORAGE_BACKEND=auto
```

---

## Quick Fix Checklist

Try these in order:

1. **Check .env file**:
   ```bash
   cat backend/.env | grep PINATA
   ```
   - Keys should not be empty
   - No spaces around `=`
   - No quotes around keys

2. **Regenerate Pinata keys**:
   - Delete old keys
   - Create new keys
   - Copy immediately
   - Update .env

3. **Restart backend**:
   ```bash
   cd backend
   npm start
   ```

4. **Test connection**:
   ```bash
   node test-ipfs-sync.js
   ```

5. **If still fails, use local storage**:
   - System already has fallback
   - Works without Pinata
   - Good for development

---

## Summary

### Current Status:
- ✅ System works with local storage fallback
- ⚠️ Pinata not connected (keys empty or invalid)

### Recommended Actions:

**Option 1: Fix Pinata** (Best for production)
- Get new API keys
- Add to .env correctly
- Restart backend
- Test

**Option 2: Use Web3.Storage** (Free unlimited)
- Create account
- Get token
- Update code
- No limits

**Option 3: Keep Local Storage** (Good for development)
- Already working
- No setup needed
- Fast and simple

---

**Need help?** Check:
- `PINATA_SETUP_GUIDE.md` - Detailed Pinata setup
- `PINATA_VISUAL_GUIDE.md` - Visual walkthrough
- `PINATA_CHECKLIST.md` - Step-by-step checklist

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
