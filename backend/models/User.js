const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },

    // Role-based access
    role: {
      type: String,
      enum: ['community', 'ngo', 'panchayat', 'admin', 'verifier'],
      default: 'community',
    },

    // Organization details (for NGO/Panchayat)
    organization: {
      name: { type: String, trim: true },
      type: {
        type: String,
        enum: ['ngo', 'coastal_panchayat', 'research_institute', 'government', 'individual'],
      },
      registrationNumber: { type: String, trim: true },
    },

    // Location
    location: {
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      village: { type: String, trim: true },
    },

    // Profile
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Wallet address (for future blockchain integration)
    walletAddress: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
