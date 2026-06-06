import { ipcMain, app } from 'electron';
import * as os from 'os';
import Store from 'electron-store';
import axios, { AxiosInstance } from 'axios';

let backendBaseUrl = 'http://localhost:3001/api';

interface AuthResponse {
  token: string;
  staff: { id: string; name: string; role: string };
  venue: { id: string; name: string };
}

interface SessionResponse {
  id: string;
  pcId: string;
  startTime: string;
  endTime?: string;
  cost: number;
  status: string;
  ratePerHour?: number;
}

interface LockUnlockResponse {
  success: boolean;
  status: string;
}

let currentAuthToken: string | null = null;
let currentVenueId: string | null = null;
let currentPcId: string | null = null;

function getApiClient(): AxiosInstance {
  return axios.create({
    baseURL: backendBaseUrl,
    headers: currentAuthToken ? { Authorization: `Bearer ${currentAuthToken}` } : {},
    timeout: 10000,
  });
}

export function setupIpcHandlers(store: Store): void {
  const savedUrl = store.get('backendUrl') as string | undefined;
  if (savedUrl) backendBaseUrl = savedUrl;

  ipcMain.handle('auth:login', async (_event, credentials: { venueCode: string; staffCode: string; password: string }) => {
    try {
      const response = await axios.post<AuthResponse>(`${backendBaseUrl}/auth/login`, credentials);
      const data = response.data;
      currentAuthToken = data.token;
      currentVenueId = data.venue.id;
      store.set('authToken', data.token);
      store.set('venueId', data.venue.id);
      store.set('staffId', data.staff.id);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  });

  ipcMain.handle('auth:logout', async () => {
    try {
      if (currentAuthToken) {
        await getApiClient().post('/auth/logout');
      }
    } catch {
    } finally {
      currentAuthToken = null;
      currentVenueId = null;
      currentPcId = null;
      store.set('authToken', null);
      store.set('venueId', null);
      store.set('staffId', null);
      store.set('currentPcId', null);
    }
    return { success: true };
  });

  ipcMain.handle('auth:check', async () => {
    const token = store.get('authToken') as string | null;
    if (token) {
      currentAuthToken = token;
      currentVenueId = store.get('venueId') as string;
      return { authenticated: true, token, venueId: currentVenueId };
    }
    return { authenticated: false };
  });

  ipcMain.handle('pc:list', async () => {
    try {
      const response = await getApiClient().get<{ pcs: any[] }>(`/venues/${currentVenueId}/pcs`);
      return { success: true, data: response.data.pcs };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch PCs' };
    }
  });

  ipcMain.handle('pc:lock', async (_event, pcId: string) => {
    try {
      const response = await getApiClient().post<LockUnlockResponse>(`/pcs/${pcId}/lock`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to lock PC' };
    }
  });

  ipcMain.handle('pc:unlock', async (_event, pcId: string) => {
    try {
      const response = await getApiClient().post<LockUnlockResponse>(`/pcs/${pcId}/unlock`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to unlock PC' };
    }
  });

  ipcMain.handle('pc:lockAll', async () => {
    try {
      const response = await getApiClient().post<{ success: boolean }>(`/venues/${currentVenueId}/pcs/lock-all`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to lock all PCs' };
    }
  });

  ipcMain.handle('pc:status', async (_event, pcId: string) => {
    try {
      const response = await getApiClient().get<{ pc: any }>(`/pcs/${pcId}`);
      return { success: true, data: response.data.pc };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to get PC status' };
    }
  });

  ipcMain.handle('pc:heartbeat', async (_event, pcId: string) => {
    try {
      const response = await getApiClient().post(`/pcs/${pcId}/heartbeat`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Heartbeat failed' };
    }
  });

  ipcMain.handle('pc:forceLock', async (_event, pcId: string) => {
    try {
      const response = await getApiClient().post<LockUnlockResponse>(`/pcs/${pcId}/lock`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to force lock PC' };
    }
  });

  ipcMain.handle('session:start', async (_event, pcId: string) => {
    try {
      const response = await getApiClient().post<SessionResponse>(`/sessions/start`, {
        pcId,
        venueId: currentVenueId,
      });
      currentPcId = pcId;
      store.set('currentPcId', pcId);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to start session' };
    }
  });

  ipcMain.handle('session:end', async (_event, sessionId: string) => {
    try {
      const response = await getApiClient().post<SessionResponse>(`/sessions/${sessionId}/end`);
      currentPcId = null;
      store.set('currentPcId', null);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to end session' };
    }
  });

  ipcMain.handle('session:extend', async (_event, data: { sessionId: string; additionalMinutes: number }) => {
    try {
      const response = await getApiClient().post<SessionResponse>(`/sessions/${data.sessionId}/extend`, {
        additionalMinutes: data.additionalMinutes,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to extend session' };
    }
  });

  ipcMain.handle('session:active', async () => {
    try {
      const response = await getApiClient().get<{ sessions: any[] }>(`/venues/${currentVenueId}/sessions/active`);
      return { success: true, data: response.data.sessions };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch active sessions' };
    }
  });

  ipcMain.handle('system:info', async () => {
    try {
      const cpu = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const uptime = os.uptime();

      return {
        success: true,
        data: {
          platform: os.platform(),
          hostname: os.hostname(),
          cpu: {
            model: cpu[0]?.model || 'Unknown',
            cores: cpu.length,
            usage: await getCpuUsage(),
          },
          memory: {
            total: totalMem,
            free: freeMem,
            used: totalMem - freeMem,
            usagePercent: ((totalMem - freeMem) / totalMem) * 100,
          },
          uptime,
          osVersion: os.release(),
          display: {
            width: require('electron').screen.getPrimaryDisplay().workAreaSize.width,
            height: require('electron').screen.getPrimaryDisplay().workAreaSize.height,
          },
        },
      };
    } catch (error: any) {
      return { success: false, error: 'Failed to get system info' };
    }
  });

  ipcMain.handle('settings:get', async (_event, key: string) => {
    return { value: store.get(key) };
  });

  ipcMain.handle('settings:set', async (_event, data: { key: string; value: any }) => {
    store.set(data.key, data.value);
    if (data.key === 'autoLaunch') {
      app.setLoginItemSettings({
        openAtLogin: !!data.value,
        path: process.execPath,
      });
    }
    if (data.key === 'backendUrl') {
      backendBaseUrl = data.value;
    }
    return { success: true };
  });

  ipcMain.handle('window:minimize', () => {
    const win = require('electron').BrowserWindow.getFocusedWindow();
    if (win) win.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    const win = require('electron').BrowserWindow.getFocusedWindow();
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.handle('window:close', () => {
    const win = require('electron').BrowserWindow.getFocusedWindow();
    if (win) win.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    const win = require('electron').BrowserWindow.getFocusedWindow();
    return win?.isMaximized() || false;
  });

  ipcMain.handle('system:shutdown', async () => {
    try {
      const { exec } = require('child_process');
      if (process.platform === 'win32') {
        exec('shutdown /s /t 5');
      } else if (process.platform === 'darwin') {
        exec('sudo shutdown -h now');
      } else {
        exec('shutdown -h now');
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}

async function getCpuUsage(): Promise<number> {
  const startMeasure = os.cpus().map(c => ({ idle: c.times.idle, total: c.times.user + c.times.nice + c.times.sys + c.times.idle + c.times.irq }));

  return new Promise((resolve) => {
    setTimeout(() => {
      const endMeasure = os.cpus().map((c, i) => ({
        idle: c.times.idle,
        total: c.times.user + c.times.nice + c.times.sys + c.times.idle + c.times.irq,
      }));

      const idleDiffs = endMeasure.map((e, i) => e.idle - startMeasure[i].idle);
      const totalDiffs = endMeasure.map((e, i) => e.total - startMeasure[i].total);
      const avgUsage = totalDiffs.reduce((sum, t, i) => sum + (1 - idleDiffs[i] / (t || 1)), 0) / totalDiffs.length;
      resolve(Math.round(avgUsage * 100));
    }, 100);
  });
}
