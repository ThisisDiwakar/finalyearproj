import React from 'react';
import { FiX, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import './AnalyticsPanel.css';

const AnalyticsPanel = ({ data, onClose }) => {
  const hasData = data.totalProjects > 0;

  // Calculate state-wise distribution
  const stateDistribution = data.projects.reduce((acc, project) => {
    const state = project.location?.state || 'Unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const topStates = Object.entries(stateDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="analytics-panel glass-card fade-in">
      <div className="analytics-header">
        <h2>
          <FiBarChart2 />
          Advanced Analytics
        </h2>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>
      </div>

      {!hasData ? (
        <div className="analytics-empty">
          <FiPieChart size={64} />
          <h3>No Analytics Data Available</h3>
          <p>IPFS Sync Required</p>
        </div>
      ) : (
        <div className="analytics-content">
          {/* State-wise Distribution */}
          <div className="analytics-card">
            <h3>
              <FiBarChart2 />
              Top 5 States by Projects
            </h3>
            <div className="bar-chart">
              {topStates.map(([state, count]) => {
                const percentage = (count / data.totalProjects) * 100;
                return (
                  <div key={state} className="bar-item">
                    <div className="bar-label">
                      <span>{state}</span>
                      <span className="bar-value">{count}</span>
                    </div>
                    <div className="bar-track">
                      <div 
                        className="bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CO₂ Impact Heatmap */}
          <div className="analytics-card">
            <h3>
              <FiTrendingUp />
              CO₂ Sequestration Overview
            </h3>
            <div className="impact-grid">
              <div className="impact-item">
                <div className="impact-value">{data.totalCarbon.toFixed(1)}</div>
                <div className="impact-label">Total CO₂e (tons)</div>
              </div>
              <div className="impact-item">
                <div className="impact-value">{data.equivalentCars}</div>
                <div className="impact-label">Cars Removed</div>
              </div>
              <div className="impact-item">
                <div className="impact-value">{data.totalArea.toFixed(2)}</div>
                <div className="impact-label">Total Area (ha)</div>
              </div>
              <div className="impact-item">
                <div className="impact-value">
                  {(data.totalCarbon / data.totalArea).toFixed(2)}
                </div>
                <div className="impact-label">CO₂/ha Ratio</div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="analytics-card">
            <h3>
              <FiPieChart />
              Project Status Distribution
            </h3>
            <div className="status-distribution">
              <div className="status-dist-item">
                <div className="status-dist-bar pending" style={{ width: `${(data.pendingProjects / data.totalProjects) * 100}%` }} />
                <span>Pending: {data.pendingProjects}</span>
              </div>
              <div className="status-dist-item">
                <div className="status-dist-bar review" style={{ width: `${(data.reviewProjects / data.totalProjects) * 100}%` }} />
                <span>Review: {data.reviewProjects}</span>
              </div>
              <div className="status-dist-item">
                <div className="status-dist-bar approved" style={{ width: `${(data.approvedProjects / data.totalProjects) * 100}%` }} />
                <span>Approved: {data.approvedProjects}</span>
              </div>
              <div className="status-dist-item">
                <div className="status-dist-bar rejected" style={{ width: `${(data.rejectedProjects / data.totalProjects) * 100}%` }} />
                <span>Rejected: {data.rejectedProjects}</span>
              </div>
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="analytics-card">
            <h3>
              <FiTrendingUp />
              Financial Overview
            </h3>
            <div className="revenue-stats">
              <div className="revenue-item">
                <div className="revenue-label">Total Earnings</div>
                <div className="revenue-value">₹{data.totalEarnings.toLocaleString()}</div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Per State Average</div>
                <div className="revenue-value">
                  ₹{Math.floor(data.totalEarnings / (data.statesCount || 1)).toLocaleString()}
                </div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Per Project Average</div>
                <div className="revenue-value">
                  ₹{Math.floor(data.totalEarnings / data.totalProjects).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
