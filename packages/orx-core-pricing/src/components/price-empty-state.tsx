import React from 'react';
import {Box, Typography, TableRow, TableCell} from '@mui/material';

const EmptyState: React.FC = () => (
  <TableRow>
    <TableCell colSpan={8} sx={{borderBottom: 'none', padding: 0}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3
        }}
      >
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#323334',
            mb: 1,
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
          }}
        >
          No Price Lists Found
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            color: '#6E7072',
            textAlign: 'center',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
          }}
        >
          No price lists match your current filters or there is no data available.
        </Typography>
      </Box>
    </TableCell>
  </TableRow>
);

export default EmptyState;
