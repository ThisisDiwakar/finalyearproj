/**
 * Pinata Connection Diagnostic Tool
 * Run with: node diagnose-pinata.js
 */

require('dotenv').config();
const axios = require('axios');

async function diagnosePinata() {
  console.log('🔍 Pinata Connection Diagnostic Tool\n');
  console.log('═'.repeat(60));
  
  // Step 1: Check environment variables
  console.log('\n📋 Step 1: Checking Environment Variables');
  console.log('─'.repeat(60));
  
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;
  
  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ PINATA_API_KEY is empty or not set');
    console.log('   Fix: Add your Pinata API key to backend/.env');
    return false;
  } else if (apiKey === 'your_pinata_api_key') {
    console.log('❌ PINATA_API_KEY is still placeholder value');
    console.log('   Fix: Replace with actual API key from Pinata');
    return false;
  } else {
    console.log('✅ PINATA_API_KEY is set');
    console.log(`   Length: ${apiKey.length} characters`);
    console.log(`   Preview: ${apiKey.substring(0, 10)}...`);
  }
  
  if (!secretKey || secretKey.trim() === '') {
    console.log('❌ PINATA_SECRET_KEY is empty or not set');
    console.log('   Fix: Add your Pinata secret key to backend/.env');
    return false;
  } else if (secretKey === 'your_pinata_secret_key') {
    console.log('❌ PINATA_SECRET_KEY is still placeholder value');
    console.log('   Fix: Replace with actual secret key from Pinata');
    return false;
  } else {
    console.log('✅ PINATA_SECRET_KEY is set');
    console.log(`   Length: ${secretKey.length} characters`);
    console.log(`   Preview: ${secretKey.substring(0, 10)}...`);
  }
  
  // Step 2: Check for common formatting issues
  console.log('\n🔍 Step 2: Checking for Common Issues');
  console.log('─'.repeat(60));
  
  let hasIssues = false;
  
  if (apiKey.includes(' ')) {
    console.log('⚠️  API Key contains spaces');
    console.log('   Fix: Remove all spaces from the key');
    hasIssues = true;
  }
  
  if (secretKey.includes(' ')) {
    console.log('⚠️  Secret Key contains spaces');
    console.log('   Fix: Remove all spaces from the key');
    hasIssues = true;
  }
  
  if (apiKey.includes('"') || apiKey.includes("'")) {
    console.log('⚠️  API Key contains quotes');
    console.log('   Fix: Remove quotes around the key');
    hasIssues = true;
  }
  
  if (secretKey.includes('"') || secretKey.includes("'")) {
    console.log('⚠️  Secret Key contains quotes');
    console.log('   Fix: Remove quotes around the key');
    hasIssues = true;
  }
  
  if (!hasIssues) {
    console.log('✅ No formatting issues detected');
  }
  
  // Step 3: Test internet connectivity
  console.log('\n🌐 Step 3: Testing Internet Connectivity');
  console.log('─'.repeat(60));
  
  try {
    await axios.get('https://api.pinata.cloud', { timeout: 5000 });
    console.log('✅ Can reach Pinata API');
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      console.log('❌ Cannot reach Pinata API');
      console.log('   Possible causes:');
      console.log('   - No internet connection');
      console.log('   - DNS issues');
      console.log('   - Firewall blocking');
      return false;
    } else if (error.code === 'ETIMEDOUT') {
      console.log('❌ Connection timeout');
      console.log('   Possible causes:');
      console.log('   - Slow internet connection');
      console.log('   - Firewall blocking');
      return false;
    } else {
      console.log('✅ Can reach Pinata API (got response)');
    }
  }
  
  // Step 4: Test authentication
  console.log('\n🔐 Step 4: Testing Authentication');
  console.log('─'.repeat(60));
  
  try {
    const response = await axios.get(
      'https://api.pinata.cloud/data/testAuthentication',
      {
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
        timeout: 10000,
      }
    );
    
    if (response.data && response.data.message) {
      console.log('✅ Authentication successful!');
      console.log(`   Message: ${response.data.message}`);
      return true;
    }
  } catch (error) {
    console.log('❌ Authentication failed');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.error || error.response.statusText}`);
      
      if (error.response.status === 401) {
        console.log('\n   Possible causes:');
        console.log('   - Invalid API keys');
        console.log('   - Keys have been revoked');
        console.log('   - Keys copied incorrectly');
        console.log('\n   Solutions:');
        console.log('   1. Go to https://app.pinata.cloud/developers/api-keys');
        console.log('   2. Delete the current key');
        console.log('   3. Create a new key');
        console.log('   4. Copy both keys immediately');
        console.log('   5. Update backend/.env');
        console.log('   6. Restart backend server');
      } else if (error.response.status === 403) {
        console.log('\n   Possible causes:');
        console.log('   - API key missing required permissions');
        console.log('\n   Solutions:');
        console.log('   1. Go to https://app.pinata.cloud/developers/api-keys');
        console.log('   2. Create new key with these permissions:');
        console.log('      ✅ pinFileToIPFS');
        console.log('      ✅ pinJSONToIPFS');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.log('   Error: Request timeout');
      console.log('   Possible causes:');
      console.log('   - Slow internet connection');
      console.log('   - Pinata service issues');
    } else {
      console.log(`   Error: ${error.message}`);
    }
    
    return false;
  }
  
  // Step 5: Test file upload
  console.log('\n📤 Step 5: Testing File Upload');
  console.log('─'.repeat(60));
  
  try {
    const testData = {
      test: true,
      message: 'Blue Carbon Registry Test',
      timestamp: new Date().toISOString(),
    };
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: testData,
        pinataMetadata: {
          name: 'BlueCarbon-Test',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
        timeout: 30000,
      }
    );
    
    if (response.data && response.data.IpfsHash) {
      console.log('✅ Test upload successful!');
      console.log(`   IPFS Hash: ${response.data.IpfsHash}`);
      console.log(`   URL: https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
      console.log('\n   You can view this test file at the URL above');
      return true;
    }
  } catch (error) {
    console.log('❌ Test upload failed');
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Run diagnostic
diagnosePinata().then(success => {
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Diagnostic Summary');
  console.log('─'.repeat(60));
  
  if (success) {
    console.log('✅ Pinata connection is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test with: node test-ipfs-sync.js');
    console.log('3. Submit a project to test full flow');
  } else {
    console.log('❌ Pinata connection has issues');
    console.log('\nRecommended actions:');
    console.log('1. Review the errors above');
    console.log('2. Follow the suggested fixes');
    console.log('3. Run this diagnostic again');
    console.log('\nAlternatively:');
    console.log('- System works with local storage fallback');
    console.log('- See SECURE_STORAGE_SOLUTIONS.md for alternatives');
  }
  
  console.log('\n' + '═'.repeat(60));
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('\n❌ Diagnostic failed:', error.message);
  process.exit(1);
});
