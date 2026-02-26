import React from 'react';
import {Box, IconButton} from '@mui/material';

import {COLORS} from '../constants';

interface ActionButtonsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({isEditing, onSave, onCancel, onEdit, onDelete}) => {
  if (isEditing) {
    return (
      <Box sx={{width: '56px', display: 'flex', gap: '8px', alignItems: 'center'}}>
        <IconButton size="small" onClick={onSave} aria-label="Save">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={COLORS.SECONDARY_DARK_BLUE} />
          </svg>
        </IconButton>
        <IconButton size="small" onClick={onCancel} aria-label="Cancel">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              fill={COLORS.SECONDARY_DARK_BLUE}
            />
          </svg>
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{width: '56px', display: 'flex', gap: '8px', alignItems: 'center'}}>
      <IconButton size="small" onClick={onEdit} aria-label="Edit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            fill={COLORS.SECONDARY_DARK_BLUE}
          />
        </svg>
      </IconButton>
      <IconButton size="small" onClick={onDelete} aria-label="Delete">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            fill={COLORS.SECONDARY_DARK_BLUE}
          />
        </svg>
      </IconButton>
    </Box>
  );
};
