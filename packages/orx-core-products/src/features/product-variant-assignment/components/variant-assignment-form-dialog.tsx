import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  MenuItem,
  Switch,
  Snackbar,
  Alert,
  Menu
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {variantAssignmentSchema, VariantAssignmentSchemaType} from '../schemas/variant-assignment-schema';
import {handleFocusTrap, saveFocusedElement, restoreFocusedElement, focusFirstElement} from '../utils/focus-trap';
import {variantAssignmentApiService, type VariantOption} from '../services';

/**
 * Props for VariantAssignmentFormDialog component
 */
export interface VariantAssignmentFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  productGroup: string;
  initialValues?: Partial<VariantAssignmentSchemaType>;
  onClose: () => void;
  onSubmit: (data: VariantAssignmentSchemaType) => Promise<void>;
  loading?: boolean;
}

/**
 * VariantAssignmentFormDialog component
 * Modal dialog for creating or editing variant assignments with form validation
 *
 * Requirements:
 * - 4.1: Opens dialog for creating new variant assignment
 * - 4.2: Requires Assigned Product Variant field
 * - 4.3: Allows setting boolean values for Predefined List, Transaction Processing, Price Determination
 * - 4.4: Allows specifying Start Date and End Date
 * - 4.5: Saves valid assignment and refreshes table
 * - 4.6: Displays validation errors and prevents invalid submission
 * - 4.7: Validates date range (Start Date <= End Date)
 * - 5.1: Opens dialog pre-populated with current data for editing
 * - 5.2: Allows modification of all editable fields
 * - 5.3: Updates assignment and refreshes table on save
 * - 5.4: Closes dialog without saving on cancel
 * - 5.5: Displays validation errors and prevents invalid submission
 * - 12.2: Shows loading state during submission
 */
export const VariantAssignmentFormDialog: React.FC<VariantAssignmentFormDialogProps> = ({
  open,
  mode,
  productGroup,
  initialValues,
  onClose,
  onSubmit,
  loading = false
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Tab state management
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  // Refs for tab panels
  const detailsTabPanelRef = useRef<HTMLDivElement>(null);
  const valuesTabPanelRef = useRef<HTMLDivElement>(null);

  // Variants dropdown state
  const [availableVariants, setAvailableVariants] = useState<VariantOption[]>([]);
  const [variantsLoading, setVariantsLoading] = useState<boolean>(false);
  const [variantMenuAnchor, setVariantMenuAnchor] = useState<null | HTMLElement>(null);
  const [defaultValueMenuAnchor, setDefaultValueMenuAnchor] = useState<null | HTMLElement>(null);

  // Data types dropdown state
  const [dataTypes, setDataTypes] = useState<{value: string; displayName: string}[]>([]);
  const [dataTypesLoading, setDataTypesLoading] = useState<boolean>(false);

  // Screen reader announcements
  const [tabAnnouncement, setTabAnnouncement] = useState<string>('');
  const [errorAnnouncement, setErrorAnnouncement] = useState<string>('');

  // Error notification state
  const [errorNotification, setErrorNotification] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: ''
  });

  // Track if this is the initial edit load to prevent auto-population from overwriting saved values
  const isInitialEditLoadRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors, isValid, isSubmitting}
  } = useForm<VariantAssignmentSchemaType>({
    resolver: zodResolver(variantAssignmentSchema),
    mode: 'onChange',
    defaultValues: {
      variantField: initialValues?.variantField || '',
      defaultValue: initialValues?.defaultValue || '',
      dataType: initialValues?.dataType || '',
      priorityOrder: initialValues?.priorityOrder || '',
      transactionProcessing: initialValues?.transactionProcessing || false,
      priceDetermination: initialValues?.priceDetermination || false,
      startDate: initialValues?.startDate || '',
      endDate: initialValues?.endDate || '',
      variantValues: initialValues?.variantValues || []
    }
  });

  // Watch variantValues for display in the table
  const variantValues = watch('variantValues');
  const selectedVariantField = watch('variantField');

  // Compute loading state
  const isLoading = useMemo(() => loading || isSubmitting, [loading, isSubmitting]);

  /**
   * Fetch available variants when dialog opens
   */
  useEffect(() => {
    const fetchVariants = async () => {
      if (open && availableVariants.length === 0 && productGroup) {
        setVariantsLoading(true);
        try {
          const variants = await variantAssignmentApiService.getAllVariants(productGroup);
          setAvailableVariants(variants);
        } catch (error) {
          console.error('Failed to fetch variants:', error);
          setErrorNotification({
            open: true,
            message: 'Failed to load available variants'
          });
        } finally {
          setVariantsLoading(false);
        }
      }
    };

    fetchVariants().catch((error: unknown) => {
      console.error('Failed to fetch variants:', error);
    });
  }, [open, availableVariants.length, productGroup]);

  /**
   * Fetch data types when dialog opens
   */
  useEffect(() => {
    const fetchDataTypes = async () => {
      if (open && dataTypes.length === 0) {
        setDataTypesLoading(true);
        try {
          const types = await variantAssignmentApiService.getDataTypes();
          setDataTypes(types);
        } catch (error) {
          console.error('Failed to fetch data types:', error);
          setErrorNotification({
            open: true,
            message: 'Failed to load data types'
          });
        } finally {
          setDataTypesLoading(false);
        }
      }
    };

    fetchDataTypes().catch((error: unknown) => {
      console.error('Failed to fetch data types:', error);
    });
  }, [open, dataTypes.length]);

  /**
   * Reset form when dialog opens or initialValues change
   * This ensures the form is populated with the correct data when editing
   * or cleared when creating a new assignment
   */
  useEffect(() => {
    if (open) {
      if (initialValues) {
        // Edit mode: populate with initial values
        // Important: API returns variant NAME, but form needs variant CODE for dropdown matching
        // Find the matching variant by NAME to get the CODE
        let variantCodeForDropdown = initialValues?.variantField || '';

        if (availableVariants.length > 0 && initialValues?.variantField) {
          const matchingVariant = availableVariants.find((v) => v.variantName === initialValues.variantField);
          if (matchingVariant) {
            variantCodeForDropdown = matchingVariant.variant; // Use the CODE for dropdown
          }
        }

        // Set flag to prevent auto-population from overwriting saved values
        isInitialEditLoadRef.current = true;

        reset({
          variantField: variantCodeForDropdown,
          defaultValue: initialValues?.defaultValue || '',
          dataType: initialValues?.dataType || '',
          priorityOrder: initialValues?.priorityOrder || '',
          transactionProcessing: initialValues?.transactionProcessing || false,
          priceDetermination: initialValues?.priceDetermination || false,
          startDate: initialValues?.startDate || '',
          endDate: initialValues?.endDate || '',
          variantValues: initialValues?.variantValues || []
        });

        // Fetch variant details in edit mode to populate variant values for the Default Value dropdown
        if (variantCodeForDropdown && availableVariants.length > 0) {
          const selectedVariant = availableVariants.find((v) => v.variant === variantCodeForDropdown);
          if (selectedVariant) {
            variantAssignmentApiService
              .getVariantById(selectedVariant.variant)
              .then((variantDetails) => {
                if (variantDetails.variantValues && variantDetails.variantValues.length > 0) {
                  setValue('variantValues', variantDetails.variantValues);
                }
              })
              .catch((error: unknown) => {
                console.error('Failed to fetch variant details in edit mode:', error);
              });
          }
        }

        // Reset flag after a short delay to allow the reset to complete
        setTimeout(() => {
          isInitialEditLoadRef.current = false;
        }, 100);
      } else {
        // Create mode: clear all fields
        isInitialEditLoadRef.current = false;
        reset({
          variantField: '',
          defaultValue: '',
          dataType: '',
          priorityOrder: '',
          transactionProcessing: false,
          priceDetermination: false,
          startDate: '',
          endDate: '',
          variantValues: []
        });
      }
    }
  }, [open, initialValues, reset, availableVariants]);

  /**
   * Populate variant values when a variant is selected
   * Fetches variant details from API to get variantValues array
   * In edit mode, fetch variant values but don't overwrite saved dataType and defaultValue
   */
  useEffect(() => {
    if (selectedVariantField && availableVariants.length > 0) {
      const selectedVariant = availableVariants.find((v) => v.variant === selectedVariantField);
      if (selectedVariant) {
        // Fetch variant details from API to get variant values
        const fetchVariantDetails = async () => {
          try {
            const variantDetails = await variantAssignmentApiService.getVariantById(selectedVariant.variant);

            // In edit mode (initial load), only populate variantValues, don't overwrite dataType or defaultValue
            // In create mode or when variant changes, populate dataType and clear defaultValue
            if (isInitialEditLoadRef.current) {
              // Edit mode: only populate variant values, preserve existing dataType and defaultValue
              if (variantDetails.variantValues && variantDetails.variantValues.length > 0) {
                setValue('variantValues', variantDetails.variantValues);
              }
            } else {
              // Create mode or variant changed: populate dataType and clear defaultValue
              setValue('dataType', variantDetails.dataType);

              if (variantDetails.variantValues && variantDetails.variantValues.length > 0) {
                setValue('variantValues', variantDetails.variantValues);
                // Clear default value when variant changes (user needs to select from new options)
                setValue('defaultValue', '');
              } else {
                // Clear variant values if no predefined values
                setValue('variantValues', []);
                setValue('defaultValue', '');
              }
            }
          } catch (error) {
            console.error('Failed to fetch variant details:', error);
            // Fallback to empty values on error
            if (!isInitialEditLoadRef.current) {
              setValue('variantValues', []);
              setValue('defaultValue', '');
            }
          }
        };

        fetchVariantDetails().catch((error: unknown) => {
          console.error('Error in fetchVariantDetails:', error);
        });
      }
    }
  }, [selectedVariantField, availableVariants, setValue]);

  /**
   * Manage focus on tab switch
   * Requirements:
   * - 19.2: Move focus to tab panel when tab changes
   * - 20.1: Announce tab changes to screen readers
   */
  useEffect(() => {
    if (open) {
      // Announce tab change to screen readers
      const tabName = activeTab === 0 ? 'Variant Details' : 'Variant Values';
      setTabAnnouncement(`${tabName} tab selected`);

      // Clear announcement after a short delay to allow it to be read
      const announcementTimer = setTimeout(() => {
        setTabAnnouncement('');
      }, 1000);

      // Focus the active tab panel when tab changes
      const activeTabPanelRef = activeTab === 0 ? detailsTabPanelRef : valuesTabPanelRef;
      if (activeTabPanelRef.current) {
        // Set tabindex to make the panel focusable
        activeTabPanelRef.current.setAttribute('tabindex', '-1');
        activeTabPanelRef.current.focus();
        // Remove tabindex after focusing to restore normal tab order
        setTimeout(() => {
          activeTabPanelRef.current?.removeAttribute('tabindex');
        }, 0);
      }

      return () => {
        clearTimeout(announcementTimer);
      };
    }

    return undefined;
  }, [activeTab, open]);

  /**
   * Announce validation errors to screen readers
   * Requirements:
   * - 20.2: Announce validation errors
   */
  useEffect(() => {
    if (open && Object.keys(errors).length > 0) {
      // Build error announcement message
      const errorFields = Object.keys(errors);
      const errorCount = errorFields.length;

      if (errorCount === 1) {
        const fieldName = errorFields[0];
        const errorMessage = errors[fieldName as keyof typeof errors]?.message;
        setErrorAnnouncement(`Error: ${errorMessage}`);
      } else {
        setErrorAnnouncement(`${errorCount} validation errors found. Please review the form.`);
      }

      // Clear announcement after a short delay
      const errorTimer = setTimeout(() => {
        setErrorAnnouncement('');
      }, 3000);

      return () => {
        clearTimeout(errorTimer);
      };
    } else if (open) {
      // Clear error announcement when no errors
      setErrorAnnouncement('');
    }

    return undefined;
  }, [errors, open]);

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue as 0 | 1);
  }, []);

  /**
   * Handle keyboard navigation for tabs
   * Requirements:
   * - 18.1: Arrow Left/Right to navigate tabs
   * - 18.1: Enter/Space to activate tab
   */
  const handleTabKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Arrow Left: Move to previous tab
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveTab((prev) => (prev === 0 ? 1 : 0));
    }
    // Arrow Right: Move to next tab
    else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveTab((prev) => (prev === 1 ? 0 : 1));
    }
    // Enter or Space: Activate the focused tab (handled by MUI Tab component)
    // No additional handling needed as MUI Tab already supports this
  }, []);

  /**
   * Handle dialog close and reset form
   * Requirements:
   * - 12.3: Reset form to initial values
   * - 12.3: Reset active tab to 0
   */
  const handleClose = useCallback(() => {
    reset();
    setActiveTab(0); // Reset to first tab
    setErrorNotification({open: false, message: ''}); // Clear error notification
    onClose();
  }, [reset, onClose]);

  /**
   * Handle keyboard navigation for the dialog
   * Requirements:
   * - 18.2: Escape to close dialog
   * - 18.2: Enter to submit form (handled by form element)
   */
  const handleDialogKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Escape: Close dialog
      if (event.key === 'Escape' && !isLoading) {
        event.preventDefault();
        handleClose();
      }
    },
    [isLoading, handleClose]
  );

  /**
   * Handle focus trap and focus management
   * Requirements:
   * - 19.1: Set initial focus on dialog open
   * - 19.3: Restore focus on dialog close
   * - 18.3: Implement focus trap
   */
  useEffect(() => {
    if (open) {
      // Save the element that opened the dialog
      saveFocusedElement();

      // Focus the first element in the dialog after a short delay
      // This allows the dialog to fully render before focusing
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
    } else {
      // Restore focus when dialog closes
      restoreFocusedElement();
    }

    return undefined;
  }, [open]);

  /**
   * Handle form submission
   * Requirements:
   * - 12.2: Handle async submission
   * - 12.2: Handle success case (close dialog)
   * - 12.2: Handle error case (show error notification)
   * - 22.2: Display user-friendly error messages
   * - 22.2: Preserve form state on error
   */
  const handleFormSubmit = async (data: VariantAssignmentSchemaType) => {
    try {
      await onSubmit(data);
      // Only close dialog on successful submission
      handleClose();
    } catch (error) {
      // Display user-friendly error notification
      // Form stays open to preserve form state and allow user to retry
      let errorMessage = 'An error occurred while saving the variant assignment. Please try again.';

      // Extract more specific error message if available
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as {message: unknown}).message) || errorMessage;
      }

      // Check for network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as {code: unknown}).code;
        if (errorCode === 'ECONNABORTED' || errorCode === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }

      // Show error notification
      setErrorNotification({
        open: true,
        message: errorMessage
      });

      console.error('Form submission error:', error);
    }
  };

  /**
   * Handle error notification close
   */
  const handleErrorNotificationClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    // Don't close on clickaway to ensure user sees the error
    if (reason === 'clickaway') {
      return;
    }

    setErrorNotification((prev) => ({
      ...prev,
      open: false
    }));
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      aria-labelledby="variant-assignment-dialog-title"
      aria-describedby="variant-assignment-dialog-description"
      onKeyDown={handleDialogKeyDown}
      PaperProps={{
        ref: dialogRef,
        sx: {
          width: '852px',
          minHeight: activeTab === 0 ? '676px' : '652px',
          borderRadius: '24px',
          padding: '24px',
          backgroundColor: '#F8F8F8',
          boxShadow:
            '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      {/* Screen Reader Live Regions */}
      {/* Live region for tab change announcements */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {tabAnnouncement}
      </Box>

      {/* Alert region for validation error announcements */}
      <Box
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {errorAnnouncement}
      </Box>

      {/* Dialog Header */}
      <DialogTitle
        id="variant-assignment-dialog-title"
        sx={{
          padding: 0,
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '28.83px',
            lineHeight: '36px',
            color: '#002677'
          }}
        >
          Assign Product Variant
        </Typography>
        <IconButton
          onClick={handleClose}
          aria-label="Close dialog"
          disabled={isLoading}
          sx={{
            padding: '7px',
            color: '#323334',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            },
            '&.Mui-disabled': {
              color: '#9E9E9E'
            }
          }}
        >
          <CloseIcon sx={{fontSize: '18px'}} />
        </IconButton>
      </DialogTitle>

      {/* Tabs Component */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        onKeyDown={handleTabKeyDown}
        role="tablist"
        sx={{
          width: '100%',
          minHeight: '56px',
          padding: '16px 0px 0px',
          marginBottom: '24px',
          '& .MuiTabs-flexContainer': {
            width: '100%'
          },
          '& .MuiTabs-indicator': {
            display: 'none' // Custom underline per tab
          }
        }}
        aria-label="Variant assignment form tabs"
      >
        <Tab
          label="Variant Details"
          value={0}
          id="tab-0"
          aria-controls="tabpanel-0"
          sx={{
            flex: 1,
            maxWidth: 'none',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '24px',
            textTransform: 'none',
            color: activeTab === 0 ? '#002677' : '#0C55B8',
            padding: '0px 16px',
            minHeight: 'unset',
            borderBottom: activeTab === 0 ? '3px solid #FF612B' : '1px solid #B1B2B4',
            marginBottom: activeTab === 0 ? '13px' : '15px',
            '&:hover': {
              color: '#002677'
            }
          }}
        />
        <Tab
          label="Variant Values"
          value={1}
          id="tab-1"
          aria-controls="tabpanel-1"
          sx={{
            flex: 1,
            maxWidth: 'none',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '24px',
            textTransform: 'none',
            color: activeTab === 1 ? '#002677' : '#0C55B8',
            padding: '0px 16px',
            minHeight: 'unset',
            borderBottom: activeTab === 1 ? '3px solid #FF612B' : '1px solid #B1B2B4',
            marginBottom: activeTab === 1 ? '13px' : '15px',
            '&:hover': {
              color: '#002677'
            }
          }}
        />
      </Tabs>

      {/* Dialog Content */}
      <DialogContent sx={{padding: 0, overflow: 'auto'}} id="variant-assignment-dialog-description">
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          aria-label="Variant assignment form"
          sx={{pb: 0}}
        >
          {/* Tab Panel: Variant Details */}
          <Box
            ref={detailsTabPanelRef}
            role="tabpanel"
            id="tabpanel-0"
            aria-labelledby="tab-0"
            hidden={activeTab !== 0}
            sx={{
              width: '804px',
              display: activeTab === 0 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '40px',
              outline: 'none' // Remove focus outline when programmatically focused
            }}
          >
            {/* Row 1: Variant Field & Default Value */}
            <Box sx={{display: 'flex', gap: '24px'}}>
              {/* Variant Field Column */}
              <Box sx={{width: '390px'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', mb: '8px'}}>
                  <Typography
                    component="label"
                    htmlFor="variantField"
                    sx={{
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '22.4px',
                      color: '#323334'
                    }}
                  >
                    Variant Field <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label="Information about variant field"
                    aria-haspopup="dialog"
                    sx={{padding: 0, width: '18px', height: '18px'}}
                  >
                    <InfoOutlinedIcon sx={{fontSize: '18px', color: '#0066F5'}} />
                  </IconButton>
                </Box>

                <Controller
                  name="variantField"
                  control={control}
                  render={({field: {onChange, value}}) => {
                    const selectedVariant = availableVariants.find((v) => v.variant === value);
                    const displayValue = selectedVariant ? selectedVariant.variant : '';

                    return (
                      <Box sx={{position: 'relative'}}>
                        <TextField
                          id="variantField"
                          fullWidth
                          value={displayValue}
                          placeholder="Select variant field"
                          error={!!errors.variantField}
                          disabled={isLoading}
                          onClick={(e) => {
                            setVariantMenuAnchor(e.currentTarget);
                          }}
                          inputProps={{
                            'aria-label': 'Variant Field',
                            'aria-required': 'true',
                            'aria-invalid': !!errors.variantField,
                            'aria-describedby': errors.variantField ? 'variantField-error' : 'variantField-helper',
                            readOnly: true,
                            style: {cursor: 'pointer'}
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '40px',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px 0px 0px 4px',
                              paddingRight: '40px',
                              '& fieldset': {
                                borderColor: '#4B4D4F',
                                borderWidth: '1px'
                              },
                              '&:hover fieldset': {
                                borderColor: '#323334',
                                borderWidth: '1px'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#0066F5',
                                borderWidth: '2px'
                              },
                              '&.Mui-error fieldset': {
                                borderColor: '#D32F2F',
                                borderWidth: '1px'
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '20px',
                              color: '#323334',
                              padding: '10px 12px',
                              cursor: 'pointer',
                              '&::placeholder': {
                                color: '#757575',
                                opacity: 1
                              }
                            }
                          }}
                        />
                        <IconButton
                          onClick={(e) => {
                            setVariantMenuAnchor(e.currentTarget.previousElementSibling as HTMLElement);
                          }}
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#002677',
                            borderRadius: '0px 4px 4px 0px',
                            '&:hover': {
                              backgroundColor: '#001a5c'
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#E0E0E0'
                            }
                          }}
                          aria-label="Search variant field"
                          disabled={isLoading}
                        >
                          <SearchIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                        </IconButton>
                        <Menu
                          anchorEl={variantMenuAnchor}
                          open={Boolean(variantMenuAnchor)}
                          onClose={() => {
                            setVariantMenuAnchor(null);
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                maxHeight: 300,
                                width: variantMenuAnchor?.offsetWidth || 350,
                                mt: 0.5
                              }
                            }
                          }}
                        >
                          {variantsLoading && (
                            <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                              <CircularProgress size={24} />
                            </Box>
                          )}
                          {!variantsLoading && availableVariants.length === 0 && (
                            <MenuItem disabled>No variants available</MenuItem>
                          )}
                          {!variantsLoading &&
                            availableVariants.length > 0 &&
                            availableVariants.map((variant) => (
                              <MenuItem
                                key={variant.variant}
                                selected={value === variant.variant}
                                onClick={() => {
                                  onChange(variant.variant);
                                  setVariantMenuAnchor(null);
                                }}
                              >
                                {variant.variant}
                              </MenuItem>
                            ))}
                        </Menu>
                      </Box>
                    );
                  }}
                />

                {/* Error Text */}
                {errors.variantField && (
                  <Typography
                    id="variantField-error"
                    role="alert"
                    sx={{fontWeight: 400, fontSize: '14px', lineHeight: '19.6px', color: '#D32F2F', mt: '4px'}}
                  >
                    {errors.variantField.message}
                  </Typography>
                )}
              </Box>

              {/* Default Value Column */}
              {variantValues && variantValues.length > 0 && (
                <Box sx={{width: '390px'}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', mb: '8px'}}>
                    <Typography
                      component="label"
                      htmlFor="defaultValue"
                      sx={{fontWeight: 700, fontSize: '16px', lineHeight: '22.4px', color: '#323334'}}
                    >
                      Default Value
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Information about default value"
                      aria-haspopup="dialog"
                      sx={{padding: 0, width: '18px', height: '18px'}}
                    >
                      <InfoOutlinedIcon sx={{fontSize: '18px', color: '#0066F5'}} />
                    </IconButton>
                  </Box>

                  <Controller
                    name="defaultValue"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <Box sx={{position: 'relative'}}>
                        <TextField
                          id="defaultValue"
                          fullWidth
                          value={value}
                          placeholder="Select default value"
                          error={!!errors.defaultValue}
                          disabled={isLoading}
                          onClick={(e) => {
                            if (variantValues.length > 0) {
                              setDefaultValueMenuAnchor(e.currentTarget);
                            }
                          }}
                          inputProps={{
                            'aria-label': 'Default Value',
                            'aria-invalid': !!errors.defaultValue,
                            'aria-describedby': errors.defaultValue ? 'defaultValue-error' : 'defaultValue-helper',
                            readOnly: variantValues.length > 0,
                            style: {cursor: variantValues.length > 0 ? 'pointer' : 'text'}
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '40px',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px 0px 0px 4px',
                              paddingRight: '40px',
                              '& fieldset': {
                                borderColor: '#4B4D4F',
                                borderWidth: '1px'
                              },
                              '&:hover fieldset': {
                                borderColor: '#323334',
                                borderWidth: '1px'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#0066F5',
                                borderWidth: '2px'
                              },
                              '&.Mui-error fieldset': {
                                borderColor: '#D32F2F',
                                borderWidth: '1px'
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '20px',
                              color: '#323334',
                              padding: '10px 12px',
                              cursor: variantValues.length > 0 ? 'pointer' : 'text',
                              '&::placeholder': {
                                color: '#757575',
                                opacity: 1
                              }
                            }
                          }}
                        />
                        <IconButton
                          onClick={(e) => {
                            if (variantValues.length > 0) {
                              setDefaultValueMenuAnchor(e.currentTarget.previousElementSibling as HTMLElement);
                            }
                          }}
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#002677',
                            borderRadius: '0px 4px 4px 0px',
                            '&:hover': {
                              backgroundColor: '#001a5c'
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#E0E0E0'
                            }
                          }}
                          aria-label="Search default value"
                          disabled={isLoading || variantValues.length === 0}
                        >
                          <SearchIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                        </IconButton>
                        <Menu
                          anchorEl={defaultValueMenuAnchor}
                          open={Boolean(defaultValueMenuAnchor)}
                          onClose={() => {
                            setDefaultValueMenuAnchor(null);
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                maxHeight: 300,
                                width: defaultValueMenuAnchor?.offsetWidth || 350,
                                mt: 0.5
                              }
                            }
                          }}
                        >
                          {variantValues.length === 0 ? (
                            <MenuItem disabled>No values available</MenuItem>
                          ) : (
                            variantValues.map((vv) => (
                              <MenuItem
                                key={vv.value}
                                selected={value === vv.value}
                                onClick={() => {
                                  onChange(vv.value);
                                  setDefaultValueMenuAnchor(null);
                                }}
                              >
                                {vv.value} - {vv.description}
                              </MenuItem>
                            ))
                          )}
                        </Menu>
                      </Box>
                    )}
                  />

                  {/* Helper Text */}
                  <Typography
                    id="defaultValue-helper"
                    sx={{fontWeight: 400, fontSize: '14px', lineHeight: '19.6px', color: '#6D6F70', mt: '4px'}}
                  >
                    Active Employees
                  </Typography>

                  {/* Error Text */}
                  {errors.defaultValue && (
                    <Typography
                      id="defaultValue-error"
                      role="alert"
                      sx={{fontWeight: 400, fontSize: '14px', lineHeight: '19.6px', color: '#D32F2F', mt: '4px'}}
                    >
                      {errors.defaultValue.message}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Row 2: Data Type & Priority Order */}
            <Box sx={{display: 'flex', gap: '24px'}}>
              {/* Data Type Column */}
              <Box sx={{width: '390px'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', mb: '8px'}}>
                  <Typography
                    component="label"
                    htmlFor="dataType"
                    sx={{fontWeight: 700, fontSize: '16px', lineHeight: '22.4px', color: '#323334'}}
                  >
                    Data Type
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label="Information about data type"
                    aria-haspopup="dialog"
                    sx={{padding: 0, width: '18px', height: '18px'}}
                  >
                    <InfoOutlinedIcon sx={{fontSize: '18px', color: '#0066F5'}} />
                  </IconButton>
                </Box>

                <Controller
                  name="dataType"
                  control={control}
                  render={({field}) => (
                    <TextField
                      {...field}
                      id="dataType"
                      select
                      fullWidth
                      placeholder="data type"
                      disabled={isLoading || dataTypesLoading}
                      SelectProps={{
                        native: false,
                        IconComponent: ExpandMoreIcon,
                        displayEmpty: true
                      }}
                      inputProps={{
                        'aria-label': 'Data Type',
                        'aria-invalid': !!errors.dataType,
                        'aria-describedby': errors.dataType ? 'dataType-error' : undefined
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '40px',
                          backgroundColor: field.value ? '#FFFFFF' : '#E5E5E6',
                          borderRadius: '4px',
                          '& fieldset': {
                            borderColor: field.value ? '#4B4D4F' : 'transparent',
                            borderWidth: '1px'
                          },
                          '&:hover fieldset': {
                            borderColor: field.value ? '#323334' : '#4B4D4F',
                            borderWidth: '1px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#0066F5',
                            borderWidth: '2px'
                          },
                          '&.Mui-error fieldset': {
                            borderColor: '#D32F2F',
                            borderWidth: '1px'
                          }
                        },
                        '& .MuiInputBase-input': {
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '22.4px',
                          color: '#323334',
                          padding: '8.5px 12px',
                          '&::placeholder': {
                            color: '#757575',
                            opacity: 1
                          }
                        },
                        '& .MuiSelect-icon': {
                          color: '#323334'
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        <Typography sx={{fontWeight: 400, fontSize: '16px', color: '#757575'}}>
                          {dataTypesLoading ? 'Loading...' : 'data type'}
                        </Typography>
                      </MenuItem>
                      {dataTypes.map((dataType) => (
                        <MenuItem key={dataType.value} value={dataType.value}>
                          {dataType.displayName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                {/* Error Text */}
                {errors.dataType && (
                  <Typography
                    id="dataType-error"
                    role="alert"
                    sx={{fontWeight: 400, fontSize: '14px', lineHeight: '19.6px', color: '#D32F2F', mt: '4px'}}
                  >
                    {errors.dataType.message}
                  </Typography>
                )}
              </Box>

              {/* Priority Order Column */}
              <Box sx={{width: '390px'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', mb: '8px'}}>
                  <Typography
                    component="label"
                    htmlFor="priorityOrder"
                    sx={{fontWeight: 700, fontSize: '16px', lineHeight: '22.4px', color: '#323334'}}
                  >
                    Priority Order <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label="Information about priority order"
                    aria-haspopup="dialog"
                    sx={{padding: 0, width: '18px', height: '18px'}}
                  >
                    <InfoOutlinedIcon sx={{fontSize: '18px', color: '#0066F5'}} />
                  </IconButton>
                </Box>

                <Controller
                  name="priorityOrder"
                  control={control}
                  render={({field}) => (
                    <TextField
                      {...field}
                      id="priorityOrder"
                      select
                      fullWidth
                      placeholder="Enter or select priority order"
                      error={!!errors.priorityOrder}
                      disabled={isLoading}
                      SelectProps={{
                        native: false,
                        IconComponent: ExpandMoreIcon,
                        displayEmpty: true
                      }}
                      inputProps={{
                        'aria-label': 'Priority Order',
                        'aria-required': 'true',
                        'aria-invalid': !!errors.priorityOrder,
                        'aria-describedby': errors.priorityOrder ? 'priorityOrder-error' : undefined
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '40px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '4px',
                          '& fieldset': {
                            borderColor: '#4B4D4F',
                            borderWidth: '1px'
                          },
                          '&:hover fieldset': {
                            borderColor: '#323334',
                            borderWidth: '1px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#0066F5',
                            borderWidth: '2px'
                          },
                          '&.Mui-error fieldset': {
                            borderColor: '#D32F2F',
                            borderWidth: '1px'
                          }
                        },
                        '& .MuiInputBase-input': {
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '22.4px',
                          color: '#323334',
                          padding: '8.5px 12px',
                          '&::placeholder': {
                            color: '#757575',
                            opacity: 1
                          }
                        },
                        '& .MuiSelect-icon': {
                          color: '#323334'
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        <Typography sx={{fontWeight: 400, fontSize: '16px', color: '#757575'}}>
                          Enter or select priority order
                        </Typography>
                      </MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                      <MenuItem value="5">5</MenuItem>
                      <MenuItem value="6">6</MenuItem>
                      <MenuItem value="7">7</MenuItem>
                      <MenuItem value="8">8</MenuItem>
                      <MenuItem value="9">9</MenuItem>
                      <MenuItem value="10">10</MenuItem>
                    </TextField>
                  )}
                />

                {/* Error Text */}
                {errors.priorityOrder && (
                  <Typography
                    id="priorityOrder-error"
                    role="alert"
                    sx={{fontWeight: 400, fontSize: '14px', lineHeight: '19.6px', color: '#D32F2F', mt: '4px'}}
                  >
                    {errors.priorityOrder.message}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Row 3: Transaction Processing & Price Determination */}
            <Box sx={{display: 'flex', gap: '24px'}}>
              {/* Transaction Processing Column */}
              <Box sx={{width: '390px'}}>
                <Typography
                  id="transactionProcessing-label"
                  sx={{fontWeight: 500, fontSize: '16px', lineHeight: '22.4px', color: '#000000', mb: '12px'}}
                >
                  Transaction Processing
                </Typography>

                <Controller
                  name="transactionProcessing"
                  control={control}
                  render={({field}) => (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Switch
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                        disabled={isLoading}
                        size="small"
                        inputProps={{
                          'aria-label': 'Transaction Processing',
                          'aria-labelledby': 'transactionProcessing-label',
                          'aria-checked': field.value
                        }}
                        sx={{
                          width: 42,
                          height: 26,
                          padding: 0,
                          '& .MuiSwitch-switchBase': {
                            padding: 0,
                            margin: '3px',
                            transitionDuration: '300ms',
                            '&.Mui-checked': {
                              transform: 'translateX(16px)',
                              color: '#fff',
                              '& + .MuiSwitch-track': {
                                backgroundColor: '#002677',
                                opacity: 1,
                                border: 0
                              }
                            }
                          },
                          '& .MuiSwitch-thumb': {
                            boxSizing: 'border-box',
                            width: 20,
                            height: 20
                          },
                          '& .MuiSwitch-track': {
                            borderRadius: 26 / 2,
                            backgroundColor: '#E9E9EA',
                            opacity: 1
                          }
                        }}
                      />
                    </Box>
                  )}
                />
              </Box>

              {/* Price Determination Column */}
              <Box sx={{width: '390px'}}>
                <Typography
                  id="priceDetermination-label"
                  sx={{fontWeight: 500, fontSize: '16px', lineHeight: '22.4px', color: '#000000', mb: '12px'}}
                >
                  Price Determination
                </Typography>

                <Controller
                  name="priceDetermination"
                  control={control}
                  render={({field}) => (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Switch
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                        disabled={isLoading}
                        size="small"
                        inputProps={{
                          'aria-label': 'Price Determination',
                          'aria-labelledby': 'priceDetermination-label',
                          'aria-checked': field.value
                        }}
                        sx={{
                          width: 42,
                          height: 26,
                          padding: 0,
                          '& .MuiSwitch-switchBase': {
                            padding: 0,
                            margin: '3px',
                            transitionDuration: '300ms',
                            '&.Mui-checked': {
                              transform: 'translateX(16px)',
                              color: '#fff',
                              '& + .MuiSwitch-track': {
                                backgroundColor: '#002677',
                                opacity: 1,
                                border: 0
                              }
                            }
                          },
                          '& .MuiSwitch-thumb': {
                            boxSizing: 'border-box',
                            width: 20,
                            height: 20
                          },
                          '& .MuiSwitch-track': {
                            borderRadius: 26 / 2,
                            backgroundColor: '#E9E9EA',
                            opacity: 1
                          }
                        }}
                      />
                    </Box>
                  )}
                />
              </Box>
            </Box>

            {/* Row 4: Start Date & End Date */}
            <Box sx={{display: 'flex', gap: '24px'}} role="group" aria-labelledby="date-range-label">
              <Typography id="date-range-label" sx={{position: 'absolute', left: '-10000px'}}>
                Date Range
              </Typography>
              {/* Start Date */}
              <Box sx={{width: '390px'}}>
                <Typography
                  component="label"
                  htmlFor="startDate"
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#323334',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Start Date <span style={{color: '#D32F2F'}}>*</span>
                </Typography>
                <Controller
                  name="startDate"
                  control={control}
                  render={({field: {onChange, value, ...field}}) => {
                    const [openDate, setOpenDate] = React.useState(false);

                    return (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{position: 'relative'}}>
                          <DatePicker
                            {...field}
                            open={openDate}
                            onClose={() => {
                              setOpenDate(false);
                            }}
                            value={value ? dayjs(value) : null}
                            onChange={(newValue: Dayjs | null) => {
                              onChange(newValue ? newValue.format('YYYY-MM-DD') : null);
                            }}
                            disabled={isLoading}
                            slots={{
                              openPickerButton: () => null
                            }}
                            slotProps={{
                              textField: {
                                id: 'startDate',
                                fullWidth: true,
                                error: !!errors.startDate,
                                placeholder: '_ _ /_ _ /_ _',
                                onClick: () => {
                                  if (!isLoading) {
                                    setOpenDate(true);
                                  }
                                },
                                inputProps: {
                                  'aria-label': 'Start Date',
                                  'aria-required': 'true',
                                  'aria-invalid': !!errors.startDate,
                                  'aria-describedby': errors.startDate ? 'startDate-error' : undefined
                                },
                                sx: {
                                  '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '4px 0px 0px 4px',
                                    paddingRight: '40px',
                                    '& fieldset': {
                                      borderColor: '#4B4D4F',
                                      borderWidth: '1px'
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#323334',
                                      borderWidth: '1px'
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#0066F5',
                                      borderWidth: '2px'
                                    },
                                    '&.Mui-error fieldset': {
                                      borderColor: '#D32F2F',
                                      borderWidth: '1px'
                                    }
                                  },
                                  '& .MuiInputBase-input': {
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '20px',
                                    color: '#323334',
                                    padding: '10px 12px',
                                    '&::placeholder': {
                                      color: '#757575',
                                      opacity: 1
                                    }
                                  },
                                  '& .MuiFormHelperText-root': {
                                    display: 'none' // Hide MUI's built-in helper text
                                  }
                                }
                              }
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              if (!isLoading) {
                                setOpenDate(true);
                              }
                            }}
                            disabled={isLoading}
                            aria-label="Open start date picker"
                            sx={{
                              position: 'absolute',
                              right: '0',
                              top: '0',
                              backgroundColor: '#002677',
                              borderRadius: '0 4px 4px 0',
                              width: '40px',
                              height: '40px',
                              '&:hover': {
                                backgroundColor: '#001a5c'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#E0E0E0'
                              }
                            }}
                          >
                            <CalendarTodayIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                          </IconButton>
                        </Box>

                        {/* Error Text */}
                        {errors.startDate && (
                          <Typography
                            id="startDate-error"
                            role="alert"
                            sx={{fontWeight: 400, fontSize: '14px', lineHeight: '19.6px', color: '#D32F2F', mt: '4px'}}
                          >
                            {errors.startDate.message}
                          </Typography>
                        )}
                      </LocalizationProvider>
                    );
                  }}
                />
              </Box>

              {/* End Date */}
              <Box sx={{width: '390px'}}>
                <Typography
                  component="label"
                  htmlFor="endDate"
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#323334',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  End Date
                </Typography>
                <Controller
                  name="endDate"
                  control={control}
                  render={({field: {onChange, value, ...field}}) => {
                    const [openDate, setOpenDate] = React.useState(false);

                    return (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{position: 'relative'}}>
                          <DatePicker
                            {...field}
                            open={openDate}
                            onClose={() => {
                              setOpenDate(false);
                            }}
                            value={value ? dayjs(value) : null}
                            onChange={(newValue: Dayjs | null) => {
                              onChange(newValue ? newValue.format('YYYY-MM-DD') : null);
                            }}
                            disabled={isLoading}
                            slots={{
                              openPickerButton: () => null
                            }}
                            slotProps={{
                              textField: {
                                id: 'endDate',
                                fullWidth: true,
                                error: !!errors.endDate,
                                placeholder: '_ _ /_ _ /_ _',
                                onClick: () => {
                                  if (!isLoading) {
                                    setOpenDate(true);
                                  }
                                },
                                inputProps: {
                                  'aria-label': 'End Date',
                                  'aria-invalid': !!errors.endDate,
                                  'aria-describedby': errors.endDate ? 'endDate-error' : undefined
                                },
                                sx: {
                                  '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '4px 0px 0px 4px',
                                    paddingRight: '40px',
                                    '& fieldset': {
                                      borderColor: '#4B4D4F',
                                      borderWidth: '1px'
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#323334',
                                      borderWidth: '1px'
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#0066F5',
                                      borderWidth: '2px'
                                    },
                                    '&.Mui-error fieldset': {
                                      borderColor: '#D32F2F',
                                      borderWidth: '1px'
                                    }
                                  },
                                  '& .MuiInputBase-input': {
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '20px',
                                    color: '#323334',
                                    padding: '10px 12px',
                                    '&::placeholder': {
                                      color: '#757575',
                                      opacity: 1
                                    }
                                  },
                                  '& .MuiFormHelperText-root': {
                                    display: 'none' // Hide MUI's built-in helper text
                                  }
                                }
                              }
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              if (!isLoading) {
                                setOpenDate(true);
                              }
                            }}
                            disabled={isLoading}
                            aria-label="Open end date picker"
                            sx={{
                              position: 'absolute',
                              right: '0',
                              top: '0',
                              backgroundColor: '#002677',
                              borderRadius: '0 4px 4px 0',
                              width: '40px',
                              height: '40px',
                              '&:hover': {
                                backgroundColor: '#001a5c'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#E0E0E0'
                              }
                            }}
                          >
                            <CalendarTodayIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                          </IconButton>
                        </Box>

                        {/* Error Text - includes cross-field validation errors */}
                        {errors.endDate && (
                          <Typography
                            id="endDate-error"
                            role="alert"
                            sx={{fontWeight: 400, fontSize: '14px', lineHeight: '19.6px', color: '#D32F2F', mt: '4px'}}
                          >
                            {errors.endDate.message}
                          </Typography>
                        )}
                      </LocalizationProvider>
                    );
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Tab Panel: Variant Values */}
          <Box
            ref={valuesTabPanelRef}
            role="tabpanel"
            id="tabpanel-1"
            aria-labelledby="tab-1"
            hidden={activeTab !== 1}
            sx={{
              width: '804px',
              display: activeTab === 1 ? 'flex' : 'none',
              flexDirection: 'column',
              marginBottom: '40px',
              outline: 'none' // Remove focus outline when programmatically focused
            }}
          >
            {/* Table Header */}
            <Box
              sx={{
                display: 'flex',
                gap: '64px',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E5E5E6'
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '19.6px',
                  color: '#000000'
                }}
              >
                Value
              </Typography>
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '19.6px',
                  color: '#000000'
                }}
              >
                Description
              </Typography>
            </Box>

            {/* Table Body - Scrollable */}
            <Box
              sx={{
                maxHeight: '300px',
                overflowY: 'auto',
                position: 'relative',
                '&::-webkit-scrollbar': {
                  width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#D9D9D9',
                  borderRadius: '4px',
                  border: '1px solid #E5E5E6'
                }
              }}
            >
              {variantValues && variantValues.length > 0 ? (
                variantValues.map((item) => (
                  <Box
                    key={item.value}
                    sx={{
                      display: 'flex',
                      gap: '64px',
                      padding: '16px',
                      backgroundColor: '#FAFAFA'
                    }}
                  >
                    <Typography
                      sx={{
                        flex: 1,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '22.4px',
                        color: '#4B4D4F'
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      sx={{
                        flex: 1,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '22.4px',
                        color: '#4B4D4F'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '48px 16px',
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '22.4px',
                      color: '#6D6F70',
                      textAlign: 'center'
                    }}
                  >
                    No variant values available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Action Buttons - Fixed at bottom */}
      <DialogActions
        sx={{
          padding: '24px 40px',
          borderTop: '1px solid #E0E0E0',
          gap: '8px',
          justifyContent: 'flex-start'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px'
          }}
          role="group"
          aria-label="Form actions"
        >
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            disabled={!isValid || isLoading}
            aria-label={mode === 'create' ? 'Save new variant assignment' : 'Save variant assignment changes'}
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '20px',
              textTransform: 'none',
              width: '85px',
              height: '40px',
              padding: '10px 24px',
              borderRadius: '46px',
              backgroundColor: '#002677',
              color: '#FBF9F4',
              minWidth: 'unset',
              '&:hover': {
                backgroundColor: '#001a5c'
              },
              '&.Mui-disabled': {
                backgroundColor: '#E0E0E0',
                color: '#9E9E9E'
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} sx={{color: '#9E9E9E'}} /> : 'Save'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Cancel and close dialog"
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '20px',
              textTransform: 'none',
              width: '101px',
              height: '40px',
              padding: '10px 24px',
              borderRadius: '46px',
              backgroundColor: '#FFFFFF',
              color: '#323334',
              borderColor: '#323334',
              borderWidth: '1px',
              minWidth: 'unset',
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
        </Box>
      </DialogActions>

      {/* Error Notification Snackbar */}
      <Snackbar
        open={errorNotification.open}
        autoHideDuration={6000}
        onClose={handleErrorNotificationClose}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        sx={{
          top: '24px !important'
        }}
      >
        <Alert
          onClose={handleErrorNotificationClose}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#D32F2F',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              color: '#FFFFFF'
            }
          }}
        >
          {errorNotification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
