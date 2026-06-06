import api, { setAuthToken, getAuthToken } from './api';
import { connectSocket, disconnectSocket } from './socket';

export interface AuthCredentials {
  venueCode: string;
  staffCode: string;
  password: string;
}

export interface PinCredentials {
  pin: string;
  pcId: string;
}

export interface AuthResponse {
  token: string;
  staff: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  venue: {
    id: string;
    name: string;
    branch?: string;
  };
  pc?: {
    id: string;
    name: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  staff: AuthResponse['staff'] | null;
  venue: AuthResponse['venue'] | null;
  loading: boolean;
  error: string | null;
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  const data = response.data;

  setAuthToken(data.token);
  localStorage.setItem('venueId', data.venue.id);
  localStorage.setItem('staffId', data.staff.id);
  localStorage.setItem('staffName', data.staff.name);
  localStorage.setItem('staffRole', data.staff.role);
  localStorage.setItem('venueName', data.venue.name);

  connectSocket(data.token, data.venue.id);

  return data;
}

export async function loginWithPin(credentials: PinCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/pin-login', credentials);
  const data = response.data;

  setAuthToken(data.token);
  localStorage.setItem('venueId', data.venue.id);
  localStorage.setItem('staffId', data.staff.id);
  localStorage.setItem('staffName', data.staff.name);
  localStorage.setItem('staffRole', data.staff.role);
  localStorage.setItem('venueName', data.venue.name);

  connectSocket(data.token, data.venue.id);

  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
  } finally {
    setAuthToken(null);
    localStorage.removeItem('venueId');
    localStorage.removeItem('staffId');
    localStorage.removeItem('staffName');
    localStorage.removeItem('staffRole');
    localStorage.removeItem('venueName');
    disconnectSocket();
  }
}

export async function checkAuth(): Promise<AuthResponse | null> {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const response = await api.get<AuthResponse>('/auth/me');
    const data = response.data;

    localStorage.setItem('venueId', data.venue.id);
    localStorage.setItem('staffId', data.staff.id);
    localStorage.setItem('staffName', data.staff.name);
    localStorage.setItem('staffRole', data.staff.role);
    localStorage.setItem('venueName', data.venue.name);

    connectSocket(data.token, data.venue.id);

    return data;
  } catch {
    setAuthToken(null);
    return null;
  }
}

export function getStoredAuth(): { staffName: string; venueName: string; role: string } | null {
  const staffName = localStorage.getItem('staffName');
  const venueName = localStorage.getItem('venueName');
  const role = localStorage.getItem('staffRole');

  if (staffName && venueName && role) {
    return { staffName, venueName, role };
  }
  return null;
}
