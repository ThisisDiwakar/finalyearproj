import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      toast.success(result.message || 'Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side — Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-icon">🌊</div>
            <h1>Blue Carbon Registry</h1>
            <p>Blockchain-Based MRV System for Coastal Ecosystem Restoration</p>
            <div className="brand-features">
              <div className="brand-feature">
                <span className="feature-icon">🔗</span>
                <span>Immutable Data on Blockchain</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">🌿</span>
                <span>Carbon Credit Tokenization</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">📱</span>
                <span>Mobile-First Field Data Capture</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">🏛️</span>
                <span>NCCR & MoES Verified</span>
              </div>
            </div>
          </div>
          <div className="brand-wave"></div>
        </div>

        {/* Right side — Login Form */}
        <div className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your Blue Carbon Registry account</p>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
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
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                <span className="btn-content">
                  Sign In <FiArrowRight />
                </span>
              )}
            </button>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
