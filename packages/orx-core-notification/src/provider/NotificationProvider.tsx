/**
 * Notification Provider Component
 * Following Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP)
 */

import React, {useMemo, useCallback} from 'react';

import NotificationContext from '../context/NotificationContext';
import {NotificationContainer} from '../components/NotificationContainer';
import {useNotificationState} from '../hooks/useNotificationState';
import {NotificationContextValue, NotificationOptions} from '../types';

export interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({children}) => {
  const {notifications, addNotification, removeNotification, clearAll} = useNotificationState();

  const showNotification = useCallback(
    (message: React.ReactNode, options?: NotificationOptions): string => {
      return addNotification(message, options);
    },
    [addNotification]
  );

  const showSuccess = useCallback(
    (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string => {
      return addNotification(message, {...options, severity: 'success'});
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string => {
      return addNotification(message, {...options, severity: 'error'});
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string => {
      return addNotification(message, {...options, severity: 'warning'});
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string => {
      return addNotification(message, {...options, severity: 'info'});
    },
    [addNotification]
  );

  const closeNotification = useCallback(
    (id: string) => {
      removeNotification(id);
    },
    [removeNotification]
  );

  const closeAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      closeNotification,
      closeAll,
      notifications
    }),
    [showNotification, showSuccess, showError, showWarning, showInfo, closeNotification, closeAll, notifications]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer notifications={notifications} onClose={closeNotification} />
    </NotificationContext.Provider>
  );
};
