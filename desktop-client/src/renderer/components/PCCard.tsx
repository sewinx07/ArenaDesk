import React from 'react';
import SessionTimer from './SessionTimer';

interface PC {
  id: string;
  name: string;
  label: string;
  status: 'available' | 'in_use' | 'maintenance' | 'offline';
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
    storage: string;
  };
  currentSession?: {
    id: string;
    startTime: string;
    elapsed: number;
    cost: number;
    ratePerHour: number;
  };
  usage?: {
    cpu: number;
    ram: number;
    gpu: number;
    uptime: number;
  };
}

interface PCCardProps {
  pc: PC;
  isSelected: boolean;
  onSelect: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onStartSession: () => void;
}

const statusConfig: Record<string, { label: string; className: string; glowColor: string }> = {
  available: { label: 'Available', className: 'status-available', glowColor: '#10B981' },
  in_use: { label: 'In Use', className: 'status-in-use', glowColor: '#06B6D4' },
  maintenance: { label: 'Maintenance', className: 'status-maintenance', glowColor: '#F59E0B' },
  offline: { label: 'Offline', className: 'status-offline', glowColor: '#EF4444' },
};

const PCCard: React.FC<PCCardProps> = ({ pc, isSelected, onSelect, onLock, onUnlock, onStartSession }) => {
  const status = statusConfig[pc.status] || statusConfig.offline;
  const usageColor = pc.usage
    ? pc.usage.cpu > 80 || pc.usage.ram > 80
      ? '#F59E0B'
      : pc.usage.cpu > 50 || pc.usage.ram > 50
        ? '#06B6D4'
        : '#10B981'
    : undefined;

  return (
    <div
      className={`pc-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div
        className="pc-card-glow"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${status.glowColor}15 0%, transparent 70%)`,
        }}
      />
      <div className="pc-card-header">
        <div className="pc-card-info">
          <h3 className="pc-name">{pc.name}</h3>
          <span className="pc-label">{pc.label}</span>
        </div>
        <div className={`status-indicator ${status.className}`} style={{ boxShadow: `0 0 12px ${status.glowColor}40` }}>
          <span className="status-dot" style={{ background: status.glowColor, boxShadow: `0 0 8px ${status.glowColor}` }} />
          <span className="status-text">{status.label}</span>
        </div>
      </div>

      <div className="pc-card-specs">
        <div className="spec-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
          </svg>
          <span>{pc.specs.cpu}</span>
        </div>
        <div className="spec-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01" />
          </svg>
          <span>{pc.specs.ram}</span>
        </div>
        <div className="spec-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>{pc.specs.gpu}</span>
        </div>
      </div>

      {pc.currentSession && (
        <SessionTimer
          startTime={pc.currentSession.startTime}
          elapsed={pc.currentSession.elapsed}
          cost={pc.currentSession.cost}
          ratePerHour={pc.currentSession.ratePerHour}
          compact
        />
      )}

      {pc.usage && (
        <div className="pc-usage-bars">
          <div className="usage-bar-row">
            <span className="usage-label">CPU</span>
            <div className="usage-bar-track">
              <div
                className="usage-bar-fill"
                style={{ width: `${pc.usage.cpu}%`, backgroundColor: usageColor }}
              />
            </div>
            <span className="usage-value">{pc.usage.cpu}%</span>
          </div>
          <div className="usage-bar-row">
            <span className="usage-label">RAM</span>
            <div className="usage-bar-track">
              <div
                className="usage-bar-fill"
                style={{ width: `${pc.usage.ram}%`, backgroundColor: usageColor }}
              />
            </div>
            <span className="usage-value">{pc.usage.ram}%</span>
          </div>
        </div>
      )}

      <div className="pc-card-actions">
        {pc.status === 'available' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => { e.stopPropagation(); onStartSession(); }}
            style={{ boxShadow: `0 0 12px #8B5CF640` }}
          >
            Start Session
          </button>
        )}
        {pc.status === 'in_use' && (
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => { e.stopPropagation(); onLock(); }}
          >
            Lock PC
          </button>
        )}
        {(pc.status === 'maintenance' || pc.status === 'offline') && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={(e) => { e.stopPropagation(); onUnlock(); }}
          >
            Set Available
          </button>
        )}
      </div>
    </div>
  );
};

export default PCCard;
