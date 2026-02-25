import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiPlus, FiList, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Don't show navbar on home page, when not authenticated, or for admin users
  if (!isAuthenticated || user?.role === 'admin') return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🌊</span>
          <span className="logo-text">Blue Carbon Registry</span>
        </Link>

        {/* Desktop Menu */}
        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <FiHome /> Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <FiUser /> Admin Panel
            </Link>
          )}
          <Link
            to="/submit"
            className={`nav-link ${isActive('/submit') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <FiPlus /> Submit Project
          </Link>
          <Link
            to="/projects"
            className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <FiList /> My Projects
          </Link>

          {/* User info (mobile) */}
          <div className="nav-user-mobile">
            <div className="user-info">
              <FiUser />
              <span>{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button className="nav-logout" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Desktop user */}
        <div className="nav-user-desktop">
          <div className="user-chip">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
            <FiLogOut />
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
