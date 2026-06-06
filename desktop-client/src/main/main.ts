import { app, BrowserWindow, ipcMain, screen, nativeImage, Menu, powerMonitor, globalShortcut } from 'electron';
import * as path from 'path';
import { setupIpcHandlers } from './ipc-handlers';
import { createTray } from './tray';
import Store from 'electron-store';
import axios from 'axios';

const store = new Store({
  defaults: {
    windowBounds: { width: 1280, height: 800 },
    windowPosition: null as { x: number; y: number } | null,
    autoLaunch: true,
    authToken: null as string | null,
    venueId: null as string | null,
    staffId: null as string | null,
    kioskMode: false,
    backendUrl: 'http://localhost:3001/api',
  },
});

let mainWindow: BrowserWindow | null = null;
let idleTimer: ReturnType<typeof setInterval> | null = null;
let isLocked = true;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let failedHeartbeats = 0;
let isConnected = true;
const MAX_FAILED_HEARTBEATS = 3;

function createWindow(): void {
  const kioskMode = store.get('kioskMode') as boolean;
  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.workAreaSize;

  mainWindow = new BrowserWindow({
    width: kioskMode ? screenWidth : 1280,
    height: kioskMode ? screenHeight : 800,
    x: 0,
    y: 0,
    fullscreen: kioskMode,
    frame: !kioskMode,
    backgroundColor: '#0F0F1A',
    icon: path.join(__dirname, '../../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, '../renderer/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
    autoHideMenuBar: true,
  });

  if (kioskMode) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setKiosk(true);
  }

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    applyLockOverlay();
  });

  mainWindow.on('close', (e) => {
    if (isLocked) {
      e.preventDefault();
    }
    if (mainWindow) {
      const [winWidth, winHeight] = mainWindow.getSize();
      const [winX, winY] = mainWindow.getPosition();
      store.set('windowBounds', { width: winWidth, height: winHeight });
      store.set('windowPosition', { x: winX, y: winY });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('before-input-event', (_e, input) => {
    if (input.alt && input.key === 'F4') {
      if (isLocked) {
        _e.preventDefault();
      }
    }
  });
}

function applyLockOverlay(): void {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.webContents.send('pc:lockState', true);
  }
}

function removeLockOverlay(): void {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.webContents.send('pc:lockState', false);
  }
}

async function sendHeartbeat(): Promise<void> {
  const pcId = store.get('currentPcId') as string | null;
  const token = store.get('authToken') as string | null;
  if (!pcId || !token) return;
  try {
    const backendUrl = store.get('backendUrl') as string || 'http://localhost:3001/api';
    await axios.post(`${backendUrl}/pcs/${pcId}/heartbeat`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });
    failedHeartbeats = 0;
    if (!isConnected) {
      isConnected = true;
      mainWindow?.webContents.send('connection:restored');
    }
  } catch {
    failedHeartbeats++;
    if (failedHeartbeats >= MAX_FAILED_HEARTBEATS && isConnected) {
      isConnected = false;
      if (!isLocked) {
        isLocked = true;
        applyLockOverlay();
        mainWindow?.webContents.send('pc:lockState', true);
        mainWindow?.webContents.send('pc:connectionLost', true);
      }
    }
  }
}

function startHeartbeat(): void {
  if (heartbeatTimer) return;
  sendHeartbeat();
  heartbeatTimer = setInterval(sendHeartbeat, 5000);
}

function stopHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  failedHeartbeats = 0;
}

app.on('browser-window-focus', () => {
  if (mainWindow && isLocked) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
  }
});

function startIdleMonitor(): void {
  if (idleTimer) clearInterval(idleTimer);
  idleTimer = setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    if (idleTime > 300 && !isLocked) {
      mainWindow?.webContents.send('pc:autoLock');
    }
  }, 10000);
}

function stopIdleMonitor(): void {
  if (idleTimer) {
    clearInterval(idleTimer);
    idleTimer = null;
  }
}

function setupPowerMonitor(): void {
  powerMonitor.on('lock-screen', () => {
    isLocked = true;
    applyLockOverlay();
    mainWindow?.webContents.send('pc:lockState', true);
  });

  powerMonitor.on('unlock-screen', () => {
    if (isLocked) {
      applyLockOverlay();
    }
  });

  powerMonitor.on('suspend', () => {
    mainWindow?.webContents.send('system:suspend');
  });

  powerMonitor.on('resume', () => {
    mainWindow?.webContents.send('system:resume');
  });
}

function hideMenu(): void {
  const emptyMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(emptyMenu);
}

function setupAutoLaunch(): void {
  const autoLaunch = store.get('autoLaunch') as boolean;
  app.setLoginItemSettings({
    openAtLogin: autoLaunch,
    path: process.execPath,
  });
}

function registerGlobalShortcuts(): void {
  globalShortcut.register('Alt+F4', () => {
    if (isLocked) return;
  });
}

app.whenReady().then(() => {
  setupAutoLaunch();
  hideMenu();
  setupIpcHandlers(store);
  createWindow();
  createTray(mainWindow);
  setupPowerMonitor();
  startIdleMonitor();
  registerGlobalShortcuts();

  ipcMain.handle('pc:lockStateChange', async (_event, locked: boolean) => {
    isLocked = locked;
    isConnected = true;
    failedHeartbeats = 0;
    if (locked) {
      applyLockOverlay();
      stopHeartbeat();
    } else {
      removeLockOverlay();
      startHeartbeat();
    }
    return { success: true };
  });

  ipcMain.handle('app:getLockState', async () => {
    return { locked: isLocked };
  });

  ipcMain.handle('pc:disconnected', async () => {
    isConnected = false;
    if (!isLocked) {
      isLocked = true;
      applyLockOverlay();
      mainWindow?.webContents.send('pc:lockState', true);
      mainWindow?.webContents.send('pc:connectionLost', true);
    }
    return { success: true };
  });

  ipcMain.handle('connection:status', async () => {
    return { connected: isConnected, locked: isLocked, failedHeartbeats };
  });

  const currentPcId = store.get('currentPcId') as string | null;
  if (currentPcId) {
    startHeartbeat();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  stopIdleMonitor();
  stopHeartbeat();
});

export { mainWindow, isLocked, isConnected, applyLockOverlay, removeLockOverlay, startHeartbeat, stopHeartbeat };
