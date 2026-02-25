import React from 'react';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiActivity } from 'react-icons/fi';
import './AdminPages.css';

const AnalyticsPage = ({ data }) => {
  const hasData = data.totalProjects > 0;

  // Calculate state-wise distribution
  const stateDistribution = data.projects.reduce((acc, project) => {
    const state = project.location?.state || 'Unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const topStates = Object.entries(stateDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Comprehensive insights and data visualization</p>
      </div>

      {!hasData ? (
        <div className="page-empty">
          <FiBarChart2 size={80} />
          <h2>No Analytics Data Available</h2>
          <p>Data will appear once projects are submitted and synced</p>
        </div>
      ) : (
        <div className="page-content">
          {/* Overview Cards */}
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="card-header">
                <h3><FiActivity /> Project Overview</h3>
              </div>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Total Projects</span>
                  <span className="metric-value">{data.totalProjects}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Pending Review</span>
                  <span className="metric-value pending">{data.pendingProjects + data.reviewProjects}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Approved</span>
                  <span className="metric-value approved">{data.approvedProjects}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Rejected</span>
                  <span className="metric-value rejected">{data.rejectedProjects}</span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-header">
                <h3><FiTrendingUp /> Environmental Impact</h3>
              </div>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Total Area Restored</span>
                  <span className="metric-value">{data.totalArea.toFixed(2)} ha</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">CO₂ Sequestered</span>
                  <span className="metric-value">{data.totalCarbon.toFixed(1)} tons</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">States Covered</span>
                  <span className="metric-value">{data.statesCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* State-wise Distribution */}
          <div className="analytics-card full-width">
            <div className="card-header">
              <h3><FiBarChart2 /> State-wise Project Distribution</h3>
            </div>
            <div className="bar-chart-container">
              {topStates.map(([state, count]) => {
                const percentage = (count / data.totalProjects) * 100;
                return (
                  <div key={state} className="bar-chart-item">
                    <div className="bar-label">
                      <span className="state-name">{state}</span>
                      <span className="state-count">{count} projects</span>
                    </div>
                    <div className="bar-track">
                      <div 
                        className="bar-fill"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="bar-percentage">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="analytics-card full-width">
            <div className="card-header">
              <h3><FiPieChart /> Project Status Distribution</h3>
            </div>
            <div className="status-chart">
              <div className="status-bar-item">
                <div className="status-info">
                  <span className="status-dot pending"></span>
                  <span>Pending Review</span>
                </div>
                <div className="status-bar-track">
                  <div 
                    className="status-bar-fill pending"
                    style={{ width: `${((data.pendingProjects + data.reviewProjects) / data.totalProjects) * 100}%` }}
                  />
                </div>
                <span className="status-count">{data.pendingProjects + data.reviewProjects}</span>
              </div>
              <div className="status-bar-item">
                <div className="status-info">
                  <span className="status-dot approved"></span>
                  <span>Approved</span>
                </div>
                <div className="status-bar-track">
                  <div 
                    className="status-bar-fill approved"
                    style={{ width: `${(data.approvedProjects / data.totalProjects) * 100}%` }}
                  />
                </div>
                <span className="status-count">{data.approvedProjects}</span>
              </div>
              <div className="status-bar-item">
                <div className="status-info">
                  <span className="status-dot rejected"></span>
                  <span>Rejected</span>
                </div>
                <div className="status-bar-track">
                  <div 
                    className="status-bar-fill rejected"
                    style={{ width: `${(data.rejectedProjects / data.totalProjects) * 100}%` }}
                  />
                </div>
                <span className="status-count">{data.rejectedProjects}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
