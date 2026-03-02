import React from 'react';
import {Chip} from '@mui/material';

import type {ClientStatus} from '../types';

/**
 * Props for the StatusChip component
 */
export interface StatusChipProps {
  /** The status to display */
  status: ClientStatus;
}

/**
 * Style mapping for client statuses
 * Complete: green border, green text, light green background
 * Draft: gray border, gray text, white background
 */
const statusStyles: Record<ClientStatus, {color: string; backgroundColor: string; borderColor: string}> = {
  Complete: {
    color: '#007000',
    backgroundColor: '#E5F2E5',
    borderColor: '#007000'
  },
  Draft: {
    color: '#4B4D4F',
    backgroundColor: '#FFFFFF',
    borderColor: '#6E7072'
  },
  Pending: {
    color: '#4B4D4F',
    backgroundColor: '#FFFFFF',
    borderColor: '#6E7072'
  },
  Inactive: {
    color: '#4B4D4F',
    backgroundColor: '#FFFFFF',
    borderColor: '#6E7072'
  }
};

/**
 * StatusChip component displays a client's status as a colored chip
 * Requirements: 3.5
 */
export const StatusChip: React.FC<StatusChipProps> = ({status}) => {
  const styles = statusStyles[status];

  return (
    <Chip
      label={status}
      size="small"
      variant="outlined"
      sx={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor,
        borderWidth: '1px',
        borderRadius: '4px',
        fontWeight: 700,
        fontSize: '14px',
        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
        height: '28px',
        '& .MuiChip-label': {
          px: '12px'
        }
      }}
    />
  );
};
