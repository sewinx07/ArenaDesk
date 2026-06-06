'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { toast } from '@/components/ui/toast';
import type { Notification } from '@/types';

export function useNotifications() {
  const { subscribe, isConnected } = useSocket({ autoConnect: true });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsub = subscribe('notification:new', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      switch (notification.type) {
        case 'success':
          toast.success(notification.title, { description: notification.message });
          break;
        case 'error':
          toast.error(notification.title, { description: notification.message });
          break;
        case 'warning':
          toast.warning(notification.title, { description: notification.message });
          break;
        default:
          toast.info(notification.title, { description: notification.message });
      }
    });

    return () => {
      unsub();
    };
  }, [subscribe]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
