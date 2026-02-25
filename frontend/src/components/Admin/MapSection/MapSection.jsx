import React from 'react';
import IndiaMap from './IndiaMap';
import ProjectDrawer from './ProjectDrawer';
import './MapSectionNew.css';

const MapSection = ({ projects, loading, selectedProject, setSelectedProject, onActionComplete }) => {
  return (
    <div className="map-section-container">
      <div className="map-container">
        {loading ? (
          <div className="map-loading">
            <div className="spinner"></div>
            <p>Loading map data...</p>
          </div>
        ) : (
          <>
            {/* Always show the map */}
            <IndiaMap 
              projects={projects}
              onProjectClick={setSelectedProject}
              selectedProject={selectedProject}
            />
            
            {/* Map Legend */}
            {projects.length > 0 && (
              <div className="map-legend">
                <div className="legend-title">Project Density</div>
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-color high"></div>
                    <div className="legend-label">
                      <span>High</span>
                      <span className="legend-count">(5+ projects)</span>
                    </div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color medium"></div>
                    <div className="legend-label">
                      <span>Medium</span>
                      <span className="legend-count">(2-4 projects)</span>
                    </div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color low"></div>
                    <div className="legend-label">
                      <span>Low</span>
                      <span className="legend-count">(1 project)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show overlay message when no projects */}
            {projects.length === 0 && (
              <div className="map-overlay-message">
                <div className="overlay-content">
                  <div className="empty-icon">🗺️</div>
                  <h3>No Active Projects</h3>
                  <p>Projects will appear on the map after sync</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProject && (
        <ProjectDrawer 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onActionComplete={onActionComplete}
        />
      )}
    </div>
  );
};

export default MapSection;
