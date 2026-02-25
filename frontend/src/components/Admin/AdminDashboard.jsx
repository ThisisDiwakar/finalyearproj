import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import StatsCards from './StatsCards/StatsCards';
import MapSection from './MapSection/MapSection';
import QuickActions from './QuickActions';
import ProjectsTable from './ProjectsTable';
import ActivityFeed from './ActivityFeed';
import IndiaMapPage from './Pages/IndiaMapPage';
import AnalyticsPage from './Pages/AnalyticsPage';
import UsersPage from './Pages/UsersPage';
import ReportsPage from './Pages/ReportsPage';
import { fetchAdminData, triggerIPFSSync } from '../../services/ipfsService';
import toast from 'react-hot-toast';
import './AdminDashboardNew.css';

const AdminDashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  // Dashboard state (all zeros by default)
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    reviewProjects: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
    totalArea: 0.0,
    monthlyAreaIncrease: 0.0,
    totalCarbon: 0.0,
    equivalentCars: 0,
    totalEarnings: 0,
    statesCount: 0,
    projects: [],
    activityFeed: [],
  });

  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Load data on mount and set up auto-refresh
  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
      
      // Auto-refresh every 10 seconds for immediate updates
      const intervalId = setInterval(() => {
        loadData(true); // Silent refresh
      }, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const loadData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    
    try {
      console.log('🔄 Loading admin dashboard data...');
      const data = await fetchAdminData();
      
      console.log('📊 Data loaded:', {
        totalProjects: data.totalProjects,
        projects: data.projects?.length || 0,
        dataSource: data.dataSource,
        ipfsHash: data.ipfsHash
      });
      
      setDashboardData(data);
      setError(null);
      
      if (!silent && data.totalProjects > 0) {
        const source = data.dataSource === 'ipfs' ? 'IPFS' : 'Database';
        toast.success(`Loaded ${data.totalProjects} projects from ${source}`);
        
        if (data.ipfsHash) {
          console.log(`📦 Current IPFS Hash: ${data.ipfsHash}`);
          console.log(`🔗 Gateway URL: https://gateway.pinata.cloud/ipfs/${data.ipfsHash}`);
        }
      }
    } catch (error) {
      console.error('❌ Data load failed:', error);
      setError(error.message || 'Failed to load data');
      if (!silent) {
        toast.error('Failed to load data');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    const toastId = toast.loading('Refreshing data...');
    try {
      // Trigger IPFS sync first (optional)
      try {
        await triggerIPFSSync();
      } catch (syncError) {
        console.warn('IPFS sync skipped:', syncError.message);
      }
      
      // Load fresh data from database
      await loadData(true);
      toast.success('Data refreshed successfully', { id: toastId });
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to refresh data', { id: toastId });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based access control
  if (authLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner large"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Show error state if data loading failed
  if (error) {
    return (
      <div className="admin-dashboard-wrapper">
        <AdminHeader 
          user={user}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 80px)',
          gap: '20px',
          color: 'var(--text-primary)'
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2>Failed to Load Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
          <button 
            onClick={() => loadData()} 
            style={{
              padding: '12px 24px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'map':
        return (
          <IndiaMapPage 
            projects={dashboardData.projects}
            loading={loading}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        );
      case 'analytics':
        return <AnalyticsPage data={dashboardData} />;
      case 'users':
        return <UsersPage />;
      case 'reports':
        return <ReportsPage data={dashboardData} />;
      default:
        return (
          <div className="admin-dashboard-content fade-in">
            {/* Stats Overview */}
            <StatsCards data={dashboardData} loading={loading} />

            {/* Quick Actions Bar */}
            <QuickActions 
              reviewCount={dashboardData.reviewProjects}
              pendingCount={dashboardData.pendingProjects}
              approvedCount={dashboardData.approvedProjects}
              rejectedCount={dashboardData.rejectedProjects}
              onRefresh={handleRefresh}
              hasData={dashboardData.totalProjects > 0}
              dashboardData={dashboardData}
            />

            {/* Main Content Grid - Map + Activity Feed */}
            <div className="admin-main-grid">
              {/* Left: Map Section */}
              <div className="admin-map-section">
                <div className="section-header">
                  <h2 className="section-title">Project Locations</h2>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                    {dashboardData.totalProjects} projects
                  </span>
                </div>
                <div className="map-container-wrapper">
                  <MapSection 
                    projects={dashboardData.projects}
                    loading={loading}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                    onActionComplete={() => loadData(true)}
                  />
                </div>
              </div>

              {/* Right: Activity Feed */}
              <div className="admin-activity-section">
                <div className="section-header">
                  <h2 className="section-title">Activity Feed</h2>
                </div>
                <ActivityFeed 
                  activities={dashboardData.activityFeed}
                  loading={loading}
                />
              </div>
            </div>

            {/* Bottom: Projects Table */}
            <div className="admin-projects-section">
              <ProjectsTable 
                projects={dashboardData.projects}
                loading={loading}
                onProjectSelect={setSelectedProject}
                onActionComplete={() => loadData(true)}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminHeader 
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      {renderPage()}
    </div>
  );
};

export default AdminDashboard;
