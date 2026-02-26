'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  Tooltip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Switch,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';

import type {BillCycleScheduleItem} from '../services/bill-cycle-api.types';
import {billCycleApiService} from '../services';

import type {BillCycleDialogProps} from './bill-cycle-dialog.types';
import {GenerateScheduleDialog, type GenerateScheduleData} from './generate-schedule-dialog';

// Utility function to format date for display (date only)
const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    // Extract date part directly from the ISO string to avoid timezone issues
    // Input format: "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DD"
    const datePart = dateString.split('T')[0];
    return datePart || '';
  } catch {
    return '';
  }
};

// Utility function to convert date from YYYY-MM-DD to ISO timestamp format
const formatDateForApi = (dateString: string): string => {
  if (!dateString) return '';
  try {
    // If already in ISO format, return as is
    if (dateString.includes('T')) return dateString;
    // Convert YYYY-MM-DD to YYYY-MM-DDTHH:mm:ss
    return `${dateString}T00:00:00`;
  } catch {
    return dateString;
  }
};

export function BillCycleDialog({
  open,
  onClose,
  onSave,
  initialData,
  isSaving = false,
  billingPeriodOptions
}: BillCycleDialogProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
    billCycleCode: '',
    billingPeriod: '',
    description: '',
    dailyRefresh: false,
    finalsReprocess: false
  });

  const [errors, setErrors] = React.useState({
    billCycleCode: '',
    billingPeriod: '',
    description: ''
  });

  const [touched, setTouched] = React.useState({
    billCycleCode: false,
    billingPeriod: false,
    description: false
  });

  // Schedules state
  const [schedules, setSchedules] = React.useState<BillCycleScheduleItem[]>([]);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newSchedule, setNewSchedule] = React.useState<Omit<BillCycleScheduleItem, 'billCycleScheduleIdentifier'>>({
    billCycleCode: '',
    scheduleDate: '',
    closeDate: '',
    startDate: '',
    endDate: '',
    accountingDate: '',
    finalize: 'N',
    isLinkedToBillCycleRun: 'N'
  });
  const [scheduleErrors, setScheduleErrors] = React.useState({
    scheduleDate: '',
    closeDate: '',
    startDate: '',
    endDate: '',
    accountingDate: '',
    finalize: ''
  });
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editSchedule, setEditSchedule] = React.useState<Omit<BillCycleScheduleItem, 'billCycleScheduleIdentifier'>>({
    billCycleCode: '',
    scheduleDate: '',
    closeDate: '',
    startDate: '',
    endDate: '',
    accountingDate: '',
    finalize: 'N',
    isLinkedToBillCycleRun: 'N'
  });
  const [editScheduleErrors, setEditScheduleErrors] = React.useState({
    scheduleDate: '',
    closeDate: '',
    startDate: '',
    endDate: '',
    accountingDate: '',
    finalize: ''
  });

  // Generate Schedule dialog state
  const [generateScheduleOpen, setGenerateScheduleOpen] = React.useState(false);

  const handleGenerateSchedule = async (data: GenerateScheduleData) => {
    try {
      // Call API to generate schedules
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await billCycleApiService.generateBillCycleSchedule(data);

      // Extract schedules from various possible response structures
      let generatedSchedules: any[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response?.data?.data && Array.isArray(response.data.data)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        generatedSchedules = response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (response && Array.isArray(response.data)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        generatedSchedules = response.data;
      } else if (response && Array.isArray(response)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        generatedSchedules = response;
      }

      if (generatedSchedules.length > 0) {
        // Map schedules and add dummy identifiers for null billCycleScheduleIdentifier
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        const mappedSchedules = generatedSchedules.map((schedule, index) => ({
          ...schedule,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          billCycleScheduleIdentifier: schedule.billCycleScheduleIdentifier || `schedule-${Date.now()}-${index}`
        }));

        // Override existing schedules with generated schedules
        setSchedules(mappedSchedules);

        // Close the generate schedule dialog
        setGenerateScheduleOpen(false);
      } else {
        console.error('No schedules found in response:', response);
      }
    } catch (error) {
      console.error('Error generating schedules:', error);
    }
  };

  // Reset form when dialog opens or initialData changes
  React.useEffect(() => {
    if (open) {
      setActiveTab(0);
      if (initialData) {
        setFormData({
          billCycleCode: initialData.billCycleCode,
          billingPeriod: initialData.billingPeriod,
          description: initialData.description,
          dailyRefresh: initialData.dailyRefresh,
          finalsReprocess: initialData.finalsReprocess
        });
        setSchedules(initialData.billCycleScheduleList || []);
      } else {
        setFormData({
          billCycleCode: '',
          billingPeriod: '',
          description: '',
          dailyRefresh: false,
          finalsReprocess: false
        });
        setSchedules([]);
      }
      setErrors({
        billCycleCode: '',
        billingPeriod: '',
        description: ''
      });
      setTouched({
        billCycleCode: false,
        billingPeriod: false,
        description: false
      });
      setIsAddingNew(false);
      setEditingId(null);
    }
  }, [open, initialData]);

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors = {
      billCycleCode: '',
      billingPeriod: '',
      description: ''
    };

    if (!formData.billCycleCode.trim()) {
      newErrors.billCycleCode = 'Bill Cycle Code is required';
    }

    if (!formData.billingPeriod.trim()) {
      newErrors.billingPeriod = 'Billing Period is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSave = () => {
    setTouched({
      billCycleCode: true,
      billingPeriod: true,
      description: true
    });

    if (validateForm()) {
      onSave({
        ...(initialData ? {id: initialData.billCycleCode} : {}),
        ...formData,
        billCycleScheduleList: schedules
      });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (touched[field as keyof typeof touched]) {
      const newErrors = {...errors};
      if (value.trim()) {
        newErrors[field as keyof typeof errors] = '';
      } else {
        newErrors[field as keyof typeof errors] = `${
          field.charAt(0).toUpperCase() +
          field
            .slice(1)
            .replace(/([A-Z])/g, ' $1')
            .trim()
        } is required`;
      }
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }));

    const newErrors = {...errors};
    if (!formData[field as keyof typeof formData] || !String(formData[field as keyof typeof formData]).trim()) {
      newErrors[field as keyof typeof errors] = `${
        field.charAt(0).toUpperCase() +
        field
          .slice(1)
          .replace(/([A-Z])/g, ' $1')
          .trim()
      } is required`;
    } else {
      newErrors[field as keyof typeof errors] = '';
    }
    setErrors(newErrors);
  };

  const handleSwitchChange =
    (field: 'dailyRefresh' | 'finalsReprocess') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        // If turning on, turn off the other one
        if (event.target.checked) {
          return {
            ...prev,
            dailyRefresh: field === 'dailyRefresh',
            finalsReprocess: field === 'finalsReprocess'
          };
        }
        // If turning off, just update the current field
        return {
          ...prev,
          [field]: false
        };
      });
    };

  const handleTabChange = (_event: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);
  };

  // Schedule handlers
  const handleAddSchedule = () => {
    setIsAddingNew(true);
    setNewSchedule({
      billCycleCode: formData.billCycleCode,
      scheduleDate: '',
      closeDate: '',
      startDate: '',
      endDate: '',
      accountingDate: '',
      finalize: 'N',
      isLinkedToBillCycleRun: 'N'
    });
    setScheduleErrors({
      scheduleDate: '',
      closeDate: '',
      startDate: '',
      endDate: '',
      accountingDate: '',
      finalize: ''
    });
  };

  const validateSchedule = (schedule: Omit<BillCycleScheduleItem, 'billCycleScheduleIdentifier'>) => {
    const validationErrors: Record<string, string> = {};
    let isValid = true;

    if (!schedule.scheduleDate?.trim()) {
      validationErrors['scheduleDate'] = 'Required field';
      isValid = false;
    }
    if (!schedule.closeDate?.trim()) {
      validationErrors['closeDate'] = 'Required field';
      isValid = false;
    }
    if (!schedule.startDate?.trim()) {
      validationErrors['startDate'] = 'Required field';
      isValid = false;
    }
    if (!schedule.endDate?.trim()) {
      validationErrors['endDate'] = 'Required field';
      isValid = false;
    }
    if (!schedule.accountingDate?.trim()) {
      validationErrors['accountingDate'] = 'Required field';
      isValid = false;
    }

    return {isValid, errors: validationErrors};
  };

  const handleSaveNewSchedule = () => {
    const {isValid, errors: validationErrors} = validateSchedule(newSchedule);

    if (!isValid) {
      setScheduleErrors(validationErrors as typeof scheduleErrors);
      return;
    }

    const newScheduleItem: BillCycleScheduleItem = {
      billCycleScheduleIdentifier: `schedule-${Date.now()}`,
      billCycleCode: newSchedule.billCycleCode,
      scheduleDate: formatDateForApi(newSchedule.scheduleDate),
      closeDate: formatDateForApi(newSchedule.closeDate),
      startDate: formatDateForApi(newSchedule.startDate),
      endDate: formatDateForApi(newSchedule.endDate),
      accountingDate: formatDateForApi(newSchedule.accountingDate),
      finalize: newSchedule.finalize,
      isLinkedToBillCycleRun: newSchedule.isLinkedToBillCycleRun
    };
    setSchedules([newScheduleItem, ...schedules]);
    setIsAddingNew(false);
  };

  const handleCancelNewSchedule = () => {
    setIsAddingNew(false);
  };

  const handleEditSchedule = (schedule: BillCycleScheduleItem) => {
    setEditingId(schedule.billCycleScheduleIdentifier);
    setEditSchedule({
      billCycleCode: schedule.billCycleCode,
      scheduleDate: formatDateForDisplay(schedule.scheduleDate),
      closeDate: formatDateForDisplay(schedule.closeDate),
      startDate: formatDateForDisplay(schedule.startDate),
      endDate: formatDateForDisplay(schedule.endDate),
      accountingDate: formatDateForDisplay(schedule.accountingDate),
      finalize: schedule.finalize,
      isLinkedToBillCycleRun: schedule.isLinkedToBillCycleRun
    });
    setEditScheduleErrors({
      scheduleDate: '',
      closeDate: '',
      startDate: '',
      endDate: '',
      accountingDate: '',
      finalize: ''
    });
  };

  const handleSaveEditSchedule = () => {
    const {isValid, errors: validationErrors} = validateSchedule(editSchedule);

    if (!isValid) {
      setEditScheduleErrors(validationErrors as typeof editScheduleErrors);
      return;
    }

    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.billCycleScheduleIdentifier === editingId
          ? {
              ...schedule,
              scheduleDate: formatDateForApi(editSchedule.scheduleDate),
              closeDate: formatDateForApi(editSchedule.closeDate),
              startDate: formatDateForApi(editSchedule.startDate),
              endDate: formatDateForApi(editSchedule.endDate),
              accountingDate: formatDateForApi(editSchedule.accountingDate),
              finalize: editSchedule.finalize,
              isLinkedToBillCycleRun: editSchedule.isLinkedToBillCycleRun
            }
          : schedule
      )
    );
    setEditingId(null);
  };

  const handleCancelEditSchedule = () => {
    setEditingId(null);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.billCycleScheduleIdentifier !== id));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            padding: '24px 24px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #CBCCCD'
          }}
        >
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#002677',
              fontFamily: '"Enterprise Sans VF", sans-serif'
            }}
          >
            {initialData ? 'Edit Bill Cycle' : 'Add Bill Cycle'}
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={isSaving}
            sx={{
              color: '#4B4D4F',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 700,
                color: '#4B4D4F',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                '&.Mui-selected': {
                  color: '#002677'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#002677',
                height: '3px'
              }
            }}
          >
            <Tab label="Main" />
            <Tab label="Schedules" />
          </Tabs>
        </Box>

        <DialogContent sx={{padding: '24px', paddingBottom: '16px'}}>
          {/* Main Tab */}
          {activeTab === 0 && (
            <Box sx={{pt: 1, pb: 0}}>
              {/* First Row: Bill Cycle Code and Billing Period */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <div>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        Bill Cycle Code
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="Bill cycle code identifier" arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.billCycleCode}
                      onChange={handleChange('billCycleCode')}
                      onBlur={handleBlur('billCycleCode')}
                      error={!!errors.billCycleCode}
                      placeholder="Enter bill cycle code"
                      disabled={isSaving || !!initialData}
                      InputProps={{
                        sx: {
                          fontSize: '14px',
                          height: '36px',
                          '& input': {
                            padding: '8px'
                          }
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: errors.billCycleCode ? '#C40000' : '#CBCCCD'
                          },
                          '&:hover fieldset': {
                            borderColor: errors.billCycleCode ? '#C40000' : '#999'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.billCycleCode ? '#C40000' : '#0C55B8',
                            borderWidth: '1px'
                          },
                          '&:disabled': {
                            backgroundColor: '#F5F5F5',
                            cursor: 'not-allowed'
                          }
                        }
                      }}
                    />
                    {errors.billCycleCode && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.billCycleCode}</Typography>
                    )}
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        Billing Period
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="Select the billing period" arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      select
                      value={formData.billingPeriod}
                      onChange={handleChange('billingPeriod')}
                      onBlur={handleBlur('billingPeriod')}
                      error={!!errors.billingPeriod}
                      placeholder="Select billing period"
                      disabled={isSaving}
                      InputProps={{
                        sx: {
                          fontSize: '14px',
                          height: '36px',
                          '& .MuiSelect-select': {
                            padding: '8px'
                          }
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: errors.billingPeriod ? '#C40000' : '#CBCCCD'
                          },
                          '&:hover fieldset': {
                            borderColor: errors.billingPeriod ? '#C40000' : '#999'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.billingPeriod ? '#C40000' : '#0C55B8',
                            borderWidth: '1px'
                          }
                        }
                      }}
                    >
                      {billingPeriodOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.billingPeriod && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.billingPeriod}</Typography>
                    )}
                  </div>
                </Grid>
              </Grid>

              {/* Second Row: Description, Daily Reprocess, Finals Reprocess */}
              <Grid container spacing={2} sx={{mt: 2}}>
                <Grid item xs={12} md={4}>
                  <div>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        Description
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="Description of the bill cycle" arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.description}
                      onChange={handleChange('description')}
                      onBlur={handleBlur('description')}
                      error={!!errors.description}
                      placeholder="Enter description"
                      disabled={isSaving}
                      InputProps={{
                        sx: {
                          fontSize: '14px',
                          height: '36px',
                          '& input': {
                            padding: '8px'
                          }
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: errors.description ? '#C40000' : '#CBCCCD'
                          },
                          '&:hover fieldset': {
                            borderColor: errors.description ? '#C40000' : '#999'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.description ? '#C40000' : '#0C55B8',
                            borderWidth: '1px'
                          }
                        }
                      }}
                    />
                    {errors.description && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.description}</Typography>
                    )}
                  </div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: {xs: 0, md: 3.5}}}
                  >
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        Daily Reprocess
                      </Typography>
                      <Tooltip title="Enable daily reprocessing" arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Switch
                      checked={formData.dailyRefresh}
                      onChange={handleSwitchChange('dailyRefresh')}
                      disabled={isSaving}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#002677'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#002677'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: {xs: 0, md: 3.5}}}
                  >
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        Finals Reprocess
                      </Typography>
                      <Tooltip title="Enable finals reprocessing" arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Switch
                      checked={formData.finalsReprocess}
                      onChange={handleSwitchChange('finalsReprocess')}
                      disabled={isSaving}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#002677'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#002677'
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Generate Bill Cycle Schedule Link */}
              {formData.billCycleCode && formData.billingPeriod && formData.description && (
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                  <Typography
                    sx={{
                      color: '#0066F5',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: '#0052CC'
                      }
                    }}
                    onClick={() => {
                      // Open generate schedule dialog
                      setGenerateScheduleOpen(true);
                    }}
                  >
                    Generate Bill Cycle Schedule
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Schedules Tab */}
          {activeTab === 1 && (
            <Box sx={{pt: 1, px: 1, pb: 1, display: 'flex', flexDirection: 'column'}}>
              {/* Header with count and Add button - Fixed */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 1.5,
                  flexShrink: 0
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  Number of schedules: {schedules.length}
                </Typography>

                {/* Add Schedule Button */}
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={handleAddSchedule}
                  sx={{
                    backgroundColor: '#002677',
                    color: '#FFFFFF',
                    borderRadius: '46px',
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#001a5c'
                    }
                  }}
                >
                  Add Schedule
                </Button>
              </Box>

              {/* Table with fixed header and scrollable body */}
              <Box sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#323334',
                          borderBottom: '1px solid #CBCCCD',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          width: '15%',
                          padding: '8px'
                        }}
                      >
                        Prelims Date
                        <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#323334',
                          borderBottom: '1px solid #CBCCCD',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          width: '15%',
                          padding: '8px'
                        }}
                      >
                        Finals Date
                        <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#323334',
                          borderBottom: '1px solid #CBCCCD',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          width: '15%',
                          padding: '8px'
                        }}
                      >
                        Period Start Date
                        <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#323334',
                          borderBottom: '1px solid #CBCCCD',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          width: '15%',
                          padding: '8px'
                        }}
                      >
                        Period End Date
                        <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#323334',
                          borderBottom: '1px solid #CBCCCD',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          width: '15%',
                          padding: '8px'
                        }}
                      >
                        Accounting Date
                        <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#323334',
                          borderBottom: '1px solid #CBCCCD',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          width: '10%',
                          padding: '8px'
                        }}
                      >
                        Finalize
                        <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#323334',
                          borderBottom: '1px solid #CBCCCD',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          width: '15%',
                          padding: '8px'
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>

                {/* Scrollable table body */}
                <Box sx={{overflowY: 'auto', maxHeight: '400px'}}>
                  <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                    <TableBody>
                      {/* Empty State */}
                      {schedules.length === 0 && !isAddingNew ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{borderBottom: 'none', padding: 0}}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '48px',
                                gap: '8px'
                              }}
                            >
                              <FolderOffOutlinedIcon
                                sx={{
                                  fontSize: '24px',
                                  color: '#6E7072',
                                  mb: 1
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: '16px',
                                  fontWeight: 400,
                                  color: '#6E7072',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                }}
                              >
                                No schedules found for this bill cycle
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
                                  onClick={handleAddSchedule}
                                  sx={{
                                    color: '#0C55B8',
                                    textDecoration: 'underline',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit'
                                  }}
                                >
                                  adding a new schedule
                                </Box>
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : null}

                      {/* Add New Schedule Row */}
                      {isAddingNew && (
                        <TableRow>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                            <TextField
                              fullWidth
                              type="date"
                              value={newSchedule.scheduleDate}
                              onChange={(e) => {
                                setNewSchedule((prev) => ({...prev, scheduleDate: e.target.value}));
                                if (e.target.value) {
                                  setScheduleErrors((prev) => ({...prev, scheduleDate: ''}));
                                }
                              }}
                              onBlur={() => {
                                if (!newSchedule.scheduleDate) {
                                  setScheduleErrors((prev) => ({...prev, scheduleDate: 'Required'}));
                                }
                              }}
                              error={!!scheduleErrors.scheduleDate}
                              size="small"
                              InputProps={{
                                sx: {fontSize: '12px', height: '32px'}
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                            <TextField
                              fullWidth
                              type="date"
                              value={newSchedule.closeDate}
                              onChange={(e) => {
                                setNewSchedule((prev) => ({...prev, closeDate: e.target.value}));
                                if (e.target.value) {
                                  setScheduleErrors((prev) => ({...prev, closeDate: ''}));
                                }
                              }}
                              onBlur={() => {
                                if (!newSchedule.closeDate) {
                                  setScheduleErrors((prev) => ({...prev, closeDate: 'Required'}));
                                }
                              }}
                              error={!!scheduleErrors.closeDate}
                              size="small"
                              InputProps={{
                                sx: {fontSize: '12px', height: '32px'}
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                            <TextField
                              fullWidth
                              type="date"
                              value={newSchedule.startDate}
                              onChange={(e) => {
                                setNewSchedule((prev) => ({...prev, startDate: e.target.value}));
                                if (e.target.value) {
                                  setScheduleErrors((prev) => ({...prev, startDate: ''}));
                                }
                              }}
                              onBlur={() => {
                                if (!newSchedule.startDate) {
                                  setScheduleErrors((prev) => ({...prev, startDate: 'Required'}));
                                }
                              }}
                              error={!!scheduleErrors.startDate}
                              size="small"
                              InputProps={{
                                sx: {fontSize: '12px', height: '32px'}
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                            <TextField
                              fullWidth
                              type="date"
                              value={newSchedule.endDate}
                              onChange={(e) => {
                                setNewSchedule((prev) => ({...prev, endDate: e.target.value}));
                                if (e.target.value) {
                                  setScheduleErrors((prev) => ({...prev, endDate: ''}));
                                }
                              }}
                              onBlur={() => {
                                if (!newSchedule.endDate) {
                                  setScheduleErrors((prev) => ({...prev, endDate: 'Required'}));
                                }
                              }}
                              error={!!scheduleErrors.endDate}
                              size="small"
                              InputProps={{
                                sx: {fontSize: '12px', height: '32px'}
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                            <TextField
                              fullWidth
                              type="date"
                              value={newSchedule.accountingDate}
                              onChange={(e) => {
                                setNewSchedule((prev) => ({...prev, accountingDate: e.target.value}));
                                if (e.target.value) {
                                  setScheduleErrors((prev) => ({...prev, accountingDate: ''}));
                                }
                              }}
                              onBlur={() => {
                                if (!newSchedule.accountingDate) {
                                  setScheduleErrors((prev) => ({...prev, accountingDate: 'Required'}));
                                }
                              }}
                              error={!!scheduleErrors.accountingDate}
                              size="small"
                              InputProps={{
                                sx: {fontSize: '12px', height: '32px'}
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '10%'}}>
                            <Checkbox
                              checked={newSchedule.finalize === 'Y'}
                              onChange={(e) => {
                                setNewSchedule((prev) => ({...prev, finalize: e.target.checked ? 'Y' : 'N'}));
                              }}
                              size="small"
                              sx={{
                                padding: '4px',
                                '&.Mui-checked': {
                                  color: '#002677'
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                            <Box sx={{display: 'flex', gap: 0.5}}>
                              <Tooltip title="Save" arrow>
                                <IconButton
                                  size="small"
                                  onClick={handleSaveNewSchedule}
                                  sx={{
                                    color: '#0C55B8',
                                    '&:hover': {
                                      backgroundColor: 'rgba(12, 85, 184, 0.04)'
                                    }
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel" arrow>
                                <IconButton
                                  size="small"
                                  onClick={handleCancelNewSchedule}
                                  sx={{
                                    color: '#C40000',
                                    '&:hover': {
                                      backgroundColor: 'rgba(196, 0, 0, 0.04)'
                                    }
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Existing Schedule Rows */}
                      {schedules.map((schedule) => (
                        <TableRow key={schedule.billCycleScheduleIdentifier}>
                          {editingId === schedule.billCycleScheduleIdentifier ? (
                            <>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  value={editSchedule.scheduleDate}
                                  onChange={(e) => {
                                    setEditSchedule((prev) => ({...prev, scheduleDate: e.target.value}));
                                    if (e.target.value) {
                                      setEditScheduleErrors((prev) => ({...prev, scheduleDate: ''}));
                                    }
                                  }}
                                  error={!!editScheduleErrors.scheduleDate}
                                  size="small"
                                  InputProps={{
                                    sx: {fontSize: '12px', height: '32px'}
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  value={editSchedule.closeDate}
                                  onChange={(e) => {
                                    setEditSchedule((prev) => ({...prev, closeDate: e.target.value}));
                                    if (e.target.value) {
                                      setEditScheduleErrors((prev) => ({...prev, closeDate: ''}));
                                    }
                                  }}
                                  error={!!editScheduleErrors.closeDate}
                                  size="small"
                                  InputProps={{
                                    sx: {fontSize: '12px', height: '32px'}
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  value={editSchedule.startDate}
                                  onChange={(e) => {
                                    setEditSchedule((prev) => ({...prev, startDate: e.target.value}));
                                    if (e.target.value) {
                                      setEditScheduleErrors((prev) => ({...prev, startDate: ''}));
                                    }
                                  }}
                                  error={!!editScheduleErrors.startDate}
                                  size="small"
                                  InputProps={{
                                    sx: {fontSize: '12px', height: '32px'}
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  value={editSchedule.endDate}
                                  onChange={(e) => {
                                    setEditSchedule((prev) => ({...prev, endDate: e.target.value}));
                                    if (e.target.value) {
                                      setEditScheduleErrors((prev) => ({...prev, endDate: ''}));
                                    }
                                  }}
                                  error={!!editScheduleErrors.endDate}
                                  size="small"
                                  InputProps={{
                                    sx: {fontSize: '12px', height: '32px'}
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  value={editSchedule.accountingDate}
                                  onChange={(e) => {
                                    setEditSchedule((prev) => ({...prev, accountingDate: e.target.value}));
                                    if (e.target.value) {
                                      setEditScheduleErrors((prev) => ({...prev, accountingDate: ''}));
                                    }
                                  }}
                                  error={!!editScheduleErrors.accountingDate}
                                  size="small"
                                  InputProps={{
                                    sx: {fontSize: '12px', height: '32px'}
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '10%'}}>
                                <Checkbox
                                  checked={editSchedule.finalize === 'Y'}
                                  onChange={(e) => {
                                    setEditSchedule((prev) => ({...prev, finalize: e.target.checked ? 'Y' : 'N'}));
                                  }}
                                  size="small"
                                  sx={{
                                    padding: '4px',
                                    '&.Mui-checked': {
                                      color: '#002677'
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                <Box sx={{display: 'flex', gap: 0.5}}>
                                  <Tooltip title="Save" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={handleSaveEditSchedule}
                                      sx={{
                                        color: '#0C55B8',
                                        '&:hover': {
                                          backgroundColor: 'rgba(12, 85, 184, 0.04)'
                                        }
                                      }}
                                    >
                                      <CheckIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Cancel" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={handleCancelEditSchedule}
                                      sx={{
                                        color: '#C40000',
                                        '&:hover': {
                                          backgroundColor: 'rgba(196, 0, 0, 0.04)'
                                        }
                                      }}
                                    >
                                      <CloseIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#323334',
                                  borderBottom: '1px solid #CBCCCD',
                                  padding: '8px',
                                  width: '15%'
                                }}
                              >
                                {formatDateForDisplay(schedule.scheduleDate)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#323334',
                                  borderBottom: '1px solid #CBCCCD',
                                  padding: '8px',
                                  width: '15%'
                                }}
                              >
                                {formatDateForDisplay(schedule.closeDate)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#323334',
                                  borderBottom: '1px solid #CBCCCD',
                                  padding: '8px',
                                  width: '15%'
                                }}
                              >
                                {formatDateForDisplay(schedule.startDate)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#323334',
                                  borderBottom: '1px solid #CBCCCD',
                                  padding: '8px',
                                  width: '15%'
                                }}
                              >
                                {formatDateForDisplay(schedule.endDate)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#323334',
                                  borderBottom: '1px solid #CBCCCD',
                                  padding: '8px',
                                  width: '15%'
                                }}
                              >
                                {formatDateForDisplay(schedule.accountingDate)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#323334',
                                  borderBottom: '1px solid #CBCCCD',
                                  padding: '8px',
                                  width: '10%'
                                }}
                              >
                                <Checkbox
                                  checked={schedule.finalize === 'Y'}
                                  disabled
                                  size="small"
                                  sx={{
                                    padding: '4px',
                                    '&.Mui-checked': {
                                      color: '#002677'
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                <Box sx={{display: 'flex', gap: 0.5}}>
                                  <Tooltip title="Delete" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        handleDeleteSchedule(schedule.billCycleScheduleIdentifier);
                                      }}
                                      sx={{
                                        color: '#0C55B8',
                                        '&:hover': {
                                          backgroundColor: 'rgba(12, 85, 184, 0.04)'
                                        }
                                      }}
                                    >
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        handleEditSchedule(schedule);
                                      }}
                                      sx={{
                                        color: '#0C55B8',
                                        '&:hover': {
                                          backgroundColor: 'rgba(12, 85, 184, 0.04)'
                                        }
                                      }}
                                    >
                                      <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            padding: '16px 24px',
            borderTop: '1px solid #CBCCCD',
            gap: '12px'
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isSaving}
            variant="outlined"
            sx={{
              borderColor: '#002677',
              color: '#002677',
              borderRadius: '46px',
              padding: '6px 24px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
              '&:hover': {
                borderColor: '#001a5c',
                backgroundColor: 'rgba(0, 38, 119, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="contained"
            sx={{
              backgroundColor: '#002677',
              color: '#FFFFFF',
              borderRadius: '46px',
              padding: '6px 24px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
              '&:hover': {
                backgroundColor: '#001a5c'
              },
              '&:disabled': {
                backgroundColor: '#CBCCCD',
                color: '#FFFFFF'
              }
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Bill Cycle Schedule Dialog */}
      <GenerateScheduleDialog
        open={generateScheduleOpen}
        onClose={() => {
          setGenerateScheduleOpen(false);
        }}
        onGenerate={handleGenerateSchedule}
        billingPeriod={formData.billingPeriod}
        billCycleCode={formData.billCycleCode}
      />
    </>
  );
}

export default BillCycleDialog;
