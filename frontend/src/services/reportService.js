/**
 * Report Generation Service
 * Handles CSV export, PDF generation, and report formatting
 */

/**
 * Convert projects data to CSV format
 */
export const generateCSV = (projects, filters = {}) => {
  if (!projects || !Array.isArray(projects)) {
    console.error('Invalid projects data:', projects);
    throw new Error('Invalid project data provided');
  }

  if (projects.length === 0) {
    throw new Error('No data available to export');
  }

  console.log('Generating CSV from', projects.length, 'projects');

  // Filter projects based on filters
  let filteredProjects = filterProjects(projects, filters);
  
  console.log('Filtered to', filteredProjects.length, 'projects');

  if (filteredProjects.length === 0) {
    throw new Error('No projects match the selected filters');
  }

  // CSV Headers
  const headers = [
    'Project ID',
    'Project Name',
    'Status',
    'State',
    'District',
    'Village',
    'Area (hectares)',
    'CO2 Sequestered (tons)',
    'Submitted By',
    'Email',
    'Organization',
    'Submitted Date',
    'Latitude',
    'Longitude'
  ];

  // Convert data to CSV rows
  const rows = filteredProjects.map(project => {
    // Helper function to safely get nested values
    const safeGet = (obj, path, defaultValue = 'N/A') => {
      try {
        const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
        return value !== undefined && value !== null ? value : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    return [
      safeGet(project, 'projectId'),
      safeGet(project, 'projectName'),
      safeGet(project, 'status'),
      safeGet(project, 'location.state'),
      safeGet(project, 'location.district'),
      safeGet(project, 'location.village'),
      safeGet(project, 'restoration.areaHectares', 0).toFixed ? safeGet(project, 'restoration.areaHectares', 0).toFixed(2) : '0.00',
      safeGet(project, 'carbon.estimatedCO2e', 0).toFixed ? safeGet(project, 'carbon.estimatedCO2e', 0).toFixed(2) : '0.00',
      safeGet(project, 'submittedBy.name'),
      safeGet(project, 'submittedBy.email'),
      safeGet(project, 'submittedBy.organization'),
      project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A',
      safeGet(project, 'location.latitude'),
      safeGet(project, 'location.longitude')
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape quotes and wrap in quotes
      const cellStr = String(cell).replace(/"/g, '""');
      return `"${cellStr}"`;
    }).join(','))
  ].join('\n');

  console.log('CSV generated successfully, size:', csvContent.length, 'bytes');
  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCSV = (projects, filters = {}, filename = 'projects-report') => {
  try {
    // Validate input
    if (!projects || !Array.isArray(projects)) {
      console.error('Invalid projects data:', projects);
      throw new Error('Invalid project data provided');
    }

    if (projects.length === 0) {
      throw new Error('No projects available to export');
    }

    console.log('Generating CSV for', projects.length, 'projects with filters:', filters);
    
    const csvContent = generateCSV(projects, filters);
    
    // Add BOM for UTF-8 encoding (helps with Excel)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    console.log('CSV download initiated successfully');
    return true;
  } catch (error) {
    console.error('CSV download error:', error);
    throw error;
  }
};

/**
 * Generate PDF report (using browser print)
 */
export const generatePDF = (data, filters = {}, reportType = 'summary') => {
  try {
    // Validate input
    if (!data || !data.projects) {
      console.error('Invalid data structure:', data);
      throw new Error('Invalid data provided for PDF generation');
    }

    if (!Array.isArray(data.projects)) {
      console.error('Projects is not an array:', data.projects);
      throw new Error('Invalid projects data');
    }

    if (data.projects.length === 0) {
      throw new Error('No projects available to generate report');
    }

    console.log('Generating PDF for', data.projects.length, 'projects');
    
    // Filter projects
    const filteredProjects = filterProjects(data.projects, filters);
    
    console.log('Filtered to', filteredProjects.length, 'projects');
    
    if (filteredProjects.length === 0) {
      throw new Error('No projects match the selected filters');
    }
    
    // Calculate filtered stats
    const stats = calculateFilteredStats(filteredProjects);
    
    // Create a new window with the report content
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      throw new Error('Please allow popups to generate PDF reports');
    }

    // Generate HTML content based on report type
    const htmlContent = generateReportHTML(reportType, stats, filteredProjects, filters);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
    
    console.log('PDF generation initiated successfully');
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

/**
 * Filter projects based on criteria
 */
const filterProjects = (projects, filters) => {
  if (!projects) return [];
  
  let filtered = [...projects];
  
  // Status filter
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'pending_review') {
      filtered = filtered.filter(p => 
        p.status === 'SUBMITTED' || 
        p.status === 'DRAFT' || 
        p.status === 'UNDER_REVIEW' || 
        p.status === 'REVIEW'
      );
    } else {
      filtered = filtered.filter(p => p.status === filters.status);
    }
  }
  
  // Date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    const daysMap = {
      '7days': 7,
      '30days': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365
    };
    
    const days = daysMap[filters.dateRange];
    if (days) {
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(p => new Date(p.createdAt) >= cutoffDate);
    }
  }
  
  return filtered;
};

/**
 * Calculate statistics for filtered projects
 */
const calculateFilteredStats = (projects) => {
  const totalProjects = projects.length;
  const pendingProjects = projects.filter(p => 
    p.status === 'SUBMITTED' || p.status === 'DRAFT'
  ).length;
  const reviewProjects = projects.filter(p => 
    p.status === 'UNDER_REVIEW' || p.status === 'REVIEW'
  ).length;
  const approvedProjects = projects.filter(p => 
    p.status === 'APPROVED' || p.status === 'MINTED'
  ).length;
  const rejectedProjects = projects.filter(p => 
    p.status === 'REJECTED'
  ).length;
  
  const totalArea = projects.reduce((sum, p) => 
    sum + (p.restoration?.areaHectares || 0), 0
  );
  const totalCarbon = projects.reduce((sum, p) => 
    sum + (p.carbon?.estimatedCO2e || 0), 0
  );
  
  const states = new Set(projects.map(p => p.location?.state).filter(Boolean));
  
  return {
    totalProjects,
    pendingProjects,
    reviewProjects,
    approvedProjects,
    rejectedProjects,
    totalArea: totalArea.toFixed(2),
    totalCarbon: totalCarbon.toFixed(2),
    statesCount: states.size
  };
};

/**
 * Generate HTML content for PDF report
 */
const generateReportHTML = (reportType, stats, projects, filters) => {
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Blue Carbon Registry - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #00E0B8;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0a1628;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header .subtitle {
          color: #666;
          font-size: 16px;
        }
        .meta-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .meta-item {
          font-size: 14px;
        }
        .meta-item strong {
          color: #0a1628;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          padding: 20px;
          background: #f9f9f9;
          border-left: 4px solid #00E0B8;
          border-radius: 4px;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #0a1628;
        }
        .section-title {
          font-size: 20px;
          color: #0a1628;
          margin: 30px 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e0e0;
        }
        .projects-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 12px;
        }
        .projects-table th {
          background: #0a1628;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
        }
        .projects-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #e0e0e0;
        }
        .projects-table tr:nth-child(even) {
          background: #f9f9f9;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-submitted { background: #e3f2fd; color: #1976d2; }
        .status-pending { background: #fff3e0; color: #f57c00; }
        .status-review { background: #f3e5f5; color: #7b1fa2; }
        .status-approved { background: #e8f5e9; color: #388e3c; }
        .status-rejected { background: #ffebee; color: #d32f2f; }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        @media print {
          body { padding: 20px; }
          .stat-card { break-inside: avoid; }
          .projects-table { page-break-inside: auto; }
          .projects-table tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Blue Carbon Registry</h1>
        <div class="subtitle">${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</div>
      </div>
      
      <div class="meta-info">
        <div class="meta-item">
          <strong>Report Date:</strong> ${reportDate}
        </div>
        <div class="meta-item">
          <strong>Report Type:</strong> ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}
        </div>
        <div class="meta-item">
          <strong>Total Projects:</strong> ${stats.totalProjects}
        </div>
        <div class="meta-item">
          <strong>Date Range:</strong> ${filters.dateRange || 'All Time'}
        </div>
      </div>
      
      <h2 class="section-title">Project Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Projects</div>
          <div class="stat-value">${stats.totalProjects}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending Review</div>
          <div class="stat-value">${stats.pendingProjects + stats.reviewProjects}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Approved</div>
          <div class="stat-value">${stats.approvedProjects}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Rejected</div>
          <div class="stat-value">${stats.rejectedProjects}</div>
        </div>
      </div>
      
      <h2 class="section-title">Environmental Impact</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Area Restored</div>
          <div class="stat-value">${stats.totalArea} ha</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">CO₂ Sequestered</div>
          <div class="stat-value">${stats.totalCarbon} tons</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">States Covered</div>
          <div class="stat-value">${stats.statesCount}</div>
        </div>
      </div>
      
      <h2 class="section-title">Project Details</h2>
      <table class="projects-table">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>State</th>
            <th>Area (ha)</th>
            <th>CO₂ (tons)</th>
            <th>Submitted By</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${projects.slice(0, 50).map(project => `
            <tr>
              <td>${project.projectId || 'N/A'}</td>
              <td>${project.location?.state || 'N/A'}</td>
              <td>${project.restoration?.areaHectares?.toFixed(2) || '0.00'}</td>
              <td>${project.carbon?.estimatedCO2e?.toFixed(1) || '0.0'}</td>
              <td>${project.submittedBy?.name || 'N/A'}</td>
              <td>${new Date(project.createdAt).toLocaleDateString()}</td>
              <td><span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${projects.length > 50 ? `<p style="text-align: center; color: #666; font-style: italic;">Showing first 50 of ${projects.length} projects</p>` : ''}
      
      <div class="footer">
        <p>Blue Carbon Registry - Coastal Ecosystem Restoration Platform</p>
        <p>Generated on ${reportDate}</p>
      </div>
    </body>
    </html>
  `;
};

export default {
  generateCSV,
  downloadCSV,
  generatePDF
};
