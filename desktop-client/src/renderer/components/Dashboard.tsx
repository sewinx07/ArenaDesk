import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import QuickActions from './QuickActions';
import PCGrid from './PCGrid';
import PCControlPanel from './PCControlPanel';
import SessionTimer from './SessionTimer';
import { UserData, ActiveSession } from '../App';
import { connectSocket, disconnectSocket, onPcStatusUpdate, onSessionUpdate, onPcUsageUpdate, emitHeartbeat } from '../../services/socket';
import { logout } from '../../services/auth';

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

interface DashboardProps {
  user: UserData;
  onLogout: () => void;
  activeSession: ActiveSession | null;
  onSessionStart: (session: ActiveSession) => void;
  onSessionEnd: () => void;
  networkOnline: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, activeSession, onSessionStart, onSessionEnd, networkOnline }) => {
  const [pcs, setPcs] = useState<PC[]>([]);
  const [selectedPc, setSelectedPc] = useState<PC | null>(null);
  const [view, setView] = useState<'dashboard' | 'sessions' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branch, setBranch] = useState(user.venue.branch || 'Main Branch');
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [heartbeatInterval, setHeartbeatInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const fetchPCs = useCallback(async () => {
    try {
      const result = await window.electronAPI?.invoke('pc:list');
      if (result?.success) {
        setPcs(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch PCs:', err);
    }
  }, []);

  const fetchSystemInfo = useCallback(async () => {
    try {
      const result = await window.electronAPI?.invoke('system:info');
      if (result?.success) {
        setSystemInfo(result.data);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    if (user.token) {
      connectSocket(user.token, user.venue.id);
      fetchPCs();
      fetchSystemInfo();
    }

    const hb = setInterval(() => {
      emitHeartbeat({
        cpu: Math.round(Math.random() * 50 + 20),
        ram: Math.round(Math.random() * 30 + 40),
        uptime: Math.floor(process.uptime()),
      });
    }, 15000);
    setHeartbeatInterval(hb);

    return () => {
      disconnectSocket();
      if (hb) clearInterval(hb);
    };
  }, [user, fetchPCs, fetchSystemInfo]);

  useEffect(() => {
    onPcStatusUpdate((data: any) => {
      setPcs((prev) =>
        prev.map((pc) =>
          pc.id === data.pcId ? { ...pc, status: data.status } : pc
        )
      );
    });

    onSessionUpdate((data: any) => {
      setPcs((prev) =>
        prev.map((pc) => {
          if (pc.id === data.pcId) {
            return {
              ...pc,
              status: data.session ? 'in_use' : 'available',
              currentSession: data.session
                ? {
                    id: data.session.id,
                    startTime: data.session.startTime,
                    elapsed: data.session.elapsed || 0,
                    cost: data.session.cost || 0,
                    ratePerHour: data.session.ratePerHour || 0,
                  }
                : undefined,
            };
          }
          return pc;
        })
      );
    });

    onPcUsageUpdate((data: any) => {
      setPcs((prev) =>
        prev.map((pc) =>
          pc.id === data.pcId
            ? { ...pc, usage: { cpu: data.cpu, ram: data.ram, gpu: data.gpu, uptime: data.uptime } }
            : pc
        )
      );
    });
  }, []);

  const handleLockPC = useCallback(async (pcId: string) => {
    const result = await window.electronAPI?.invoke('pc:lock', pcId);
    if (result?.success) {
      setPcs((prev) =>
        prev.map((pc) => (pc.id === pcId ? { ...pc, status: 'available' } : pc))
      );
    }
  }, []);

  const handleUnlockPC = useCallback(async (pcId: string) => {
    const result = await window.electronAPI?.invoke('pc:unlock', pcId);
    if (result?.success) {
      setPcs((prev) =>
        prev.map((pc) => (pc.id === pcId ? { ...pc, status: 'in_use' } : pc))
      );
    }
  }, []);

  const handleStartSession = useCallback(async (pcId: string) => {
    const result = await window.electronAPI?.invoke('session:start', pcId);
    if (result?.success) {
      const sessionData = result.data;
      onSessionStart({
        id: sessionData.id,
        pcId,
        startTime: sessionData.startTime,
        elapsed: 0,
        cost: 0,
        ratePerHour: sessionData.ratePerHour || 5,
      });
      fetchPCs();
    }
  }, [fetchPCs, onSessionStart]);

  const handleEndSession = useCallback(async (sessionId: string) => {
    const result = await window.electronAPI?.invoke('session:end', sessionId);
    if (result?.success) {
      onSessionEnd();
      fetchPCs();
    }
  }, [fetchPCs, onSessionEnd]);

  const handleExtendSession = useCallback(async () => {
    if (!activeSession) return;
    await window.electronAPI?.invoke('session:extend', {
      sessionId: activeSession.id,
      additionalMinutes: 30,
    });
  }, [activeSession]);

  const handleLockAll = useCallback(async () => {
    const result = await window.electronAPI?.invoke('pc:lockAll');
    if (result?.success) {
      fetchPCs();
    }
  }, [fetchPCs]);

  const handleLogout = useCallback(async () => {
    await logout();
    onLogout();
  }, [onLogout]);

  const filteredPCs = pcs.filter((pc) => {
    const matchesSearch =
      pc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pc.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSessions = pcs.filter((pc) => pc.status === 'in_use');

  if (activeSession) {
    return (
      <div className="session-active-view">
        <div className="session-active-header">
          <div className="session-header-left">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#8B5CF6" />
              <path d="M14 24L22 32L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <h1>ArenaDesk OS</h1>
              <p className="pc-name-display">
                {systemInfo?.hostname || 'Gaming PC'}
                {systemInfo?.cpu?.model && ` • ${systemInfo.cpu.model.split(' ').slice(0, 2).join(' ')}`}
              </p>
            </div>
          </div>
          <div className="session-header-right">
            <div className={`network-status ${networkOnline ? 'online' : 'offline'}`}>
              <span className="network-dot" />
              {networkOnline ? 'Connected' : 'Disconnected'}
            </div>
            <div className="hourly-rate">
              ${activeSession.ratePerHour.toFixed(2)}/hr
            </div>
            <div className={`network-status ${networkOnline ? 'online' : 'offline'}`}>
              <span className="network-dot" />
              {networkOnline ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>

        <div className="session-active-body">
          <SessionTimer
            startTime={activeSession.startTime}
            elapsed={activeSession.elapsed}
            cost={activeSession.cost}
            ratePerHour={activeSession.ratePerHour}
          />

          <div className="session-stats-row">
            <div className="stat-card">
              <div className="stat-label">CPU</div>
              <div className="stat-value">{systemInfo?.cpu?.usage || 0}%</div>
              <div className="usage-bar-track large">
                <div className="usage-bar-fill" style={{ width: `${systemInfo?.cpu?.usage || 0}%` }} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">RAM</div>
              <div className="stat-value">{Math.round(systemInfo?.memory?.usagePercent || 0)}%</div>
              <div className="usage-bar-track large">
                <div className="usage-bar-fill" style={{ width: `${systemInfo?.memory?.usagePercent || 0}%`, background: '#06B6D4' }} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Uptime</div>
              <div className="stat-value">{Math.floor((systemInfo?.uptime || 0) / 3600)}h</div>
              <div className="usage-bar-track large">
                <div className="usage-bar-fill" style={{ width: `${Math.min(100, ((systemInfo?.uptime || 0) / 86400) * 100)}%`, background: '#10B981' }} />
              </div>
            </div>
          </div>

          <div className="session-actions">
            <button className="btn btn-danger btn-extend" onClick={() => handleEndSession(activeSession.id)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              End Session
            </button>
            <button className="btn btn-primary" onClick={handleExtendSession}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Extend Time (+30min)
            </button>
            <button className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Report Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar
        user={user}
        view={view}
        onViewChange={setView}
        onLogout={handleLogout}
        branch={branch}
        onBranchChange={setBranch}
        activeSessions={activeSessions.length}
      />

      <div className="dashboard-main">
        {view === 'dashboard' && (
          <>
            <QuickActions
              onLockAll={handleLockAll}
              onRefresh={fetchPCs}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              activeSessions={activeSessions.length}
              networkOnline={networkOnline}
            />

            <div className="dashboard-content">
              <div className={`pc-section ${selectedPc ? 'with-panel' : ''}`}>
                <PCGrid
                  pcs={filteredPCs}
                  selectedPcId={selectedPc?.id}
                  onSelectPc={setSelectedPc}
                  onLock={handleLockPC}
                  onUnlock={handleUnlockPC}
                  onStartSession={handleStartSession}
                />
              </div>

              {selectedPc && (
                <PCControlPanel
                  pc={selectedPc}
                  onClose={() => setSelectedPc(null)}
                  onLock={handleLockPC}
                  onUnlock={handleUnlockPC}
                  onStartSession={handleStartSession}
                  onEndSession={handleEndSession}
                />
              )}
            </div>
          </>
        )}

        {view === 'sessions' && (
          <div className="sessions-view">
            <h2>Active Sessions ({activeSessions.length})</h2>
            <div className="sessions-list">
              {activeSessions.map((pc) => (
                <div key={pc.id} className="session-card">
                  <div className="session-card-header">
                    <h3>{pc.name}</h3>
                    <span className="status-badge in-use">Active</span>
                  </div>
                  {pc.currentSession && (
                    <div className="session-card-details">
                      <p>Started: {new Date(pc.currentSession.startTime).toLocaleTimeString()}</p>
                      <p>Elapsed: {Math.floor(pc.currentSession.elapsed / 60)}m {pc.currentSession.elapsed % 60}s</p>
                      <p>Cost: ${pc.currentSession.cost.toFixed(2)}</p>
                    </div>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => pc.currentSession && handleEndSession(pc.currentSession.id)}
                  >
                    End Session
                  </button>
                </div>
              ))}
              {activeSessions.length === 0 && (
                <div className="empty-state">
                  <p>No active sessions</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="settings-view">
            <h2>Settings</h2>
            <div className="settings-section">
              <h3>Account</h3>
              <p><strong>Staff:</strong> {user.staff.name}</p>
              <p><strong>Role:</strong> {user.staff.role}</p>
              <p><strong>Venue:</strong> {user.venue.name}</p>
            </div>
            <div className="settings-section">
              <h3>Application</h3>
              <p>ArenaDesk OS Desktop v1.0.0</p>
              <p>Auto-launch on startup</p>
            </div>
            <div className="settings-section">
              <h3>Network</h3>
              <p>Backend: {localStorage.getItem('backendUrl') || 'http://localhost:3001'}</p>
              <p>Status: <span style={{ color: networkOnline ? '#10B981' : '#EF4444' }}>
                {networkOnline ? 'Connected' : 'Disconnected'}
              </span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
