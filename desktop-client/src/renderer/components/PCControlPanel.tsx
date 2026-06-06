import React from 'react';
import UsageChart from './UsageChart';
import SessionTimer from './SessionTimer';
import { format } from 'date-fns';

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

interface PCControlPanelProps {
  pc: PC;
  onClose: () => void;
  onLock: (pcId: string) => void;
  onUnlock: (pcId: string) => void;
  onStartSession: (pcId: string) => void;
  onEndSession: (sessionId: string) => void;
}

const PCControlPanel: React.FC<PCControlPanelProps> = ({ pc, onClose, onLock, onUnlock, onStartSession, onEndSession }) => {
  return (
    <div className="pc-control-panel">
      <div className="panel-header">
        <div className="panel-header-info">
          <h2>{pc.name}</h2>
          <span className="pc-label">{pc.label}</span>
        </div>
        <button className="btn-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="panel-status-section">
        <div className={`status-badge ${pc.status}`}>
          <span className="status-dot" />
          {pc.status === 'available' && 'Available'}
          {pc.status === 'in_use' && 'In Use'}
          {pc.status === 'maintenance' && 'Maintenance'}
          {pc.status === 'offline' && 'Offline'}
        </div>
      </div>

      <div className="panel-specs">
        <h3>Specifications</h3>
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">CPU</span>
            <span className="spec-value">{pc.specs.cpu}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">RAM</span>
            <span className="spec-value">{pc.specs.ram}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">GPU</span>
            <span className="spec-value">{pc.specs.gpu}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Storage</span>
            <span className="spec-value">{pc.specs.storage}</span>
          </div>
        </div>
      </div>

      {pc.currentSession && (
        <div className="panel-session">
          <h3>Active Session</h3>
          <SessionTimer
            startTime={pc.currentSession.startTime}
            elapsed={pc.currentSession.elapsed}
            cost={pc.currentSession.cost}
            ratePerHour={pc.currentSession.ratePerHour}
          />
          <button
            className="btn btn-danger btn-full"
            onClick={() => onEndSession(pc.currentSession!.id)}
          >
            End Session
          </button>
        </div>
      )}

      {pc.usage && (
        <div className="panel-usage">
          <h3>Real-Time Usage</h3>
          <div className="usage-bars-large">
            <div className="usage-bar-group">
              <div className="usage-bar-header">
                <span>CPU</span>
                <span>{pc.usage.cpu}%</span>
              </div>
              <div className="usage-bar-track large">
                <div
                  className="usage-bar-fill"
                  style={{ width: `${pc.usage.cpu}%` }}
                />
              </div>
            </div>
            <div className="usage-bar-group">
              <div className="usage-bar-header">
                <span>RAM</span>
                <span>{pc.usage.ram}%</span>
              </div>
              <div className="usage-bar-track large">
                <div
                  className="usage-bar-fill"
                  style={{ width: `${pc.usage.ram}%` }}
                />
              </div>
            </div>
            <div className="usage-bar-group">
              <div className="usage-bar-header">
                <span>GPU</span>
                <span>{pc.usage.gpu}%</span>
              </div>
              <div className="usage-bar-track large">
                <div
                  className="usage-bar-fill"
                  style={{ width: `${pc.usage.gpu}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <UsageChart pcId={pc.id} />

      <div className="panel-actions">
        {pc.status === 'available' && (
          <button
            className="btn btn-primary btn-full"
            onClick={() => onStartSession(pc.id)}
          >
            Start Session
          </button>
        )}
        {pc.status === 'in_use' && (
          <button
            className="btn btn-warning btn-full"
            onClick={() => onLock(pc.id)}
          >
            Lock PC
          </button>
        )}
        {(pc.status === 'maintenance' || pc.status === 'offline') && (
          <button
            className="btn btn-secondary btn-full"
            onClick={() => onUnlock(pc.id)}
          >
            Set Available
          </button>
        )}
      </div>
    </div>
  );
};

export default PCControlPanel;
