/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {
  EditAccountingCodeDialogProps,
  EditAccountingCodeFormData,
  editAccountingCodeSchema
} from './EditAccountingCodeDialog.types';
import {MainTab} from './MainTab';
import {GLAccountNumberTab} from './GLAccountNumberTab';
import {NotesTab} from './NotesTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({children, value, index}) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <div>{children}</div>}
    </div>
  );
};

export const EditAccountingCodeDialog: React.FC<EditAccountingCodeDialogProps> = ({
  open,
  onClose,
  onSubmit,
  data,
  loading = false,
  glAccountTypes = [],
  glAccountGroups = [],
  glAccountingKeyPlugins = []
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [hasPendingEntry, setHasPendingEntry] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    watch,
    setValue
  } = useForm<EditAccountingCodeFormData>({
    resolver: zodResolver(editAccountingCodeSchema),
    mode: 'onChange',
    defaultValues: data
  });

  // Reset form when data changes
  useEffect(() => {
    if (open && data) {
      reset(data);
    }
  }, [open, data, reset]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    setActiveTab(0);
    setHasPendingEntry(false);
    onClose();
  };

  const handleFormSubmit = async (formData: EditAccountingCodeFormData) => {
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '600px'
        }
      }}
    >
      {/* Dialog Title */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <Typography variant="h6" sx={{fontWeight: 600, color: '#002677'}}>
            Edit Accounting Code
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{borderBottom: 1, borderColor: 'divider', px: 3}}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 400,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'text.primary',
                fontWeight: 500
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4CAF50',
              height: 3
            }
          }}
        >
          <Tab label="Main" />
          <Tab label="GL Account Number" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{px: 3, minHeight: '400px'}}>
        <form id="edit-accounting-code-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <TabPanel value={activeTab} index={0}>
            <MainTab
              control={control}
              errors={errors}
              glAccountTypes={glAccountTypes}
              glAccountGroups={glAccountGroups}
              glAccountingKeyPlugins={glAccountingKeyPlugins}
              watch={watch}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <GLAccountNumberTab
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              onPendingEntryChange={setHasPendingEntry}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <NotesTab control={control} errors={errors} watch={watch} />
          </TabPanel>
        </form>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 1
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderColor: 'divider',
            color: 'text.primary',
            px: 3,
            borderRadius: '24px',
            '&:hover': {
              borderColor: 'text.secondary',
              bgcolor: 'grey.50'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-accounting-code-form"
          variant="contained"
          disabled={loading || !isValid || hasPendingEntry}
          sx={{
            textTransform: 'none',
            bgcolor: 'grey.300',
            color: 'text.secondary',
            px: 3,
            borderRadius: '24px',
            '&:hover': {
              bgcolor: 'grey.400'
            },
            '&:not(:disabled)': {
              bgcolor: '#003087',
              color: 'white',
              '&:hover': {
                bgcolor: '#002060'
              }
            }
          }}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountingCodeDialog;
