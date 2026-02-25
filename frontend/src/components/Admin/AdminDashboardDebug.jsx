import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Simplified Admin Dashboard for Debugging
 * Use this to identify what's causing the black screen
 */
const AdminDashboardDebug = () => {
  const { user, loading: authLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('🔍 Debug: Component mounted');
    console.log('🔍 Debug: User:', user);
    console.log('🔍 Debug: Auth Loading:', authLoading);

    setDebugInfo({
      user: user,
      isAdmin: user?.role === 'admin',
      timestamp: new Date().toISOString()
    });
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0a1628',
        color: 'white',
        gap: '20px'
      }}>
        <div className="spinner large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    console.log('🔍 Debug: Not admin, redirecting');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a1628',
      color: 'white',
      padding: '40px'
    }}>
      <h1 style={{ marginBottom: '20px' }}>🔍 Admin Dashboard Debug</h1>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>User Information</h2>
        <pre style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Debug Info</h2>
        <pre style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2>Status Checks</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Component Rendered</li>
          <li>{user ? '✅' : '❌'} User Loaded</li>
          <li>{user?.role === 'admin' ? '✅' : '❌'} Admin Role</li>
          <li>✅ CSS Applied (you can see this text)</li>
        </ul>
      </div>

      <button
        onClick={() => window.location.href = '/dashboard'}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Go to Regular Dashboard
      </button>
    </div>
  );
};

export default AdminDashboardDebug;
