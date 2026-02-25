import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminDashboardDebug from './components/Admin/AdminDashboardDebug';
import ProjectSubmission from './components/Project/ProjectSubmission';
import ProjectList from './components/Project/ProjectList';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', flexDirection: 'column', gap: '16px'
      }}>
        <div className="spinner large"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin-only Route wrapper
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', flexDirection: 'column', gap: '16px'
      }}>
        <div className="spinner large"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Guest Route (redirect to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home / Landing Page — accessible to everyone */}
        <Route path="/" element={<Home />} />

        {/* Public / Guest Routes */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/debug"
          element={
            <AdminRoute>
              <AdminDashboardDebug />
            </AdminRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <ProjectSubmission />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <div className="page-wrapper">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
                  📂 All My Projects
                </h2>
                <ProjectList />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
