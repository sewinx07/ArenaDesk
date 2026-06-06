import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let API_BASE_URL = localStorage.getItem('backendUrl') || 'http://localhost:3001/api';

interface PendingRequest {
  config: any;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  retryCount: number;
}

let pendingQueue: PendingRequest[] = [];
let isOnline = navigator.onLine;
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!navigator.onLine && config.method !== 'get') {
      return queueRequest(config);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('venueId');
      localStorage.removeItem('staffId');
      window.location.reload();
      return Promise.reject(error);
    }

    if (!error.response && error.config && error.config.retryCount < MAX_RETRIES) {
      const retryCount = (error.config.retryCount || 0) + 1;
      const delay = BASE_DELAY * Math.pow(2, retryCount - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      error.config.retryCount = retryCount;
      return api.request(error.config);
    }

    return Promise.reject(error);
  }
);

function queueRequest(config: any): Promise<any> {
  return new Promise((resolve, reject) => {
    pendingQueue.push({ config, resolve, reject, retryCount: 0 });
  });
}

export function processPendingQueue(): void {
  if (!navigator.onLine) return;
  const queue = [...pendingQueue];
  pendingQueue = [];
  queue.forEach(async (item) => {
    try {
      const result = await api.request(item.config);
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    }
  });
}

window.addEventListener('online', () => {
  isOnline = true;
  processPendingQueue();
});

window.addEventListener('offline', () => {
  isOnline = false;
});

export function setBaseUrl(url: string): void {
  API_BASE_URL = url;
  api.defaults.baseURL = url;
  localStorage.setItem('backendUrl', url);
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export async function ping(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
}

export async function sendHeartbeat(pcId: string): Promise<boolean> {
  try {
    await api.post(`/pcs/${pcId}/heartbeat`);
    return true;
  } catch {
    return false;
  }
}

export async function forceLock(pcId: string): Promise<boolean> {
  try {
    await api.post(`/pcs/${pcId}/lock`);
    return true;
  } catch {
    return false;
  }
}

export default api;
