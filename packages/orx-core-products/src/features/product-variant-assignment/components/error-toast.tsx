import React from 'react';
import {Snackbar, Alert, AlertTitle, Button, Box} from '@mui/material';

/**
 * Error types for different error scenarios
 */
export type ErrorType = 'api' | 'network' | 'validation' | 'general';

/**
 * Props for ErrorToast component
 */
export interface ErrorToastProps {
  open: boolean;
  message: string;
  type?: ErrorType;
  onClose: () => void;
  onRetry?: () => void;
  autoHideDuration?: number;
}

/**
 * ErrorToast component
 * Displays error messages as toast notifications with appropriate styling and actions
 *
 * Requirements:
 * - 11.1: Displays user-friendly error messages for API failures
 * - 11.2: Indicates network errors with specific messaging and retry option
 * - 11.3: Highlights validation errors (handled inline in forms)
 * - 11.4: Shows bulk operation error details
 */
export const ErrorToast: React.FC<ErrorToastProps> = ({
  open,
  message,
  type = 'general',
  onClose,
  onRetry,
  autoHideDuration = 10000
}) => {
  /**
   * Get error title based on type
   */
  const getErrorTitle = (): string => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'api':
        return 'Operation Failed';
      case 'validation':
        return 'Validation Error';
      default:
        return 'Error';
    }
  };

  /**
   * Get error message with additional context
   */
  const getErrorMessage = (): string => {
    if (type === 'network') {
      return `${message}. Please check your internet connection and try again.`;
    }
    return message;
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      sx={{
        top: '24px !important'
      }}
    >
      <Alert
        severity="error"
        onClose={onClose}
        variant="filled"
        sx={{
          width: '100%',
          minWidth: '400px',
          maxWidth: '600px',
          backgroundColor: '#D32F2F',
          color: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          '& .MuiAlert-icon': {
            color: '#FFFFFF'
          },
          '& .MuiAlert-action': {
            color: '#FFFFFF',
            paddingTop: 0
          }
        }}
        action={
          onRetry ? (
            <Box sx={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <Button
                size="small"
                onClick={onRetry}
                aria-label="Retry operation"
                sx={{
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Retry
              </Button>
            </Box>
          ) : undefined
        }
      >
        <AlertTitle
          sx={{
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#FFFFFF',
            marginBottom: '4px'
          }}
        >
          {getErrorTitle()}
        </AlertTitle>
        <Box
          sx={{
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px',
            color: '#FFFFFF'
          }}
        >
          {getErrorMessage()}
        </Box>
      </Alert>
    </Snackbar>
  );
};
