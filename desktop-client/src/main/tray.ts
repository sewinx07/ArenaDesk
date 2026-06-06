import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';

let tray: Tray | null = null;
let pcStatus: 'locked' | 'active' | 'offline' = 'locked';

export function createTray(mainWindow: BrowserWindow | null): void {
  const iconPath = path.join(__dirname, '../../public/icon.png');
  let trayIcon: nativeImage;

  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      trayIcon = nativeImage.createEmpty();
    }
  } catch {
    trayIcon = nativeImage.createEmpty();
  }

  const resizedIcon = trayIcon.resize({ width: 16, height: 16 });
  tray = new Tray(resizedIcon);
  tray.setToolTip('ArenaDesk OS Desktop');

  updateTrayMenu(mainWindow);

  tray.on('double-click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

export function updateTrayStatus(status: 'locked' | 'active' | 'offline'): void {
  pcStatus = status;
  updateTrayMenu(require('electron').BrowserWindow.getAllWindows()[0] || null);
}

function updateTrayMenu(mainWindow: BrowserWindow | null): void {
  if (!tray) return;

  const statusIcons: Record<string, string> = {
    locked: '🔒',
    active: '🟢',
    offline: '🔴',
  };

  tray.setToolTip(`ArenaDesk OS [${statusIcons[pcStatus] || pcStatus}]`);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `${statusIcons[pcStatus]} PC Status: ${pcStatus.charAt(0).toUpperCase() + pcStatus.slice(1)}`,
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Show Window',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: 'Hide Window',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Force Lock This PC',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('pc:lockState', true);
          mainWindow.webContents.send('pc:connectionLost', true);
        }
      },
    },
    {
      label: 'Quick Lock All PCs',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('action:lockAll');
        }
      },
    },
    {
      label: 'View Active Sessions',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send('navigate', 'sessions');
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Dashboard',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send('navigate', 'dashboard');
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
