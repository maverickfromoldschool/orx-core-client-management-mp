import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';

import {COLORS} from '../constants';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({open, onConfirm, onCancel}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Delete Attribute</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete this attribute? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          sx={{
            color: COLORS.SECONDARY_DARK_BLUE,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: COLORS.SECONDARY_DARK_BLUE,
            color: COLORS.SECONDARY_WARM_WHITE,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#001a5c'
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
