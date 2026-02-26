/**
 * Notification Container Component
 * Following Single Responsibility Principle (SRP) - Managing notification display
 */

import React from 'react';
import {Snackbar, Stack} from '@mui/material';

import {Notification} from '../types';
import {NOTIFICATION_TRANSITION_DURATION} from '../constants';

import {NotificationItem} from './NotificationItem';

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({notifications, onClose}) => {
  if (notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications[notifications.length - 1];
  const position = latestNotification?.options?.position;
  if (!position) {
    return null;
  }

  return (
    <Snackbar
      open={notifications.length > 0}
      anchorOrigin={position}
      TransitionProps={{
        timeout: NOTIFICATION_TRANSITION_DURATION
      }}
      sx={{
        position: 'fixed',
        zIndex: 9999
      }}
    >
      <Stack spacing={1} sx={{width: '100%'}}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
        ))}
      </Stack>
    </Snackbar>
  );
};
