const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const router = express.Router();

// Configure multer for ID proof uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/id-proofs';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'id-proof-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─────────────────────────────────────────────
// POST /api/auth/register  — Register new user
// ─────────────────────────────────────────────
router.post(
  '/register',
  upload.single('idProof'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone')
      .optional()
      .matches(/^[0-9]{10}$/)
      .withMessage('Phone must be 10 digits'),
    body('role')
      .optional()
      .isIn(['community', 'ngo', 'panchayat', 'admin'])
      .withMessage('Invalid role'),
    body('employeeId')
      .if(body('role').equals('admin'))
      .matches(/^[0-9]{8,12}$/)
      .withMessage('Employee ID must be 8-12 digits'),
    body('governmentAgency')
      .if(body('role').equals('admin'))
      .notEmpty()
      .withMessage('Government agency is required for admin role'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Clean up uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { name, email, password, phone, role, organization, location, employeeId, governmentAgency } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Clean up uploaded file
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      // Validate admin-specific requirements
      if (role === 'admin') {
        if (!employeeId || !governmentAgency) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({
            success: false,
            message: 'Employee ID and Government Agency are required for admin role',
          });
        }
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'ID proof upload is required for admin role',
          });
        }
      }

      // Prepare user data
      const userData = {
        name,
        email,
        password,
        phone,
        role: role || 'community',
        organization,
        location,
      };

      // Add admin-specific data
      if (role === 'admin' && req.file) {
        userData.adminDetails = {
          governmentAgency,
          employeeId,
          idProof: {
            filename: req.file.filename,
            path: req.file.path,
            uploadedAt: new Date(),
          },
        };
      }

      // Create user
      const user = await User.create(userData);

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to Blue Carbon Registry.',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Registration Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
      });
    }
  }
);

// ─────────────────────────────────────────────
// POST /api/auth/login  — Login user
// ─────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user with password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Contact admin.',
        });
      }

      // Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful!',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }
  }
);

// ─────────────────────────────────────────────
// GET /api/auth/me  — Get current user profile
// ─────────────────────────────────────────────
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
});

// ─────────────────────────────────────────────
// PUT /api/auth/profile  — Update user profile
// ─────────────────────────────────────────────
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'organization', 'location', 'walletAddress'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
});

module.exports = router;
