# 🔑 Add Your Pinata Keys - Step by Step

## You said you have the keys - let's add them now!

### Step 1: Open the .env file

**Windows**:
```bash
notepad backend\.env
```

**Or use your code editor**:
```bash
code backend\.env
```

### Step 2: Find these lines

```env
# Pinata IPFS API Keys (Optional - Get free keys at https://app.pinata.cloud/)
PINATA_API_KEY=
PINATA_SECRET_KEY=
```

### Step 3: Add your keys

**BEFORE** (empty):
```env
PINATA_API_KEY=
PINATA_SECRET_KEY=
```

**AFTER** (with your keys):
```env
PINATA_API_KEY=your_actual_api_key_here
PINATA_SECRET_KEY=your_actual_secret_key_here
```

### Step 4: CRITICAL - Format Rules

✅ **CORRECT FORMAT**:
```env
PINATA_API_KEY=abc123def456ghi789
PINATA_SECRET_KEY=xyz789uvw456rst123abc456def789ghi123jkl456mno789pqr123stu456vwx789
```

❌ **WRONG - Has spaces**:
```env
PINATA_API_KEY= abc123def456ghi789
PINATA_API_KEY=abc123def456ghi789 
```

❌ **WRONG - Has quotes**:
```env
PINATA_API_KEY="abc123def456ghi789"
PINATA_API_KEY='abc123def456ghi789'
```

❌ **WRONG - Line break in key**:
```env
PINATA_API_KEY=abc123def456
ghi789
```

### Step 5: Save the file

- Press `Ctrl+S` (Windows)
- Or `Cmd+S` (Mac)
- Close the editor

### Step 6: Verify the file

Run this command to check:
```bash
cd backend
type .env | findstr PINATA
```

**Should show**:
```
PINATA_API_KEY=your_actual_key...
PINATA_SECRET_KEY=your_actual_secret...
```

**Should NOT show**:
```
PINATA_API_KEY=
PINATA_SECRET_KEY=
```

### Step 7: Restart backend

```bash
# Stop backend (Ctrl+C in the terminal running it)

# Start backend
cd backend
npm start
```

**Look for this line**:
```
🔗 IPFS: Pinata Connected
```

**If you see**:
```
🔗 IPFS: Local Fallback
```
Then keys are still not loaded correctly.

### Step 8: Test connection

```bash
cd backend
node diagnose-pinata.js
```

**Should show**:
```
✅ PINATA_API_KEY is set
✅ PINATA_SECRET_KEY is set
✅ Authentication successful!
✅ Test upload successful!
```

---

## If You Don't Have Keys Yet

### Get Pinata Keys:

1. **Go to**: https://app.pinata.cloud/developers/api-keys

2. **Login** to your Pinata account

3. **Click**: "New Key" button

4. **Enable permissions**:
   - ✅ pinFileToIPFS
   - ✅ pinJSONToIPFS

5. **Name**: `BlueCarbon-Production`

6. **Click**: "Generate Key"

7. **IMMEDIATELY COPY**:
   - API Key (first box)
   - API Secret (second box)

8. **Paste into** `backend/.env`

---

## Example .env File

Here's what your complete `backend/.env` should look like:

```env
# MongoDB Connection - Local MongoDB
MONGO_URI=mongodb://localhost:27017/blue-carbon-registry

# JWT Secret - Generate a secure random string for production
JWT_SECRET=blue_carbon_dev_secret_key_2024_change_this_in_production

# Server Port
PORT=5000

# Pinata IPFS API Keys
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PINATA_SECRET_KEY=1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Note**: The keys above are fake examples. Use your actual keys from Pinata.

---

## Troubleshooting

### Issue: Keys still showing as empty

**Cause**: File not saved or wrong file edited

**Fix**:
1. Make sure you're editing `backend/.env` (not `.env.example`)
2. Save the file (Ctrl+S)
3. Check file was saved: `type backend\.env`
4. Restart backend

### Issue: Backend still shows "Local Fallback"

**Cause**: Keys have formatting issues

**Fix**:
1. Check for spaces: `type backend\.env | findstr PINATA`
2. Remove any spaces around `=`
3. Remove any quotes
4. Make sure key is on one line
5. Restart backend

### Issue: "401 Unauthorized" error

**Cause**: Invalid keys

**Fix**:
1. Go back to Pinata dashboard
2. Delete old keys
3. Create new keys
4. Copy immediately
5. Update .env
6. Restart backend

---

## Quick Commands

### Check if keys are set
```bash
cd backend
type .env | findstr PINATA
```

### Test Pinata connection
```bash
cd backend
node diagnose-pinata.js
```

### Restart backend
```bash
# In backend terminal, press Ctrl+C
npm start
```

---

## Need Help?

If you're still having issues:

1. **Share the output** of:
   ```bash
   cd backend
   type .env | findstr PINATA
   ```
   (Don't share the actual keys, just confirm they're there)

2. **Share the output** of:
   ```bash
   node diagnose-pinata.js
   ```

3. **Check** if backend shows:
   ```
   🔗 IPFS: Pinata Connected
   ```
   or
   ```
   🔗 IPFS: Local Fallback
   ```

---

**Last Updated**: February 24, 2026
