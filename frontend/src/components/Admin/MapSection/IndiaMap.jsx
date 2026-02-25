import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pinpoint marker icon with color coding based on project density
const createPinpointIcon = (projectCount, status) => {
  // Determine color based on project count (density)
  let densityColor;
  let densityLabel;
  
  if (projectCount >= 5) {
    densityColor = '#ef4444'; // Red - High density (More projects)
    densityLabel = 'High';
  } else if (projectCount >= 2) {
    densityColor = '#f59e0b'; // Orange - Medium density (Medium projects)
    densityLabel = 'Medium';
  } else {
    densityColor = '#10b981'; // Green - Low density (Less projects)
    densityLabel = 'Low';
  }

  return L.divIcon({
    className: 'custom-pinpoint-wrapper',
    html: `
      <div class="pinpoint-marker" style="background: ${densityColor};">
        <div class="pinpoint-inner">
          <div class="pinpoint-dot"></div>
          <div class="pinpoint-pulse" style="border-color: ${densityColor};"></div>
        </div>
        <div class="pinpoint-count">${projectCount}</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Group projects by location (state + district)
const groupProjectsByLocation = (projects) => {
  console.log('🗺️ Starting to group projects. Total projects:', projects.length);
  
  const locationMap = new Map();
  let projectsWithLocation = 0;
  let projectsWithoutLocation = 0;
  
  projects.forEach((project, idx) => {
    // Check if project has location data
    if (!project.location?.state || !project.location?.district) {
      projectsWithoutLocation++;
      console.warn(`⚠️ Project ${idx + 1} (${project.projectId || 'unknown'}) missing location:`, {
        hasLocation: !!project.location,
        hasState: !!project.location?.state,
        hasDistrict: !!project.location?.district,
        location: project.location
      });
      return;
    }
    
    projectsWithLocation++;
    
    // Create unique key for each state-district combination
    const key = `${project.location.state}-${project.location.district}`;
    
    if (!locationMap.has(key)) {
      locationMap.set(key, {
        state: project.location.state,
        district: project.location.district,
        projects: [],
        coordinates: [], // Store all coordinates for averaging
      });
      console.log(`📍 New location found: ${project.location.district}, ${project.location.state}`);
    }
    
    const group = locationMap.get(key);
    group.projects.push(project);
    
    // Collect coordinates from all projects
    if (project.location?.coordinates && Array.isArray(project.location.coordinates) && project.location.coordinates.length === 2) {
      const [lat, lng] = project.location.coordinates;
      if (lat && lng) {
        group.coordinates.push({ lat, lng });
      }
    } else if (project.location?.latitude && project.location?.longitude) {
      const lat = project.location.latitude;
      const lng = project.location.longitude;
      if (lat && lng) {
        group.coordinates.push({ lat, lng });
      }
    } else {
      console.warn(`⚠️ Project ${project.projectId} has location but no coordinates`);
    }
  });
  
  console.log(`📊 Location grouping summary:
    - Projects with location: ${projectsWithLocation}
    - Projects without location: ${projectsWithoutLocation}
    - Unique locations: ${locationMap.size}`);
  
  // Calculate average coordinates for each location group
  const locationGroups = Array.from(locationMap.values())
    .filter(group => {
      if (group.coordinates.length === 0) {
        console.warn(`⚠️ Location ${group.district}, ${group.state} has ${group.projects.length} projects but no coordinates`);
        return false;
      }
      return true;
    })
    .map(group => {
      // Calculate average lat/lng from all projects in this location
      const avgLat = group.coordinates.reduce((sum, coord) => sum + coord.lat, 0) / group.coordinates.length;
      const avgLng = group.coordinates.reduce((sum, coord) => sum + coord.lng, 0) / group.coordinates.length;
      
      const projectCount = group.projects.length;
      const color = projectCount >= 5 ? '🔴' : projectCount >= 2 ? '🟠' : '🟢';
      
      console.log(`${color} ${group.district}, ${group.state}: ${projectCount} projects at [${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}]`);
      
      return {
        state: group.state,
        district: group.district,
        projects: group.projects,
        lat: avgLat,
        lng: avgLng,
      };
    });
  
  console.log(`✅ Final result: ${locationGroups.length} locations will be shown on map`);
  
  return locationGroups;
};

const IndiaMap = ({ projects, onProjectClick, selectedProject }) => {
  // India center coordinates
  const indiaCenter = [20.5937, 78.9629];
  const zoomLevel = 5;

  // Group projects by location for density-based markers
  const locationGroups = useMemo(() => {
    console.log('🗺️ IndiaMap received', projects?.length || 0, 'projects');
    
    // If no projects, return empty array
    if (!projects || projects.length === 0) {
      return [];
    }
    
    // Log each project's location data
    projects.forEach((project, idx) => {
      console.log(`Project ${idx + 1}:`, {
        id: project.projectId,
        state: project.location?.state,
        district: project.location?.district,
        hasCoordinates: !!(project.location?.coordinates || (project.location?.latitude && project.location?.longitude))
      });
    });
    
    const groups = groupProjectsByLocation(projects || []);
    return groups;
  }, [projects]);

  return (
    <MapContainer
      center={indiaCenter}
      zoom={zoomLevel}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      {/* Brighter tile layer for better visibility */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Render grouped location markers with density-based colors */}
      {locationGroups.map((group, index) => {
        const projectCount = group.projects.length;
        
        // Calculate statistics for this location
        const approvedCount = group.projects.filter(p => p.status === 'APPROVED' || p.status === 'MINTED').length;
        const pendingCount = group.projects.filter(p => p.status === 'SUBMITTED' || p.status === 'DRAFT' || p.status === 'UNDER_REVIEW' || p.status === 'REVIEW').length;
        const rejectedCount = group.projects.filter(p => p.status === 'REJECTED').length;
        
        const totalArea = group.projects.reduce((sum, p) => sum + (p.restoration?.areaHectares || 0), 0);
        const totalCarbon = group.projects.reduce((sum, p) => sum + (p.carbon?.estimatedCO2e || 0), 0);

        return (
          <Marker
            key={`${group.state}-${group.district}-${index}`}
            position={[group.lat, group.lng]}
            icon={createPinpointIcon(projectCount, group.projects[0]?.status)}
            eventHandlers={{
              click: () => {
                // If only one project, open it directly
                if (projectCount === 1) {
                  onProjectClick(group.projects[0]);
                }
              },
            }}
          >
            <Popup maxWidth={300}>
              <div style={{ minWidth: '260px', padding: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(0, 224, 184, 0.2)'
                }}>
                  <div>
                    <strong style={{ color: '#00E0B8', fontSize: '16px', display: 'block' }}>
                      {group.district}
                    </strong>
                    <span style={{ fontSize: '13px', color: '#999' }}>
                      {group.state}
                    </span>
                  </div>
                  <div style={{
                    background: projectCount >= 5 ? '#ef4444' : projectCount >= 2 ? '#f59e0b' : '#10b981',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', marginBottom: '8px', color: '#ccc' }}>
                    <strong>Project Status:</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {approvedCount > 0 && (
                      <span style={{ 
                        background: 'rgba(34, 197, 94, 0.2)', 
                        color: '#22c55e',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        ✓ {approvedCount} Approved
                      </span>
                    )}
                    {pendingCount > 0 && (
                      <span style={{ 
                        background: 'rgba(251, 191, 36, 0.2)', 
                        color: '#fbbf24',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        ⏳ {pendingCount} Pending
                      </span>
                    )}
                    {rejectedCount > 0 && (
                      <span style={{ 
                        background: 'rgba(239, 68, 68, 0.2)', 
                        color: '#ef4444',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        ✗ {rejectedCount} Rejected
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(0, 224, 184, 0.1)', 
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#999' }}>📏 Total Area:</span>
                    <strong style={{ color: '#00E0B8' }}>{totalArea.toFixed(2)} ha</strong>
                  </div>
                  <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#999' }}>🌱 CO₂ Sequestered:</span>
                    <strong style={{ color: '#00E0B8' }}>{totalCarbon.toFixed(1)} tons</strong>
                  </div>
                </div>

                {projectCount > 1 && (
                  <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', textAlign: 'center' }}>
                    Click on individual projects in the table to view details
                  </div>
                )}

                {projectCount === 1 && (
                  <button
                    onClick={() => onProjectClick(group.projects[0])}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#00E0B8',
                      color: '#0a1628',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#00c9a7'}
                    onMouseOut={(e) => e.target.style.background = '#00E0B8'}
                  >
                    View Project Details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default IndiaMap;
