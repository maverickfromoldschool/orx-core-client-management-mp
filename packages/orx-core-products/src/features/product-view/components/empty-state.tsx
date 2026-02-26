import React from 'react';
import {Box, Typography} from '@mui/material';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /** Callback when add button is clicked */
  onAdd?: () => void;
}

/**
 * EmptyState component displays a message when no items are found
 */
export const EmptyState: React.FC<EmptyStateProps> = ({onAdd}) => {
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
        No transaction fields found
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
          onClick={onAdd}
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
          adding a new transaction field
        </Box>
        .
      </Typography>
    </Box>
  );
};

export default EmptyState;
