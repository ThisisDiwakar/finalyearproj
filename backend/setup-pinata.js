/**
 * Interactive Pinata Setup Script
 * Run with: node setup-pinata.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupPinata() {
  console.log('🔑 Pinata API Keys Setup\n');
  console.log('═'.repeat(60));
  console.log('\nThis script will help you add Pinata API keys to your .env file.\n');
  
  // Check if .env exists
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('   Creating .env from .env.example...\n');
    
    const examplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log('✅ .env file created\n');
    } else {
      console.log('❌ .env.example not found either!');
      rl.close();
      return;
    }
  }
  
  // Read current .env
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check current keys
  const apiKeyMatch = envContent.match(/PINATA_API_KEY=(.*)/);
  const secretKeyMatch = envContent.match(/PINATA_SECRET_KEY=(.*)/);
  
  const currentApiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';
  const currentSecretKey = secretKeyMatch ? secretKeyMatch[1].trim() : '';
  
  if (currentApiKey && currentApiKey !== 'your_pinata_api_key') {
    console.log('ℹ️  Current API Key:', currentApiKey.substring(0, 10) + '...');
  } else {
    console.log('ℹ️  Current API Key: (empty)');
  }
  
  if (currentSecretKey && currentSecretKey !== 'your_pinata_secret_key') {
    console.log('ℹ️  Current Secret Key:', currentSecretKey.substring(0, 10) + '...\n');
  } else {
    console.log('ℹ️  Current Secret Key: (empty)\n');
  }
  
  // Ask if user wants to update
  const update = await question('Do you want to update Pinata keys? (yes/no): ');
  
  if (update.toLowerCase() !== 'yes' && update.toLowerCase() !== 'y') {
    console.log('\n✅ No changes made.');
    rl.close();
    return;
  }
  
  console.log('\n📝 Instructions:');
  console.log('1. Go to: https://app.pinata.cloud/developers/api-keys');
  console.log('2. Click "New Key"');
  console.log('3. Enable: pinFileToIPFS + pinJSONToIPFS');
  console.log('4. Click "Generate Key"');
  console.log('5. Copy both keys\n');
  
  // Get API Key
  const apiKey = await question('Enter your Pinata API Key: ');
  
  if (!apiKey || apiKey.trim() === '') {
    console.log('\n❌ API Key cannot be empty!');
    rl.close();
    return;
  }
  
  // Get Secret Key
  const secretKey = await question('Enter your Pinata Secret Key: ');
  
  if (!secretKey || secretKey.trim() === '') {
    console.log('\n❌ Secret Key cannot be empty!');
    rl.close();
    return;
  }
  
  // Validate keys (basic check)
  if (apiKey.includes(' ')) {
    console.log('\n⚠️  Warning: API Key contains spaces. This might cause issues.');
  }
  
  if (secretKey.includes(' ')) {
    console.log('\n⚠️  Warning: Secret Key contains spaces. This might cause issues.');
  }
  
  if (apiKey.includes('"') || apiKey.includes("'")) {
    console.log('\n⚠️  Warning: API Key contains quotes. Removing them...');
  }
  
  if (secretKey.includes('"') || secretKey.includes("'")) {
    console.log('\n⚠️  Warning: Secret Key contains quotes. Removing them...');
  }
  
  // Clean keys
  const cleanApiKey = apiKey.trim().replace(/['"]/g, '');
  const cleanSecretKey = secretKey.trim().replace(/['"]/g, '');
  
  // Update .env content
  if (apiKeyMatch) {
    envContent = envContent.replace(/PINATA_API_KEY=.*/, `PINATA_API_KEY=${cleanApiKey}`);
  } else {
    envContent += `\nPINATA_API_KEY=${cleanApiKey}`;
  }
  
  if (secretKeyMatch) {
    envContent = envContent.replace(/PINATA_SECRET_KEY=.*/, `PINATA_SECRET_KEY=${cleanSecretKey}`);
  } else {
    envContent += `\nPINATA_SECRET_KEY=${cleanSecretKey}`;
  }
  
  // Save .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Pinata keys saved to .env file!');
  console.log('\n📋 Summary:');
  console.log('   API Key:', cleanApiKey.substring(0, 10) + '...');
  console.log('   Secret Key:', cleanSecretKey.substring(0, 10) + '...');
  
  console.log('\n🔄 Next steps:');
  console.log('1. Restart your backend server (Ctrl+C then npm start)');
  console.log('2. Run: node diagnose-pinata.js');
  console.log('3. Look for: 🔗 IPFS: Pinata Connected\n');
  
  rl.close();
}

setupPinata().catch(error => {
  console.error('\n❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
