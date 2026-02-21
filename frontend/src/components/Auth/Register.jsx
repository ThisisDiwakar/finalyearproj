import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff,
  FiArrowRight, FiMapPin, FiBriefcase
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1); // Multi-step form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'community',
    organizationName: '',
    organizationType: 'individual',
    registrationNumber: '',
    state: '',
    district: '',
    village: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) { toast.error('Name is required'); return false; }
    if (!formData.email.trim()) { toast.error('Email is required'); return false; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return false; }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: formData.role,
        organization: {
          name: formData.organizationName || undefined,
          type: formData.organizationType,
          registrationNumber: formData.registrationNumber || undefined,
        },
        location: {
          state: formData.state || undefined,
          district: formData.district || undefined,
          village: formData.village || undefined,
        },
      };

      const result = await register(payload);
      toast.success(result.message || 'Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'community', label: '👥 Community Member', desc: 'Local fisher / farmer / resident' },
    { value: 'ngo', label: '🏢 NGO', desc: 'Non-governmental organization' },
    { value: 'panchayat', label: '🏛️ Coastal Panchayat', desc: 'Local governing body' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side — Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-icon">🌊</div>
            <h1>Join the Registry</h1>
            <p>Register to submit blue carbon restoration projects and earn verified carbon credits</p>
            <div className="brand-features">
              <div className="brand-feature">
                <span className="feature-icon">📍</span>
                <span>GPS-tagged field submissions</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">📸</span>
                <span>IPFS-stored photo evidence</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">💰</span>
                <span>Tokenized carbon credits</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">📴</span>
                <span>Works offline in field</span>
              </div>
            </div>
          </div>
          <div className="brand-wave"></div>
        </div>

        {/* Right side — Register Form */}
        <div className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Step {step} of 2 — {step === 1 ? 'Basic Details' : 'Role & Location'}</p>
              <div className="step-indicator">
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className="step-line"></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
              </div>
            </div>

            {step === 1 && (
              <div className="form-step fade-in">
                <div className="input-group">
                  <label htmlFor="name">Full Name *</label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email Address *</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password *</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Create a password (min 6 chars)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="button" className="auth-btn" onClick={handleNext}>
                  <span className="btn-content">
                    Next — Role & Location <FiArrowRight />
                  </span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step fade-in">
                <div className="input-group">
                  <label>Select Your Role *</label>
                  <div className="role-cards">
                    {roles.map((r) => (
                      <div
                        key={r.value}
                        className={`role-card ${formData.role === r.value ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, role: r.value })}
                      >
                        <span className="role-label">{r.label}</span>
                        <span className="role-desc">{r.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {(formData.role === 'ngo' || formData.role === 'panchayat') && (
                  <div className="input-group">
                    <label htmlFor="organizationName">Organization Name</label>
                    <div className="input-wrapper">
                      <FiBriefcase className="input-icon" />
                      <input
                        type="text"
                        id="organizationName"
                        name="organizationName"
                        placeholder="Enter organization name"
                        value={formData.organizationName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="state">State</label>
                    <div className="input-wrapper">
                      <FiMapPin className="input-icon" />
                      <input
                        type="text"
                        id="state"
                        name="state"
                        placeholder="e.g., Tamil Nadu"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="district">District</label>
                    <div className="input-wrapper">
                      <FiMapPin className="input-icon" />
                      <input
                        type="text"
                        id="district"
                        name="district"
                        placeholder="e.g., Cuddalore"
                        value={formData.district}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="village">Village / Area</label>
                  <div className="input-wrapper">
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      id="village"
                      name="village"
                      placeholder="e.g., Pichavaram"
                      value={formData.village}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="btn-row">
                  <button type="button" className="auth-btn secondary" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? (
                      <span className="btn-loading">
                        <span className="spinner"></span> Creating...
                      </span>
                    ) : (
                      <span className="btn-content">
                        Create Account <FiArrowRight />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
