const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');

const app = express();

// ── Create uploads directory if it doesn't exist ──
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🌊 Blue Carbon Registry API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── Error handling ──
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 10MB.'
        : `Upload error: ${err.message}`,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════════════╗
  ║  🌊 Blue Carbon Registry API Server             ║
  ║  📡 Running on: http://localhost:${PORT}           ║
  ║  📦 MongoDB: ${dbConnected ? 'Connected ✅' : 'NOT CONNECTED ⚠️'}                  ║
  ║  🔗 IPFS: ${process.env.PINATA_API_KEY && process.env.PINATA_API_KEY !== 'your_pinata_api_key' ? 'Pinata Connected' : 'Local Fallback'}                  ║
  ╚══════════════════════════════════════════════════╝
    `);

    if (!dbConnected) {
      console.log('  👉 Configure MONGO_URI in backend/.env to enable database\n');
    }
  });
};

startServer();

module.exports = app;
