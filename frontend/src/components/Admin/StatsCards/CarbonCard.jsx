import React from 'react';
import { FiActivity } from 'react-icons/fi';

const CarbonCard = ({ totalCarbon = 0, loading }) => {
  return (
    <div className={`stat-card ${loading ? 'loading' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">Total CO₂ Impact</span>
        <div className="stat-card-icon" style={{ background: 'rgba(0, 224, 184, 0.1)', color: '#00E0B8' }}>
          <FiActivity />
        </div>
      </div>
      
      <div className="stat-card-value">{(totalCarbon || 0).toFixed(1)}</div>
      
      <div className="stat-card-subtitle">
        CO₂e (tons) sequestered
      </div>

      {totalCarbon === 0 && !loading && (
        <div className="no-data-message">
          Impact data pending IPFS sync
        </div>
      )}
    </div>
  );
};

export default CarbonCard;
