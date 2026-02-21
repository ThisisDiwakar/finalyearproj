const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─────────────────────────────────────────────
// POST /api/auth/register  — Register new user
// ─────────────────────────────────────────────
router.post(
  '/register',
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
      .isIn(['community', 'ngo', 'panchayat'])
      .withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { name, email, password, phone, role, organization, location } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'community',
        organization,
        location,
      });

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
