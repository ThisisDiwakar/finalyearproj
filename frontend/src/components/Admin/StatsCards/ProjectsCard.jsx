import React from 'react';
import { FiFolder } from 'react-icons/fi';

const ProjectsCard = ({ total = 0, pending = 0, review = 0, approved = 0, rejected = 0, loading }) => {
  const pendingReview = pending + review;
  
  return (
    <div className={`stat-card ${loading ? 'loading' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">Total Projects</span>
        <div className="stat-card-icon" style={{ background: 'rgba(66, 165, 245, 0.1)', color: '#42a5f5' }}>
          <FiFolder />
        </div>
      </div>
      
      <div className="stat-card-value">{total}</div>
      
      <div className="status-breakdown">
        <div className="status-item">
          <span className="status-label">Pending Review</span>
          <span className="status-value pending">{pendingReview}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Approved</span>
          <span className="status-value approved">{approved}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Rejected</span>
          <span className="status-value rejected">{rejected}</span>
        </div>
      </div>

      {total === 0 && !loading && (
        <div className="no-data-message">
          No projects yet. Waiting for IPFS sync...
        </div>
      )}
    </div>
  );
};

export default ProjectsCard;
