import React from 'react';
import { FiClock } from 'react-icons/fi';

const PendingCard = ({ count = 0, loading }) => {
  return (
    <div className={`stat-card ${loading ? 'loading' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">Pending Projects</span>
        <div className="stat-card-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
          <FiClock />
        </div>
      </div>
      
      <div className="stat-card-value">{count || 0}</div>
      
      <div className="stat-card-subtitle">
        Awaiting initial review
      </div>

      {count === 0 && !loading && (
        <div className="no-data-message">
          No pending projects
        </div>
      )}
    </div>
  );
};

export default PendingCard;
