import React from 'react';
import { FiX, FiMapPin, FiUsers, FiActivity, FiCalendar } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ProjectDrawerImproved.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProjectDrawer = ({ project, onClose, onActionComplete }) => {
  const [updating, setUpdating] = React.useState(false);

  const handleApprove = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('bcr_token');
      await axios.post(
        `${API_BASE}/admin/projects/${project._id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`✓ Project ${project.projectId} approved successfully!`);
      
      // Trigger dashboard refresh
      if (onActionComplete) {
        onActionComplete();
      }
      
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve project');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('bcr_token');
      await axios.post(
        `${API_BASE}/admin/projects/${project._id}/reject`,
        { reason: 'Rejected by admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`✗ Project ${project.projectId} rejected`);
      
      // Trigger dashboard refresh
      if (onActionComplete) {
        onActionComplete();
      }
      
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error('Reject error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject project');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="project-drawer">
        <div className="drawer-header">
          <h3>Project Details</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-section">
            <div className="section-label">Project ID</div>
            <div className="section-value" style={{ color: '#00E0B8', fontFamily: 'monospace' }}>
              {project.projectId || 'N/A'}
            </div>
          </div>

          <div className="drawer-section">
            <div className="section-label">
              <FiMapPin /> Location
            </div>
            <div className="section-value">
              {project.location?.village && `${project.location.village}, `}
              {project.location?.district && `${project.location.district}, `}
              {project.location?.state || 'N/A'}
            </div>
          </div>

          <div className="drawer-section">
            <div className="section-label">
              <FiActivity /> Restoration Area
            </div>
            <div className="section-value">
              {project.restoration?.areaHectares?.toFixed(2) || 0} hectares
            </div>
          </div>

          <div className="drawer-section">
            <div className="section-label">
              <FiActivity /> CO₂ Impact
            </div>
            <div className="section-value">
              {project.carbon?.estimatedCO2e?.toFixed(1) || 0} tons CO₂e sequestered
            </div>
          </div>

          <div className="drawer-section">
            <div className="section-label">
              <FiUsers /> Submitted By
            </div>
            <div className="section-value">
              {project.submittedBy?.name || 'N/A'}
              <br />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                {project.submittedBy?.email || ''}
              </span>
            </div>
          </div>

          <div className="drawer-section">
            <div className="section-label">Status</div>
            <div className="section-value">
              <span className={`status-pill ${project.status.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="drawer-section">
            <div className="section-label">
              <FiCalendar /> Submitted Date
            </div>
            <div className="section-value">
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="drawer-actions">
          <button
            className="action-btn approve"
            onClick={handleApprove}
            disabled={updating || project.status === 'APPROVED'}
          >
            ✓ Approve
          </button>
          <button
            className="action-btn reject"
            onClick={handleReject}
            disabled={updating || project.status === 'REJECTED'}
          >
            ✗ Reject
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectDrawer;
