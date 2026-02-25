import React from 'react';
import { FiClock } from 'react-icons/fi';
import './ActivityFeed.css';

const ActivityFeed = ({ activities, loading }) => {
  const getStatusColor = (status) => {
    const colors = {
      approved: 'var(--admin-approved)',
      pending: 'var(--admin-pending)',
      review: 'var(--admin-review)',
      rejected: 'var(--admin-rejected)',
    };
    return colors[status] || 'var(--admin-primary)';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="activity-feed glass-card">
        <h3 className="feed-title">Activity Feed</h3>
        <div className="feed-loading">
          <div className="spinner"></div>
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="activity-feed glass-card">
        <h3 className="feed-title">Activity Feed</h3>
        <div className="feed-empty">
          <FiClock size={48} />
          <p>No Activity Yet</p>
          <span>Waiting for blockchain/IPFS updates.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-feed glass-card fade-in">
      <h3 className="feed-title">Activity Feed</h3>
      
      <div className="feed-timeline">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="timeline-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div 
              className="timeline-dot"
              style={{ background: getStatusColor(activity.status) }}
            />
            <div className="timeline-content">
              <p className="activity-text">{activity.action}</p>
              <span className="activity-time">
                {formatTime(activity.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
