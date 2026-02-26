import React from 'react';
import {Box, Typography} from '@mui/material';

import {COLORS} from '../constants';

export const TableHeader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '16px 0px',
        borderBottom: `1px solid ${COLORS.NEUTRAL_20}`
      }}
    >
      <Typography
        sx={{
          flex: 1,
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '1.71em',
          color: COLORS.TEXT_BLACK
        }}
      >
        Attribute *
      </Typography>
      <Typography
        sx={{
          flex: 1,
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '1.71em',
          color: COLORS.TEXT_BLACK
        }}
      >
        Value *
      </Typography>
      <Typography
        sx={{
          flex: 1,
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '1.71em',
          color: COLORS.TEXT_BLACK
        }}
      >
        Start Date *
      </Typography>
      <Typography
        sx={{
          flex: 1,
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '1.4em',
          color: COLORS.TEXT_BLACK
        }}
      >
        End Date
      </Typography>
      <Box sx={{width: '56px'}}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '1.4em',
            color: COLORS.TEXT_BLACK
          }}
        >
          Actions
        </Typography>
      </Box>
    </Box>
  );
};
