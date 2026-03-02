import React from 'react';
import {Alert, IconButton} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

interface SuccessBannerProps {
  /** The message to display */
  message: string;
  /** Whether the banner is visible */
  visible: boolean;
  /** Callback when dismiss button is clicked */
  onDismiss: () => void;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({message, visible, onDismiss}) => {
  if (!visible) {
    return null;
  }

  return (
    <Alert
      severity="success"
      icon={
        <CheckCircleOutlineIcon
          sx={{
            color: '#007000',
            fontSize: '24px'
          }}
        />
      }
      action={
        <IconButton
          aria-label="dismiss"
          color="inherit"
          size="small"
          onClick={onDismiss}
          sx={{
            color: '#007000'
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      sx={{
        backgroundColor: '#EFF6EF',
        border: '1px solid #007000',
        borderRadius: '12px',
        padding: '16px 24px',
        '& .MuiAlert-icon': {
          marginRight: '12px',
          padding: 0,
          alignItems: 'center'
        },
        '& .MuiAlert-message': {
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          fontSize: '16px',
          fontWeight: 400,
          color: '#323334'
        },
        '& .MuiAlert-action': {
          padding: 0,
          marginRight: 0,
          alignItems: 'center'
        }
      }}
    >
      {message}
    </Alert>
  );
};

export default SuccessBanner;
