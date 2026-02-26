/**
 * Notification State Hook
 * Following Single Responsibility Principle (SRP) - State management logic
 */

import {useState, useCallback} from 'react';

import {Notification, NotificationOptions} from '../types';
import {NotificationFactory} from '../utils/notification-factory';
import {MAX_NOTIFICATIONS} from '../constants';

export interface UseNotificationStateReturn {
  notifications: Notification[];
  addNotification: (message: React.ReactNode, options?: NotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationState = (): UseNotificationStateReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: React.ReactNode, options?: NotificationOptions): string => {
    const notification = NotificationFactory.create(message, options);

    setNotifications((prev) => {
      const updated = [...prev, notification];

      // Limit the number of notifications displayed
      if (updated.length > MAX_NOTIFICATIONS) {
        return updated.slice(-MAX_NOTIFICATIONS);
      }

      return updated;
    });

    return notification.id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
};
