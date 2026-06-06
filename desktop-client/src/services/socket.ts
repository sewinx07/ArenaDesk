import { io, Socket } from 'socket.io-client';

const DEFAULT_SOCKET_URL = 'http://localhost:3001';

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_DELAY = 30000;
let connectionListeners: Array<(connected: boolean) => void> = [];
let heartbeatEmitTimer: ReturnType<typeof setInterval> | null = null;
let disconnectLockTriggered = false;

export function connectSocket(token: string, venueId: string, url?: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  const socketUrl = url || DEFAULT_SOCKET_URL;
  reconnectAttempts = 0;

  socket = io(socketUrl, {
    auth: { token },
    query: { venueId, pcId: '__self__' },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: MAX_RECONNECT_DELAY,
    randomizationFactor: 0.5,
    timeout: 20000,
  });

  socket.on('connect', () => {
    reconnectAttempts = 0;
    disconnectLockTriggered = false;
    connectionListeners.forEach(cb => cb(true));
    startHeartbeatEmit();
  });

  socket.on('disconnect', (reason) => {
    connectionListeners.forEach(cb => cb(false));
    stopHeartbeatEmit();
    if (!disconnectLockTriggered) {
      disconnectLockTriggered = true;
      window.electronAPI?.invoke('pc:disconnected');
    }
    if (reason === 'io server disconnect') {
      setTimeout(() => socket?.connect(), 1000);
    }
  });

  socket.on('connect_error', () => {
    reconnectAttempts++;
    connectionListeners.forEach(cb => cb(false));
    stopHeartbeatEmit();
    if (!disconnectLockTriggered) {
      disconnectLockTriggered = true;
      window.electronAPI?.invoke('pc:disconnected');
    }
  });

  socket.on('session:started', (data: any) => {
    socket?.emit('pc:heartbeat', { pcId: '__self__', timestamp: Date.now() });
  });

  socket.on('session:ended', () => {
    socket?.emit('pc:heartbeat', { pcId: '__self__', timestamp: Date.now() });
  });

  socket.on('pc:locked', () => {
    connectionListeners.forEach(cb => cb(false));
  });

  socket.on('pc:unlocked', () => {
    connectionListeners.forEach(cb => cb(true));
  });

  socket.on('system:maintenance', (data: any) => {
    if (data.action === 'shutdown') {
      window.electronAPI?.invoke('system:shutdown');
    }
  });

  return socket;
}

function startHeartbeatEmit(): void {
  stopHeartbeatEmit();
  heartbeatEmitTimer = setInterval(() => {
    socket?.emit('heartbeat', { pcId: '__self__', timestamp: Date.now() });
  }, 5000);
}

function stopHeartbeatEmit(): void {
  if (heartbeatEmitTimer) {
    clearInterval(heartbeatEmitTimer);
    heartbeatEmitTimer = null;
  }
}

export function disconnectSocket(): void {
  stopHeartbeatEmit();
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  connectionListeners = [];
  disconnectLockTriggered = false;
}

export function getSocket(): Socket | null {
  return socket;
}

export function emitHeartbeat(data: { cpu: number; ram: number; uptime: number }): void {
  socket?.emit('pc:heartbeat', {
    pcId: '__self__',
    timestamp: Date.now(),
    ...data,
  });
}

export function emitUsageReport(data: any): void {
  socket?.emit('usage:report', {
    pcId: '__self__',
    timestamp: Date.now(),
    ...data,
  });
}

export function emitSessionExtend(sessionId: string, additionalMinutes: number): void {
  socket?.emit('session:extend', { sessionId, additionalMinutes });
}

export function onConnectionChange(callback: (connected: boolean) => void): () => void {
  connectionListeners.push(callback);
  return () => {
    connectionListeners = connectionListeners.filter(cb => cb !== callback);
  };
}

export function isConnected(): boolean {
  return socket?.connected || false;
}

export function onPcStatusUpdate(callback: (data: any) => void): void {
  socket?.on('pc:statusUpdate', callback);
}

export function onSessionUpdate(callback: (data: any) => void): void {
  socket?.on('session:update', callback);
}

export function onPcUsageUpdate(callback: (data: any) => void): void {
  socket?.on('pc:usageUpdate', callback);
}

export function removeAllListeners(): void {
  socket?.removeAllListeners();
}
