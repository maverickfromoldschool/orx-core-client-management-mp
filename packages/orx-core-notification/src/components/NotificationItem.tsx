/**
 * Notification Item Component
 * Following Single Responsibility Principle (SRP) - Rendering individual notification
 */

import React, {useEffect} from 'react';
import {Alert, IconButton, Button, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

import {Notification} from '../types';

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const severityIcons = {
  success: <CheckCircleIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />
};

export const NotificationItem: React.FC<NotificationItemProps> = ({notification, onClose}) => {
  const {id, message, options} = notification;

  useEffect(() => {
    if (options.autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, options.autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [id, options.autoHideDuration, onClose]);

  const handleClose = () => {
    onClose(id);
  };

  const action = (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
      {options.action && (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            options.action?.onClick();
            handleClose();
          }}
        >
          {options.action.label}
        </Button>
      )}
      {options.closeable && (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Alert
      severity={options.severity}
      icon={options.icon ?? severityIcons[options.severity]}
      action={action}
      sx={{
        width: '100%',
        minWidth: 300,
        maxWidth: 500,
        boxShadow: 3,
        '& .MuiAlert-message': {
          width: '100%',
          wordBreak: 'break-word'
        }
      }}
    >
      {message}
    </Alert>
  );
};
