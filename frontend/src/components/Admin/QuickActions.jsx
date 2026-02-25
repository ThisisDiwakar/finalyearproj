import React from 'react';
import { FiRefreshCw, FiFileText, FiDownload, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { downloadCSV, generatePDF } from '../../services/reportService';
import './QuickActions.css';

const QuickActions = ({ reviewCount, onRefresh, hasData, pendingCount, approvedCount, rejectedCount, dashboardData }) => {
  const [filters, setFilters] = React.useState({
    status: 'all',
    timeRange: '30days',
  });

  // Combine pending and review counts
  const pendingReviewCount = (pendingCount || 0) + (reviewCount || 0);

  const handleGenerateReport = () => {
    if (!hasData) {
      toast.error('No data available to generate report');
      return;
    }
    
    if (!dashboardData || !dashboardData.projects) {
      toast.error('Dashboard data not loaded properly');
      console.error('Dashboard data:', dashboardData);
      return;
    }
    
    try {
      console.log('Generating report with data:', {
        totalProjects: dashboardData.totalProjects,
        projectsCount: dashboardData.projects?.length,
        filters
      });
      
      const reportFilters = {
        status: filters.status,
        dateRange: filters.timeRange
      };
      
      generatePDF(dashboardData, reportFilters, 'summary');
      toast.success('Opening report in new window...');
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error(error.message || 'Failed to generate report');
    }
  };

  const handleExportCSV = () => {
    if (!hasData) {
      toast.error('No data available to export');
      return;
    }
    
    if (!dashboardData || !dashboardData.projects) {
      toast.error('Dashboard data not loaded properly');
      console.error('Dashboard data:', dashboardData);
      return;
    }
    
    try {
      console.log('Exporting CSV with data:', {
        totalProjects: dashboardData.totalProjects,
        projectsCount: dashboardData.projects?.length,
        filters
      });
      
      const reportFilters = {
        status: filters.status,
        dateRange: filters.timeRange
      };
      
      downloadCSV(dashboardData.projects, reportFilters, 'bcr-dashboard-export');
      toast.success('CSV file downloaded successfully!');
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error(error.message || 'Failed to export CSV');
    }
  };

  const handleApplyFilters = () => {
    toast.success('Filters applied');
  };

  return (
    <div className="quick-actions-bar">
      <div className="filter-section">
        <div className="filter-label">
          <FiFilter size={14} />
        </div>
        
        <button className={`filter-chip ${filters.status === 'all' ? 'active' : ''}`}>
          All
        </button>
        <button className={`filter-chip pending ${pendingReviewCount > 0 ? 'has-count' : ''}`}>
          Pending Review
          {pendingReviewCount > 0 && <span className="chip-badge">{pendingReviewCount}</span>}
        </button>
        <button className={`filter-chip approved ${approvedCount > 0 ? 'has-count' : ''}`}>
          Approved
          {approvedCount > 0 && <span className="chip-badge">{approvedCount}</span>}
        </button>
        <button className={`filter-chip rejected ${rejectedCount > 0 ? 'has-count' : ''}`}>
          Rejected
          {rejectedCount > 0 && <span className="chip-badge">{rejectedCount}</span>}
        </button>
      </div>

      <div className="action-buttons">
        <button 
          className="action-btn-new"
          onClick={handleGenerateReport}
          disabled={!hasData}
        >
          <FiFileText size={16} />
          Generate Report
        </button>

        <button 
          className="action-btn-new"
          onClick={handleExportCSV}
          disabled={!hasData}
        >
          <FiDownload size={16} />
          Export CSV
        </button>

        <button 
          className="action-btn-new refresh-btn"
          onClick={onRefresh}
        >
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
