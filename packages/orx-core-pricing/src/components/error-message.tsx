import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorMessage component displays an error state with optional retry
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({message, onRetry}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: 2,
      p: 3
    }}
  >
    <ErrorOutlineIcon sx={{fontSize: 64, color: 'error.main'}} />
    <Typography variant="h6" sx={{color: 'text.primary', textAlign: 'center'}}>
      Error Loading Data
    </Typography>
    <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center', maxWidth: 500}}>
      {message}
    </Typography>
    {onRetry && (
      <Button variant="contained" onClick={onRetry} sx={{mt: 2}}>
        Retry
      </Button>
    )}
  </Box>
);
