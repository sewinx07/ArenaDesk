import React, { useState, FormEvent, useEffect } from 'react';
import { login, loginWithPin, checkAuth } from '../../services/auth';
import { UserData } from '../App';

interface LoginScreenProps {
  onLogin: (userData: UserData) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'staff' | 'pin'>('staff');
  const [venueCode, setVenueCode] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const stored = await checkAuth();
        if (stored) {
          onLogin({
            staff: stored.staff,
            venue: stored.venue,
            token: stored.token,
          });
          return;
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    tryAutoLogin();
  }, [onLogin]);

  const handleStaffSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!venueCode.trim() || !staffCode.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const data = await login({
        venueCode: venueCode.trim(),
        staffCode: staffCode.trim(),
        password,
      });
      onLogin({ staff: data.staff, venue: data.venue, token: data.token });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pinCode.trim()) {
      setError('PIN code is required');
      return;
    }

    setLoading(true);
    try {
      const data = await loginWithPin({ pin: pinCode.trim(), pcId: '__self__' });
      onLogin({ staff: data.staff, venue: data.venue, token: data.token });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-glow" />
        <div className="login-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }} />
          <p style={{ color: '#94A3B8' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#8B5CF6" />
              <path d="M14 24L22 32L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>ArenaDesk OS</h1>
          <p className="login-subtitle">Desktop Client</p>
        </div>

        {mode === 'staff' ? (
          <form className="login-form" onSubmit={handleStaffSubmit}>
            <div className="form-group">
              <label htmlFor="venueCode">Venue Code</label>
              <input
                id="venueCode"
                type="text"
                value={venueCode}
                onChange={(e) => setVenueCode(e.target.value)}
                placeholder="Enter venue code"
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="staffCode">Staff Code</label>
              <input
                id="staffCode"
                type="text"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
                placeholder="Enter staff code or email"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner" />
                  Authenticating...
                </span>
              ) : (
                'Unlock PC'
              )}
            </button>

            <button type="button" className="login-mode-switch" onClick={() => { setMode('pin'); setError(''); }}>
              Use PIN Code Instead
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handlePinSubmit}>
            <div className="form-group">
              <label htmlFor="pinCode">Staff PIN Code</label>
              <input
                id="pinCode"
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Enter your PIN"
                disabled={loading}
                autoFocus
                maxLength={6}
                inputMode="numeric"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner" />
                  Authenticating...
                </span>
              ) : (
                'Unlock with PIN'
              )}
            </button>

            <button type="button" className="login-mode-switch" onClick={() => { setMode('staff'); setError(''); }}>
              Use Email & Password Instead
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>ArenaDesk OS © 2024</p>
          <p>Powered by ArenaDesk</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
