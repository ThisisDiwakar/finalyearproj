import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiFilter } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminPages.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('bcr_token');
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await axios.get(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role) => {
    const classes = {
      admin: 'role-badge admin',
      verifier: 'role-badge verifier',
      ngo: 'role-badge ngo',
      panchayat: 'role-badge panchayat',
      community: 'role-badge community',
    };
    return classes[role] || 'role-badge';
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1><FiUsers /> User Management</h1>
        <p>Manage all registered users and their roles</p>
      </div>

      <div className="page-content">
        {/* Search and Filter */}
        <div className="users-toolbar">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <FiFilter />
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="community">Community</option>
              <option value="ngo">NGO</option>
              <option value="panchayat">Panchayat</option>
              <option value="verifier">Verifier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="page-loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="page-empty">
            <FiUsers size={80} />
            <h2>No Users Found</h2>
            <p>No users match your search criteria</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Location</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="user-name">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.organization?.name || '-'}</td>
                    <td>{user.location?.state || '-'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Summary */}
        <div className="users-stats">
          <div className="stat-box">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Community</span>
            <span className="stat-value">{users.filter(u => u.role === 'community').length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">NGOs</span>
            <span className="stat-value">{users.filter(u => u.role === 'ngo').length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Panchayats</span>
            <span className="stat-value">{users.filter(u => u.role === 'panchayat').length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Admins</span>
            <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
