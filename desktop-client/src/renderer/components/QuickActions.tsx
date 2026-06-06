import React from 'react';

interface QuickActionsProps {
  onLockAll: () => void;
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  activeSessions: number;
  networkOnline?: boolean;
}

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'In Use', value: 'in_use' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Offline', value: 'offline' },
];

const QuickActions: React.FC<QuickActionsProps> = ({
  onLockAll,
  onRefresh,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  activeSessions,
  networkOnline,
}) => {
  return (
    <div className="quick-actions">
      <div className="quick-actions-left">
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search PCs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-tab ${statusFilter === filter.value ? 'active' : ''}`}
              onClick={() => onStatusFilterChange(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="quick-actions-right">
        <div className={`connection-indicator ${networkOnline !== false ? 'online' : 'offline'}`}>
          <span className={`connection-dot ${networkOnline !== false ? 'online' : 'offline'}`} />
          <span>{networkOnline !== false ? 'Connected' : 'Disconnected'}</span>
        </div>

        <div className="active-sessions-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{activeSessions} Active</span>
        </div>

        <button className="btn btn-danger btn-sm" onClick={onLockAll} title="Lock all PCs">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Lock All
        </button>

        <button className="btn btn-secondary btn-sm" onClick={onRefresh} title="Refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
