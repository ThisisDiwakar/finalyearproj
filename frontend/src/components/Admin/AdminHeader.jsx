import { FiMap, FiBarChart2, FiUsers, FiFileText, FiLogOut } from 'react-icons/fi';
import './AdminHeader.css';

const AdminHeader = ({ user, currentPage, setCurrentPage, onLogout }) => {
  return (
    <header className="admin-header-new">
      <div className="admin-header-container">
        {/* Logo & Title */}
        <div className="admin-logo-section">
          <div className="logo-icon-new">🌊</div>
          <span className="logo-text-new">Blue Carbon Registry</span>
        </div>

        {/* Navigation */}
        <nav className="admin-nav-new">
          <button
            className={`nav-item-new ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <FiBarChart2 size={16} />
            Dashboard
          </button>
          <button
            className={`nav-item-new ${currentPage === 'map' ? 'active' : ''}`}
            onClick={() => setCurrentPage('map')}
          >
            <FiMap size={16} />
            India Map
          </button>
          <button
            className={`nav-item-new ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
          >
            <FiBarChart2 size={16} />
            Analytics
          </button>
          <button
            className={`nav-item-new ${currentPage === 'users' ? 'active' : ''}`}
            onClick={() => setCurrentPage('users')}
          >
            <FiUsers size={16} />
            Users
          </button>
          <button
            className={`nav-item-new ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reports')}
          >
            <FiFileText size={16} />
            Reports
          </button>
        </nav>

        {/* Right Section */}
        <div className="admin-header-actions">
          <div className="admin-user-section">
            <div className="admin-avatar-new">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{user?.name || 'Admin'}</span>
              <span className="admin-user-role">ADMIN</span>
            </div>
          </div>

          <button className="logout-btn-new" onClick={onLogout} title="Logout">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
