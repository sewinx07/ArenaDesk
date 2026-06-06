import React from 'react';
import PCCard from './PCCard';

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

interface PCGridProps {
  pcs: PC[];
  selectedPcId?: string;
  onSelectPc: (pc: PC | null) => void;
  onLock: (pcId: string) => void;
  onUnlock: (pcId: string) => void;
  onStartSession: (pcId: string) => void;
}

const PCGrid: React.FC<PCGridProps> = ({ pcs, selectedPcId, onSelectPc, onLock, onUnlock, onStartSession }) => {
  const available = pcs.filter(p => p.status === 'available').length;
  const inUse = pcs.filter(p => p.status === 'in_use').length;
  const offline = pcs.filter(p => p.status === 'offline' || p.status === 'maintenance').length;

  if (pcs.length === 0) {
    return (
      <div className="pc-grid-empty">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h3>No PCs Found</h3>
        <p>No gaming stations match your current filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="status-summary-bar">
        <span className="summary-item available">
          <span className="summary-dot" /> Available: {available}
        </span>
        <span className="summary-item in-use">
          <span className="summary-dot" /> In Use: {inUse}
        </span>
        <span className="summary-item offline">
          <span className="summary-dot" /> Offline: {offline}
        </span>
        <span className="summary-total">Total: {pcs.length}</span>
      </div>
      <div className="pc-grid">
        {pcs.map((pc) => (
          <PCCard
            key={pc.id}
            pc={pc}
            isSelected={pc.id === selectedPcId}
            onSelect={() => onSelectPc(pc)}
            onLock={() => onLock(pc.id)}
            onUnlock={() => onUnlock(pc.id)}
            onStartSession={() => onStartSession(pc.id)}
          />
        ))}
      </div>
    </>
  );
};

export default PCGrid;
