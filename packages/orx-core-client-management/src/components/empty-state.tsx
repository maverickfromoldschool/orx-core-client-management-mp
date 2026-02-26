import React from 'react';
import {Box, Typography} from '@mui/material';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /** Callback when upload client link is clicked */
  onUploadClient?: () => void;
  /** Callback when add client link is clicked */
  onAddClient?: () => void;
}

/**
 * EmptyState component displays a message when no clients are found
 */
export const EmptyState: React.FC<EmptyStateProps> = ({onUploadClient, onAddClient}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        minHeight: '300px',
        gap: '14px'
      }}
    >
      <FolderOffOutlinedIcon
        sx={{
          fontSize: '24px',
          color: '#6E7072'
        }}
      />
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#6E7072',
          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
        }}
      >
        No clients found
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#6E7072',
          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
          textAlign: 'center'
        }}
      >
        Start by{' '}
        <Box
          component="button"
          onClick={onUploadClient}
          sx={{
            color: '#0C55B8',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          uploading a client
        </Box>{' '}
        in the file center or{' '}
        <Box
          component="button"
          onClick={onAddClient}
          sx={{
            color: '#0C55B8',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          add a client
        </Box>
        .
      </Typography>
    </Box>
  );
};

export default EmptyState;
