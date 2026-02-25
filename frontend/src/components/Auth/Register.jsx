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
    // Admin-specific fields
    governmentAgency: '',
    employeeId: '',
    idProof: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'idProof' && files) {
      setFormData({ ...formData, idProof: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

    // Validate admin-specific fields
    if (formData.role === 'admin') {
      if (!formData.governmentAgency) {
        toast.error('Government agency is required for admin role');
        return;
      }
      if (!formData.employeeId || !/^[0-9]{8,12}$/.test(formData.employeeId)) {
        toast.error('Employee ID must be 8-12 digits');
        return;
      }
      if (!formData.idProof) {
        toast.error('ID proof upload is required for admin role');
        return;
      }
      // Validate file size and type
      if (formData.idProof.size > 5 * 1024 * 1024) {
        toast.error('ID proof file size must be less than 5MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(formData.idProof.type)) {
        toast.error('ID proof must be a JPG or PNG image');
        return;
      }
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);

      if (formData.phone) formDataToSend.append('phone', formData.phone);

      // Add organization data
      if (formData.organizationName || formData.organizationType || formData.registrationNumber) {
        formDataToSend.append('organization', JSON.stringify({
          name: formData.organizationName || undefined,
          type: formData.organizationType,
          registrationNumber: formData.registrationNumber || undefined,
        }));
      }

      // Add location data
      if (formData.state || formData.district || formData.village) {
        formDataToSend.append('location', JSON.stringify({
          state: formData.state || undefined,
          district: formData.district || undefined,
          village: formData.village || undefined,
        }));
      }

      // Add admin-specific data
      if (formData.role === 'admin') {
        formDataToSend.append('governmentAgency', formData.governmentAgency);
        formDataToSend.append('employeeId', formData.employeeId);
        formDataToSend.append('idProof', formData.idProof);
      }

      const result = await register(formDataToSend);
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
    { value: 'admin', label: '🔐 Admin', desc: 'Government agency official' },
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

                {formData.role === 'admin' && (
                  <>
                    <div className="input-group">
                      <label htmlFor="governmentAgency">Government Agency *</label>
                      <div className="input-wrapper">
                        <FiBriefcase className="input-icon" />
                        <select
                          id="governmentAgency"
                          name="governmentAgency"
                          value={formData.governmentAgency}
                          onChange={handleChange}
                          required
                          className="select-input"
                        >
                          <option value="">Select Government Agency</option>
                          <option value="National Centre for Coastal Research (NCCR)">
                            National Centre for Coastal Research (NCCR)
                          </option>
                          <option value="Forest Survey of India (FSI)">
                            Forest Survey of India (FSI)
                          </option>
                          <option value="State Coastal Zone Management Authority">
                            State Coastal Zone Management Authority
                          </option>
                          <option value="Ministry of Environment, Forest & Climate Change">
                            Ministry of Environment, Forest & Climate Change
                          </option>
                          <option value="Other Government Agency">
                            Other Government Agency
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="employeeId">Official Employee ID *</label>
                      <div className="input-wrapper">
                        <FiUser className="input-icon" />
                        <input
                          type="text"
                          id="employeeId"
                          name="employeeId"
                          placeholder="8-12 digit employee ID"
                          value={formData.employeeId}
                          onChange={handleChange}
                          required
                          pattern="[0-9]{8,12}"
                          maxLength={12}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="idProof">Upload ID Proof (Government ID) *</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="idProof"
                          name="idProof"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleChange}
                          required
                          className="file-input"
                        />
                        <label htmlFor="idProof" className="file-label">
                          <span className="file-icon">📎</span>
                          <span className="file-text">
                            {formData.idProof ? formData.idProof.name : 'Choose file (JPG/PNG, max 5MB)'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
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
