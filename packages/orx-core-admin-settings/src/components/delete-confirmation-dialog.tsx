import React, {useEffect, useRef} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import {handleFocusTrap, saveFocusedElement, restoreFocusedElement, focusFirstElement} from '../utils/focus-traps';

/**
 * Props for DeleteConfirmationDialog component
 */
export interface DeleteConfirmationDialogProps {
  open: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  itemText?: string;
}

/**
 * DeleteConfirmationDialog component
 * Confirmation dialog for delete operations (single or bulk)
 *
 * Requirements:
 * - 6.1: Displays confirmation dialog when delete icon clicked
 * - 6.2: Removes variant assignment on confirmation
 * - 6.3: Closes dialog without deleting on cancel
 * - 6.4: Displays error message on deletion failure
 * - 7.4: Shows count of items to be deleted for bulk operations
 */
export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  count,
  onConfirm,
  onCancel,
  loading = false,
  itemText = 'Record'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isBulk = count > 1;

  /**
   * Handle focus trap and focus management
   */
  useEffect(() => {
    if (open) {
      // Save the element that opened the dialog
      saveFocusedElement();

      // Focus the first element in the dialog after a short delay
      const timer = setTimeout(() => {
        if (dialogRef.current) {
          focusFirstElement(dialogRef.current);
        }
      }, 100);

      // Add keyboard event listener for focus trap
      const handleKeyDown = (event: KeyboardEvent) => {
        if (dialogRef.current) {
          handleFocusTrap(event, dialogRef.current);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // Restore focus when dialog closes
    restoreFocusedElement();
    return undefined;
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth={false}
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
      PaperProps={{
        ref: dialogRef,
        sx: {
          width: '560px',
          borderRadius: '24px',
          padding: '32px',
          backgroundColor: '#FFFFFF',
          boxShadow:
            '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      {/* Dialog Header with Warning Icon */}
      <DialogTitle
        id="delete-confirmation-dialog-title"
        sx={{
          padding: 0,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <Box
          sx={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#FFF4E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          role="img"
          aria-label="Warning"
        >
          <WarningAmberIcon
            sx={{
              fontSize: '28px',
              color: '#ED6C02'
            }}
          />
        </Box>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '32px',
            color: '#323334'
          }}
        >
          Confirm Deletion
        </Typography>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{padding: 0, marginBottom: '32px'}} id="delete-confirmation-dialog-description">
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#323334'
          }}
        >
          {isBulk
            ? `Are you sure you want to delete ${count} ${itemText}? This action cannot be undone.`
            : `Are you sure you want to delete this ${itemText}? This action cannot be undone.`}
        </Typography>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          padding: 0,
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}
        role="group"
        aria-label="Confirmation actions"
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          aria-label="Cancel deletion"
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#323334',
            borderColor: '#323334',
            borderWidth: '1px',
            height: '40px',
            padding: '10px 24px',
            borderRadius: '46px',
            minWidth: '101px',
            '&:hover': {
              borderColor: '#323334',
              borderWidth: '1px',
              backgroundColor: 'rgba(50, 51, 52, 0.04)'
            },
            '&.Mui-disabled': {
              borderColor: '#E0E0E0',
              color: '#9E9E9E'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          aria-label={`Confirm deletion of ${count} ${itemText}`}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            backgroundColor: '#D32F2F',
            color: '#FFFFFF',
            height: '40px',
            padding: '10px 24px',
            borderRadius: '46px',
            minWidth: '101px',
            '&:hover': {
              backgroundColor: '#B71C1C'
            },
            '&.Mui-disabled': {
              backgroundColor: '#E0E0E0',
              color: '#9E9E9E'
            }
          }}
        >
          {loading ? <CircularProgress size={20} sx={{color: '#9E9E9E'}} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
