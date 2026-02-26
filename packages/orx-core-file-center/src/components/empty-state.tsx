import React from 'react';
import {Box, Typography} from '@mui/material';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';

/**
 * EmptyState component displays a message when no files are found
 */
export const EmptyState: React.FC = () => {
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
        No files found
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
        No files match your current filters. Try adjusting your search.
      </Typography>
    </Box>
  );
};

export default EmptyState;
