import React from 'react';
import {Box, CircularProgress, Typography} from '@mui/material';

export interface LoadingSpinnerProps {
  message?: string;
}

/**
 * LoadingSpinner component displays a centered loading indicator
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({message = 'Loading...'}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: 2
    }}
  >
    <CircularProgress size={48} />
    <Typography variant="body1" sx={{color: 'text.secondary'}}>
      {message}
    </Typography>
  </Box>
);
