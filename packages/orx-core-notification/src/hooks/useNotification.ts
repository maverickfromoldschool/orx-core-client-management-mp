/**
 * Notification Hook
 * Public API for consuming notifications
 * Following Open/Closed Principle (OCP) - Open for extension, closed for modification
 */

import {useNotificationContext} from '../context/NotificationContext';
import {NotificationContextValue} from '../types';

export const useNotification = (): NotificationContextValue => {
  return useNotificationContext();
};
