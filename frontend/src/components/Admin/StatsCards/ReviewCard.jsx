import React from 'react';
import { FiEye } from 'react-icons/fi';

const ReviewCard = ({ count = 0, loading }) => {
  return (
    <div className={`stat-card ${loading ? 'loading' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">Under Review</span>
        <div className="stat-card-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
          <FiEye />
        </div>
      </div>
      
      <div className="stat-card-value">{count || 0}</div>
      
      <div className="stat-card-subtitle">
        Being reviewed by verifiers
      </div>

      {count === 0 && !loading && (
        <div className="no-data-message">
          No projects under review
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
