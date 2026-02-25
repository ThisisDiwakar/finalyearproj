import React from 'react';
import { FiMapPin, FiTrendingUp } from 'react-icons/fi';

const AreaCard = ({ totalArea = 0, monthlyIncrease = 0, loading }) => {
  return (
    <div className={`stat-card ${loading ? 'loading' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">Total Restoration Area</span>
        <div className="stat-card-icon" style={{ background: 'rgba(102, 187, 106, 0.1)', color: '#66bb6a' }}>
          <FiMapPin />
        </div>
      </div>
      
      <div className="stat-card-value">{(totalArea || 0).toFixed(2)}</div>
      
      <div className="stat-card-subtitle positive">
        <FiTrendingUp />
        +{(monthlyIncrease || 0).toFixed(2)} hectares this month
      </div>

      {/* Sparkline */}
      {totalArea > 0 ? (
        <div className="sparkline-container">
          {[20, 35, 45, 30, 50, 60, 55, 70, 65, 80, 90, 100].map((height, i) => (
            <div 
              key={i} 
              className="sparkline-bar" 
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="no-data-message">
          Sparkline will appear after IPFS sync
        </div>
      )}
    </div>
  );
};

export default AreaCard;
