import React from 'react';
import {Box, Typography} from '@mui/material';

export interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  fullWidth?: boolean;
}

/**
 * InfoField component displays a label-value pair in a read-only format
 */
export const InfoField: React.FC<InfoFieldProps> = ({label, value, fullWidth = false}) => (
  <Box sx={{mb: 2, flex: fullWidth ? '1 1 100%' : '1 1 48%', minWidth: fullWidth ? '100%' : '250px'}}>
    <Typography variant="body2" sx={{color: 'text.secondary', mb: 0.5, fontSize: '0.875rem'}}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{color: 'text.primary', fontWeight: 500}}>
      {value || '-'}
    </Typography>
  </Box>
);
