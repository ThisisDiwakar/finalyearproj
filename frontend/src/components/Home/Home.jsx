import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiShield, FiDatabase, FiGlobe,
  FiUsers, FiAward, FiTrendingUp, FiCheckCircle,
  FiMapPin, FiLayers
} from 'react-icons/fi';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* ── Top Navigation Bar ── */}
      <nav className="home-nav">
        <div className="home-nav-container">
          <div className="home-nav-logo">
            <span className="home-logo-icon">🌊</span>
            <span className="home-logo-text">Blue Carbon Registry</span>
          </div>
          <div className="home-nav-actions">
            <Link to="/login" className="home-nav-link">Login</Link>
            <Link to="/register" className="home-nav-btn">
              Create Account <FiArrowRight />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
          <div className="hero-wave"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <FiShield /> Blockchain Verified MRV System
          </div>
          <h1 className="hero-title">
            Protecting India's <span className="hero-highlight">Blue Carbon</span> Ecosystems
          </h1>
          <p className="hero-subtitle">
            A blockchain-based Monitoring, Reporting & Verification (MRV) platform 
            for coastal ecosystem restoration — empowering communities, NGOs, and 
            panchayats to register, track, and verify blue carbon projects with 
            transparent, immutable records.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="hero-btn hero-btn-primary">
              Get Started <FiArrowRight />
            </Link>
            <a href="#features" className="hero-btn hero-btn-secondary">
              Learn More
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">🌿</span>
              <span className="hero-stat-label">Carbon Credits</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">🔗</span>
              <span className="hero-stat-label">Blockchain Secured</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">📍</span>
              <span className="hero-stat-label">Geo-Tagged Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What is Blue Carbon Section ── */}
      <section className="info-section" id="about">
        <div className="info-container">
          <div className="section-header">
            <span className="section-tag">About</span>
            <h2 className="section-title">What is Blue Carbon?</h2>
            <p className="section-desc">
              Blue carbon refers to the carbon captured and stored by the world's 
              coastal and marine ecosystems — mangroves, seagrasses, and salt marshes. 
              These ecosystems sequester carbon up to <strong>10x faster</strong> than 
              terrestrial forests, making them critical in the fight against climate change.
            </p>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-card-icon">🌴</div>
              <h3>Mangroves</h3>
              <p>Coastal forests that store massive amounts of carbon in their roots and soil, while protecting shorelines from erosion.</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon">🌿</div>
              <h3>Seagrass Meadows</h3>
              <p>Underwater grasslands that capture carbon dioxide and provide habitat for marine biodiversity.</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon">🏝️</div>
              <h3>Salt Marshes</h3>
              <p>Coastal wetlands that act as natural carbon sinks and buffer zones against storm surges and flooding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section" id="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Why Blue Carbon Registry?</h2>
            <p className="section-desc">
              Our platform combines blockchain technology with environmental science 
              to create a transparent, tamper-proof system for blue carbon project management.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <FiShield />
              </div>
              <h3>Blockchain Security</h3>
              <p>All project data is hashed and stored on an immutable blockchain, ensuring transparency and preventing data tampering.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <FiDatabase />
              </div>
              <h3>IPFS Storage</h3>
              <p>Project documents and evidence are stored on the InterPlanetary File System (IPFS) for decentralized, permanent access.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <FiMapPin />
              </div>
              <h3>Geo-Tagged Projects</h3>
              <p>Every restoration site is mapped with precise GPS coordinates and visualized on interactive maps.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <FiTrendingUp />
              </div>
              <h3>Carbon Estimation</h3>
              <p>Automated carbon sequestration calculations based on ecosystem type, area, and scientifically-backed models.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <FiUsers />
              </div>
              <h3>Multi-Role Access</h3>
              <p>Separate interfaces for communities, NGOs, panchayats, and verifiers — each with role-specific capabilities.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <FiLayers />
              </div>
              <h3>MRV Workflow</h3>
              <p>Complete Monitoring, Reporting & Verification pipeline — from project submission to verified carbon credits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="steps-section" id="how-it-works">
        <div className="steps-container">
          <div className="section-header">
            <span className="section-tag">Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">
              From registration to verified carbon credits — a streamlined 4-step process.
            </p>
          </div>

          <div className="steps-timeline">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Account</h3>
                <p>Register as a community member, NGO, or coastal panchayat with your organization details and location.</p>
              </div>
            </div>
            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Submit Project</h3>
                <p>Add your blue carbon restoration project with site details, GPS coordinates, ecosystem type, and supporting evidence.</p>
              </div>
            </div>
            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Verification</h3>
                <p>Your project data is hashed onto the blockchain and reviewed by authorized verifiers for accuracy and compliance.</p>
              </div>
            </div>
            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Earn Carbon Credits</h3>
                <p>Once verified, your project earns tokenized carbon credits — transparent, tradeable, and permanently recorded.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-bg-effects">
            <div className="cta-circle cta-circle-1"></div>
            <div className="cta-circle cta-circle-2"></div>
          </div>
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join India's first blockchain-powered blue carbon MRV platform. Register your coastal restoration project today.</p>
            <div className="cta-actions">
              <Link to="/register" className="cta-btn cta-btn-primary">
                Create Free Account <FiArrowRight />
              </Link>
              <Link to="/login" className="cta-btn cta-btn-secondary">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <span>🌊</span>
                <span>Blue Carbon Registry</span>
              </div>
              <p>Blockchain-Based MRV System for Coastal Ecosystem Restoration</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#about">About Blue Carbon</a>
              </div>
              <div className="footer-col">
                <h4>Get Started</h4>
                <Link to="/register">Create Account</Link>
                <Link to="/login">Sign In</Link>
              </div>
              <div className="footer-col">
                <h4>Organizations</h4>
                <span>NCCR (MoES)</span>
                <span>INCOIS</span>
                <span>SAC-ISRO</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Blue Carbon Registry. Built for India's coastal communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
