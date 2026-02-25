import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiMapPin, FiCheckCircle, FiClock, FiList } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { projectAPI, offlineQueue } from '../../services/api';
import ProjectList from '../Project/ProjectList';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  // Redirect admin users to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    approved: 0,
    totalCO2: 0,
    totalArea: 0,
  });
  const [loading, setLoading] = useState(true);
  const [offlineCount, setOfflineCount] = useState(0);

  useEffect(() => {
    fetchStats();
    setOfflineCount(offlineQueue.count());
  }, []);

  const fetchStats = async () => {
    try {
      const res = await projectAPI.getAll({ limit: 100 });
      const projects = res.data.data.projects;

      setStats({
        total: projects.length,
        submitted: projects.filter((p) => p.status === 'SUBMITTED').length,
        approved: projects.filter((p) => ['APPROVED', 'MINTED'].includes(p.status)).length,
        totalCO2: projects.reduce((sum, p) => sum + (p.carbon?.estimatedCO2e || 0), 0).toFixed(1),
        totalArea: projects.reduce((sum, p) => sum + (p.restoration?.areaHectares || 0), 0).toFixed(2),
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard page-wrapper">
      {/* Welcome Header */}
      <div className="welcome-section slide-up">
        <div className="welcome-text">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>
            {user?.role === 'community'
              ? 'Submit and track your coastal restoration projects'
              : `Manage projects as ${user?.role}`}
          </p>
        </div>
        <Link to="/submit" className="quick-submit-btn">
          <FiPlus /> New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid fade-in">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(66, 165, 245, 0.1)', color: '#42a5f5' }}>
            <FiList />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Projects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 167, 38, 0.1)', color: '#ffa726' }}>
            <FiClock />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.submitted}</span>
            <span className="stat-label">Under Review</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(102, 187, 106, 0.1)', color: '#66bb6a' }}>
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(0, 191, 165, 0.1)', color: '#00bfa5' }}>
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.totalCO2}</span>
            <span className="stat-label">Total CO₂e (tons)</span>
          </div>
        </div>
      </div>

      {/* Area stat */}
      <div className="area-banner fade-in">
        <FiMapPin />
        <span>Total Restoration Area: <strong>{stats.totalArea} hectares</strong></span>
        {offlineCount > 0 && (
          <span className="offline-badge">📴 {offlineCount} queued offline</span>
        )}
      </div>

      {/* Projects List */}
      <div className="dashboard-projects">
        <ProjectList />
      </div>
    </div>
  );
};

export default Dashboard;
