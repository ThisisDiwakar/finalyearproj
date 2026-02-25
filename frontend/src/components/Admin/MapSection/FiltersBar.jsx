import React from 'react';
import { FiFilter } from 'react-icons/fi';
import './FiltersBar.css';

const FiltersBar = ({ filters, setFilters, projects, data }) => {
  // Extract unique states from projects
  const states = [...new Set(projects.map(p => p.location?.state).filter(Boolean))];

  // Calculate counts for each status
  const pendingReviewCount = (data?.pendingProjects || 0) + (data?.reviewProjects || 0);
  const approvedCount = data?.approvedProjects || 0;
  const rejectedCount = data?.rejectedProjects || 0;

  return (
    <div className="filters-bar">
      <div className="filter-label">
        <FiFilter />
        Filters
      </div>

      <button
        className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
        onClick={() => setFilters({ ...filters, status: 'all' })}
      >
        All
      </button>

      <button
        className={`filter-btn pending ${filters.status === 'PENDING_REVIEW' ? 'active' : ''}`}
        onClick={() => setFilters({ ...filters, status: 'PENDING_REVIEW' })}
      >
        Pending Review <span className="filter-count">{pendingReviewCount}</span>
      </button>

      <button
        className={`filter-btn approved ${filters.status === 'APPROVED' ? 'active' : ''}`}
        onClick={() => setFilters({ ...filters, status: 'APPROVED' })}
      >
        Approved <span className="filter-count">{approvedCount}</span>
      </button>

      <button
        className={`filter-btn rejected ${filters.status === 'REJECTED' ? 'active' : ''}`}
        onClick={() => setFilters({ ...filters, status: 'REJECTED' })}
      >
        Rejected <span className="filter-count">{rejectedCount}</span>
      </button>

      <select
        value={filters.state}
        onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        className="filter-select"
      >
        <option value="all">All States</option>
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <select
        value={filters.timeRange || '30'}
        onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
        className="filter-select"
      >
        <option value="7">7 Days</option>
        <option value="30">30 Days</option>
        <option value="90">90 Days</option>
        <option value="all">All Time</option>
      </select>

      <button className="filter-btn-action">Apply</button>
      <button className="filter-btn-action">More</button>

      {(filters.status !== 'all' || filters.state !== 'all') && (
        <button
          className="clear-filters"
          onClick={() => setFilters({ status: 'all', state: 'all', timeRange: '30' })}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FiltersBar;
