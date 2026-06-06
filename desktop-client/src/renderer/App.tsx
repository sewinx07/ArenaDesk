import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import SessionTimer from './components/SessionTimer';
import { checkAuth } from '../services/auth';
import { connectSocket, disconnectSocket, onConnectionChange, isConnected } from '../services/socket';
import { ping } from '../services/api';

declare global {
  interface Window {
    electronAPI?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      removeListener: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export interface UserData {
  staff: { id: string; name: string; role: string; avatar?: string };
  venue: { id: string; name: string; branch?: string };
  token: string;
}

export interface ActiveSession {
  id: string;
  pcId: string;
  startTime: string;
  elapsed: number;
  cost: number;
  ratePerHour: number;
}

type AppState = 'LOCKED' | 'AUTH' | 'SESSION_ACTIVE' | 'DISCONNECTED';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LOCKED');
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkOnline, setNetworkOnline] = useState(true);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const healthIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (appState === 'LOCKED') {
      const tryAutoLogin = async () => {
        try {
          const stored = await checkAuth();
          if (stored) {
            setUser({
              staff: stored.staff,
              venue: stored.venue,
              token: stored.token,
            });
            setAppState('SESSION_ACTIVE');
          }
        } catch {
        } finally {
          setLoading(false);
        }
      };
      tryAutoLogin();
    }
  }, [appState]);

  useEffect(() => {
    const unsub = onConnectionChange((connected) => {
      setNetworkOnline(connected);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (appState === 'SESSION_ACTIVE' && user) {
      connectSocket(user.token, user.venue.id);

      healthIntervalRef.current = setInterval(async () => {
        const online = await ping();
        setNetworkOnline(online);
      }, 30000);

      window.electronAPI?.invoke('pc:lockStateChange', false);

      return () => {
        if (healthIntervalRef.current) {
          clearInterval(healthIntervalRef.current);
          healthIntervalRef.current = null;
        }
      };
    }
  }, [appState, user]);

  useEffect(() => {
    const handleLockState = (_event: any, locked: boolean) => {
      if (locked) {
        setAppState(prev => prev === 'DISCONNECTED' ? prev : 'LOCKED');
        setUser(null);
        setActiveSession(null);
        disconnectSocket();
      }
    };

    const handleAutoLock = () => {
      setAppState('LOCKED');
      setUser(null);
      setActiveSession(null);
      disconnectSocket();
    };

    const handleConnectionLost = () => {
      setAppState('DISCONNECTED');
      setActiveSession(null);
      disconnectSocket();
    };

    const handleConnectionRestored = () => {
      setAppState('LOCKED');
    };

    const handleNavigate = (_event: any, view: string) => {
    };

    window.electronAPI?.on('pc:lockState', handleLockState);
    window.electronAPI?.on('pc:autoLock', handleAutoLock);
    window.electronAPI?.on('pc:connectionLost', handleConnectionLost);
    window.electronAPI?.on('connection:restored', handleConnectionRestored);
    window.electronAPI?.on('navigate', handleNavigate);

    return () => {
      window.electronAPI?.removeListener('pc:lockState', handleLockState);
      window.electronAPI?.removeListener('pc:autoLock', handleAutoLock);
      window.electronAPI?.removeListener('pc:connectionLost', handleConnectionLost);
      window.electronAPI?.removeListener('connection:restored', handleConnectionRestored);
      window.electronAPI?.removeListener('navigate', handleNavigate);
    };
  }, []);

  const handleLogin = useCallback((userData: UserData) => {
    setUser(userData);
    setAppState('SESSION_ACTIVE');
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      if (activeSession) {
        await window.electronAPI?.invoke('session:end', activeSession.id);
      }
    } catch {
    }
    setUser(null);
    setActiveSession(null);
    setAppState('LOCKED');
    disconnectSocket();
    window.electronAPI?.invoke('pc:lockStateChange', true);
  }, [activeSession]);

  const handleSessionStart = useCallback((session: ActiveSession) => {
    setActiveSession(session);
    setAppState('SESSION_ACTIVE');
  }, []);

  const handleSessionEnd = useCallback(() => {
    setActiveSession(null);
    setAppState('LOCKED');
    window.electronAPI?.invoke('pc:lockStateChange', true);
  }, []);

  if (appState === 'DISCONNECTED') {
    return (
      <div className="disconnected-overlay">
        <div className="disconnected-glow" />
        <div className="disconnected-content">
          <div className="disconnected-icon">
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#EF4444" />
              <path d="M14 14L34 34M34 14L14 34" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="disconnected-title">Connection Lost</h1>
          <p className="disconnected-subtitle">PC is locked for security</p>
          <div className="reconnecting-spinner" />
          <p className="disconnected-status">Reconnecting...</p>
          <p className="disconnected-hint">Connection will resume automatically</p>
        </div>
      </div>
    );
  }

  if (appState === 'LOCKED') {
    return (
      <div className="lock-screen">
        <div className="lock-screen-glow" />
        <div className="lock-screen-content">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none" style={{ marginBottom: '16px' }}>
            <rect width="48" height="48" rx="12" fill="#8B5CF6" />
            <path d="M14 24L22 32L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="lock-screen-title">ArenaDesk OS</h1>
          <p className="lock-screen-subtitle">PC is locked</p>
          <div className="lock-screen-pcname" id="pc-name">
            {window.electronAPI ? 'Loading...' : 'Local PC'}
          </div>
          <button
            className="lock-screen-button"
            onClick={() => setAppState('AUTH')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Click to Start
          </button>
          <p className="lock-screen-hint">Ask staff to unlock this PC</p>
          {!networkOnline && (
            <div className="network-offline-badge">Offline - Connect to server</div>
          )}
        </div>
      </div>
    );
  }

  if (appState === 'AUTH' && !user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      user={user!}
      onLogout={handleLogout}
      activeSession={activeSession}
      onSessionStart={handleSessionStart}
      onSessionEnd={handleSessionEnd}
      networkOnline={networkOnline}
    />
  );
};

export default App;
