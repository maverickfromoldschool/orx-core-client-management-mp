/**
 * Notification Context
 * Following Dependency Inversion Principle (DIP) - High-level modules depend on abstractions
 */

import {createContext, useContext} from 'react';

import {NotificationContextValue} from '../types';

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotificationContext = (): NotificationContextValue => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider. ' +
        'Make sure your component is wrapped with <NotificationProvider>.'
    );
  }

  return context;
};

export default NotificationContext;
