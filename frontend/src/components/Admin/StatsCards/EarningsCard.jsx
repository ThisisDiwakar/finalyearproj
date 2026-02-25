import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const EarningsCard = ({ totalEarnings = 0, statesCount = 0, loading }) => {
  return (
    <div className={`stat-card ${loading ? 'loading' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">Total Earnings Distributed</span>
        <div className="stat-card-icon" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#FFC107' }}>
          <FiDollarSign />
        </div>
      </div>
      
      <div className="stat-card-value">₹{(totalEarnings || 0).toLocaleString()}</div>
      
      <div className="stat-card-subtitle">
        Across {statesCount || 0} {statesCount === 1 ? 'State' : 'States'}
      </div>

      {totalEarnings === 0 && !loading && (
        <div className="no-data-message">
          Earnings data will sync from IPFS
        </div>
      )}
    </div>
  );
};

export default EarningsCard;
