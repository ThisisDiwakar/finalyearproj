import React from 'react';
import MapSection from '../MapSection/MapSection';
import './AdminPages.css';

const IndiaMapPage = ({ projects, loading, selectedProject, setSelectedProject }) => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>🗺️ India Map - Project Locations</h1>
        <p>View all projects across India with real-time status indicators</p>
      </div>

      <div className="page-content full-height">
        <MapSection 
          projects={projects}
          loading={loading}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </div>
    </div>
  );
};

export default IndiaMapPage;
