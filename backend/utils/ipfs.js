const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Upload a file to IPFS via Pinata
 * Pinata provides free IPFS pinning service
 * Get API keys at: https://app.pinata.cloud/
 *
 * @param {string} filePath - Path to the file to upload
 * @param {string} fileName - Original file name
 * @returns {Object} - { ipfsHash, ipfsUrl }
 */
const uploadToIPFS = async (filePath, fileName) => {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;

  // If Pinata keys are not configured, return a mock hash
  if (!apiKey || apiKey === 'your_pinata_api_key' || !secretKey || secretKey === 'your_pinata_secret_key') {
    console.warn('⚠️  Pinata API keys not configured. Using local storage fallback.');
    const mockHash = `Qm${Date.now().toString(36)}${Math.random().toString(36).substr(2, 20)}`;
    return {
      ipfsHash: mockHash,
      ipfsUrl: `/uploads/${path.basename(filePath)}`,
      pinSize: 0,
      timestamp: new Date().toISOString(),
      isPinataUpload: false,
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: fileName,
    });

    // Add metadata
    const metadata = JSON.stringify({
      name: `BlueCarbon_${fileName}`,
      keyvalues: {
        project: 'BlueCarbon-MRV',
        type: 'field-photo',
        uploadedAt: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    // Pin options
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;

    return {
      ipfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp,
      isPinataUpload: true,
    };
  } catch (error) {
    console.error('Pinata IPFS Upload Error:', error.response?.data || error.message);
    throw new Error(`IPFS upload failed: ${error.message}`);
  }
};

/**
 * Upload JSON metadata to IPFS (for project metadata)
 * @param {Object} jsonData - JSON object to pin
 * @param {string} name - Name for the pin
 * @returns {Object} - { ipfsHash, ipfsUrl }
 */
const uploadJSONToIPFS = async (jsonData, name = 'BlueCarbon-Metadata') => {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;

  if (!apiKey || apiKey === 'your_pinata_api_key') {
    const mockHash = `Qm${Date.now().toString(36)}${Math.random().toString(36).substr(2, 20)}`;
    return {
      ipfsHash: mockHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
      isPinataUpload: false,
    };
  }

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: jsonData,
        pinataMetadata: { name },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      }
    );

    return {
      ipfsHash: response.data.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      isPinataUpload: true,
    };
  } catch (error) {
    console.error('Pinata JSON Upload Error:', error.response?.data || error.message);
    throw new Error(`IPFS JSON upload failed: ${error.message}`);
  }
};

module.exports = { uploadToIPFS, uploadJSONToIPFS };
