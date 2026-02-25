import React, { useState } from 'react';
import { FiFileText, FiDownload, FiCalendar, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { downloadCSV, generatePDF } from '../../../services/reportService';
import './AdminPages.css';

const ReportsPage = ({ data }) => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('30days');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleGenerateReport = () => {
    if (data.totalProjects === 0) {
      toast.error('No data available to generate report');
      return;
    }
    
    if (!data.projects || !Array.isArray(data.projects)) {
      toast.error('Project data not loaded properly');
      console.error('Data structure:', data);
      return;
    }
    
    try {
      console.log('Generating report with:', {
        reportType,
        totalProjects: data.totalProjects,
        projectsCount: data.projects.length,
        filters: { status: statusFilter, dateRange }
      });
      
      const filters = {
        status: statusFilter,
        dateRange: dateRange
      };
      
      generatePDF(data, filters, reportType);
      toast.success(`Opening ${reportType} report in new window...`);
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error(error.message || 'Failed to generate report');
    }
  };

  const handleExportCSV = () => {
    if (data.totalProjects === 0) {
      toast.error('No data available to export');
      return;
    }
    
    if (!data.projects || !Array.isArray(data.projects)) {
      toast.error('Project data not loaded properly');
      console.error('Data structure:', data);
      return;
    }
    
    try {
      console.log('Exporting CSV with:', {
        totalProjects: data.totalProjects,
        projectsCount: data.projects.length,
        filters: { status: statusFilter, dateRange }
      });
      
      const filters = {
        status: statusFilter,
        dateRange: dateRange
      };
      
      downloadCSV(data.projects, filters, `bcr-${reportType}-report`);
      toast.success('CSV file downloaded successfully!');
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error(error.message || 'Failed to export CSV');
    }
  };

  const handleExportPDF = () => {
    handleGenerateReport();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1><FiFileText /> Reports & Export</h1>
        <p>Generate comprehensive reports and export data</p>
      </div>

      <div className="page-content">
        {/* Report Configuration */}
        <div className="report-config-card">
          <h3>Report Configuration</h3>
          
          <div className="config-grid">
            <div className="config-item">
              <label>Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Project Report</option>
                <option value="financial">Financial Report</option>
                <option value="environmental">Environmental Impact Report</option>
                <option value="statewise">State-wise Analysis</option>
              </select>
            </div>

            <div className="config-item">
              <label><FiCalendar /> Date Range</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="config-item">
              <label><FiFilter /> Status Filter</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="APPROVED">Approved Only</option>
                <option value="REJECTED">Rejected Only</option>
              </select>
            </div>
          </div>

          <div className="action-buttons-group">
            <button className="btn-primary" onClick={handleGenerateReport}>
              <FiFileText /> Generate Report
            </button>
            <button className="btn-secondary" onClick={handleExportCSV}>
              <FiDownload /> Export CSV
            </button>
            <button className="btn-secondary" onClick={handleExportPDF}>
              <FiDownload /> Export PDF
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="report-preview-card">
          <h3>Report Preview - {reportType.charAt(0).toUpperCase() + reportType.slice(1)}</h3>
          
          {data.totalProjects === 0 ? (
            <div className="preview-empty">
              <FiFileText size={60} />
              <p>No data available for report generation</p>
              <span>Reports will be available once projects are submitted</span>
            </div>
          ) : (
            <div className="report-summary">
              <div className="summary-section">
                <h4>Project Statistics</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Total Projects</span>
                    <span className="value">{data.totalProjects}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Pending Review</span>
                    <span className="value pending">{data.pendingProjects + data.reviewProjects}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Approved</span>
                    <span className="value approved">{data.approvedProjects}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Rejected</span>
                    <span className="value rejected">{data.rejectedProjects}</span>
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h4>Environmental Impact</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Total Area Restored</span>
                    <span className="value">{data.totalArea.toFixed(2)} hectares</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">CO₂ Sequestered</span>
                    <span className="value">{data.totalCarbon.toFixed(1)} tons</span>
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h4>Recent Projects</h4>
                <div className="recent-projects-list">
                  {data.projects.slice(0, 5).map((project) => (
                    <div key={project._id} className="project-item">
                      <span className="project-id">{project.projectId || 'N/A'}</span>
                      <span className="project-location">{project.location?.state}</span>
                      <span className="project-area">{project.restoration?.areaHectares || 0} ha</span>
                      <span className={`project-status ${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
