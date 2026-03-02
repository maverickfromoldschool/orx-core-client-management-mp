/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
/* eslint-disable @uhg-skyline/optum/no-long-files */

import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider
} from '@mui/material';
import ArrowBackIosOutlined from '@mui/icons-material/ArrowBackIosOutlined';
import {useForm, useFieldArray} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useNotification} from '@optum-rx-core/orx-core-notification';
import {useBreadcrumbs} from '@optum-rx-core/orx-core-client-shared';

import {AddClientStepper} from '../../stepper/add-client-stepper';
import {ClientDetailsStep} from '../../stepper/steps/client-details-step';
import {ContractDetailsStep} from '../../stepper/steps/contract-details-step';
import {ContactsAccessStep} from '../../stepper/steps/contacts-access-step';
import {OperationalUnitsStep} from '../../stepper/steps/operational-units-step';
import {ConfirmationStep} from '../../stepper/steps/confirmation-step';
import {
  addClientCombinedSchema,
  defaultAddClientCombinedData,
  type AddClientCombinedFormData
} from '../../stepper/schemas';
import {clientApiService} from '../../services/client-api.service';
import {NAV_FOOTER_MIN_HEIGHT, NavigationFooter} from '../../components/navigation-footer';
import {useApiValidationErrors} from '../../libs/useApiValidationErrors';

export interface AddClientPageProps {
  onCancel?: () => void;
  onSaveDraft?: (data: AddClientCombinedFormData) => void;
  initialData?: AddClientCombinedFormData;
  /** URL to navigate to when canceling. Defaults to '/clients' */
  clientsListUrl?: string;
}

const STEP_LABELS = ['Client Details', 'Contract Details', 'Contacts & Access', 'Operational Units', 'Confirmation'];

export const AddClientPage: React.FC<AddClientPageProps> = ({
  onCancel,
  onSaveDraft,
  initialData,
  clientsListUrl = '/clients'
}) => {
  const {showSuccess, showError} = useNotification();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const {setBreadcrumbs} = useBreadcrumbs();
  // Get URL search params for mode detection
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'add'; // 'add' | 'edit' | 'duplicate' | 'draft'
  const clientId = searchParams.get('clientId');
  const draftId = searchParams.get('draftId');
  const section = searchParams.get('section');

  const [currentStep, setCurrentStep] = useState(0);
  // State for cancel confirmation dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  // State for tracking draft ID from backend
  const [savedDraftId, setSavedDraftId] = useState<string | undefined>(draftId || undefined);

  // Determine page title based on mode
  const pageTitle = useMemo(() => {
    switch (mode) {
      case 'edit':
        return 'Edit Client';
      case 'duplicate':
        return 'Duplicate Client';
      case 'draft':
        return 'Resume Draft';
      default:
        return 'Add Client';
    }
  }, [mode]);

  // Compute initial form data (memoized to run once)
  const initialFormData = useMemo((): AddClientCombinedFormData => {
    // Priority: initialData prop > default values
    if (initialData) {
      return initialData;
    }
    // For edit/duplicate/draft modes, data will be fetched from API in useEffect
    // For add mode, use default values
    return defaultAddClientCombinedData;
  }, [initialData, mode]);

  const {
    control,
    handleSubmit,
    formState: {errors, isDirty},
    getValues,
    watch,
    trigger,
    reset,
    setValue,
    setError
  } = useForm<AddClientCombinedFormData>({
    resolver: zodResolver(addClientCombinedSchema),
    defaultValues: initialFormData,
    mode: 'onBlur'
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'clientDetails.addresses'
  });

  // Field array for product overrides (Step 1: Client Details)
  const {
    fields: productOverrideFields,
    append: appendProductOverride,
    remove: removeProductOverride
  } = useFieldArray({
    control,
    name: 'clientDetails.productOverrides'
  });

  // Field array for run off days by claim type (Step 1: Client Details)
  const {
    fields: runOffDaysFields,
    append: appendRunOffDays,
    remove: removeRunOffDays
  } = useFieldArray({
    control,
    name: 'clientDetails.runOffDaysByClaimType'
  });

  // Field array for contacts (Step 3: Contacts & Access)
  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact
  } = useFieldArray({
    control,
    name: 'contacts'
  });

  // API validation error handler
  const {handleApiError} = useApiValidationErrors({
    setError,
    onNavigateToStep: setCurrentStep,
    showNotification: false // We'll show custom notification in the component
  });

  // Load data based on mode (edit, duplicate, draft)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setBreadcrumbs([
      {name: 'Home', link: '/'},
      {name: 'Clients', link: '/clients'},
      {name: 'Add', link: '/clients/add'}
    ]);

    if (mode === 'edit' && clientId) {
      // Load existing client data for editing
      clientApiService
        .getClientByClientId(clientId)
        .then((data: any) => {
          reset(data);
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load client data:', error);
        });
    } else if (mode === 'duplicate' && clientId) {
      // Load client data and clear unique fields for duplication
      clientApiService
        .getClientByClientId(clientId)
        .then((data: any) => {
          // Since API returns flat structure, we can temporarily clear the flat fields
          // The form will handle the nested structure
          const clearedData = {
            ...data,
            clientId: '',
            clientReferenceId: '',
            clientContractId: ''
          };
          reset(clearedData);
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load client data:', error);
        });
    } else if (mode === 'draft' && draftId) {
      // Load draft data
      clientApiService
        .getDraftById(draftId)
        .then((data: any) => {
          reset(data);
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load draft data:', error);
        });
    }
  }, [mode, clientId, draftId, reset]);

  // Jump to specific section if section parameter is provided
  useEffect(() => {
    if (section) {
      const sectionMap: Record<string, number> = {
        'client-details': 0,
        'contract-details': 1,
        contacts: 2,
        'operational-units': 3
      };
      const stepIndex = sectionMap[section];
      if (stepIndex !== undefined) {
        setCurrentStep(stepIndex);
      }
    }
  }, [section]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback((): boolean => {
    return isDirty;
  }, [isDirty]);

  // Navigate to clients list page
  const navigateToClientsList = useCallback(() => {
    // Clear draft from storage when navigating away

    // Call the onCancel callback if provided
    if (onCancel) {
      onCancel();
    }

    // Navigate to clients list URL
    // In a real app with react-router, this would use navigate()
    // For now, we use window.location for navigation
    window.location.href = clientsListUrl;
  }, [onCancel, clientsListUrl]);

  const handleCancel = () => {
    // Check if there are unsaved changes
    if (hasUnsavedChanges()) {
      // Show confirmation dialog
      setCancelDialogOpen(true);
    } else {
      // No unsaved changes, navigate directly
      navigateToClientsList();
    }
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };

  const handleCancelConfirm = () => {
    setCancelDialogOpen(false);

    // Navigate based on mode
    if (mode === 'edit' && clientId) {
      navigate(`/view-client/${clientId}`);
    } else {
      navigate('/client-list');
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Validate only the minimum required fields for draft save
      // Backend requires clientName and clientReferenceId even for drafts
      const isValid = await trigger(['clientDetails.clientName', 'clientDetails.clientReferenceId']);

      if (!isValid) {
        console.warn('Cannot save draft: Client Name and Reference ID are required');
        return;
      }

      const formData = getValues();

      // Save to backend API with minimal validation
      const savedDraft = await clientApiService.saveDraft(formData, currentStep, savedDraftId);

      // Update draft ID if this is a new draft
      if (!savedDraftId && savedDraft.draftId) {
        setSavedDraftId(savedDraft.draftId);
      }

      // Call the callback if provided
      if (onSaveDraft) {
        onSaveDraft(formData);
      }

      // Show success message
      showSuccess(
        'Your progress has been saved successfully. Please make sure to complete all sections later to finish adding this client.'
      );

      // Navigate to client list
      navigate('/client-list');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save draft:', error);
      // Show error to user (could add toast notification here)
    }
  };

  // Handle form confirmation/submission on the final step
  const handleConfirm = async (data: AddClientCombinedFormData) => {
    try {
      // Submit client with mapper formatting
      const response = await clientApiService.submitClient(data);

      showSuccess(
        <>
          <strong>{data.clientDetails.clientName}</strong> client has been successfully added.
        </>
      );
      // Navigate to success page or client list
      console.log('✅ Client submitted successfully:', response);
      navigate('/client-list');
    } catch (error) {
      // Handle API validation errors using the hook
      const result = handleApiError(error);

      // Optionally show custom notification for validation errors
      if (result.isValidation && result.errorMessages.length > 0) {
        showError(
          <>
            <strong>
              Validation failed ({result.errorCount} error{result.errorCount !== 1 ? 's' : ''})
            </strong>
            <br />
            Please review and correct the following:
            <ul style={{marginTop: '8px', paddingLeft: '20px', marginBottom: 0}}>
              {result.errorMessages.map((message, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{message}</li>
              ))}
            </ul>
          </>
        );
      }

      // eslint-disable-next-line no-console
      console.error({error});
    }
  };

  // Navigate to a specific step (form data is preserved automatically via react-hook-form)
  // Validates current step before allowing navigation forward
  const navigateToStep = useCallback(
    async (targetStep: number) => {
      // Allow navigating backward without validation
      if (targetStep < currentStep) {
        setCurrentStep(targetStep);
        return;
      }

      // For forward navigation, validate current step first
      let isValid = false;

      if (currentStep === 0) {
        isValid = await trigger([
          'clientDetails.clientReferenceId',
          'clientDetails.clientName',
          'clientDetails.addresses'
        ]);
      } else if (currentStep === 1) {
        isValid = await trigger([
          'contractDetails.effectiveDate',
          'contractDetails.billingAttributes.invoiceBreakout',
          'contractDetails.billingAttributes.claimInvoiceFrequency',
          'contractDetails.billingAttributes.feeInvoiceFrequency',
          'contractDetails.billingAttributes.invoiceAggregationLevel',
          'contractDetails.billingAttributes.invoiceType',
          'contractDetails.billingAttributes.deliveryOption',
          'contractDetails.billingAttributes.supportDocumentVersion'
        ]);
      } else if (currentStep === 2) {
        isValid = await trigger('contacts');
      } else if (currentStep === 3) {
        isValid = await trigger('operationalUnits');
      } else {
        isValid = await trigger();
      }

      if (isValid) {
        setCurrentStep(targetStep);
      }
    },
    [currentStep, trigger]
  );

  // Handle "Go Back" button click - navigate to previous step
  const handleGoBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Handle "Next" button click - validate current step fields and navigate to next step
  const handleNext = useCallback(async () => {
    let isValid = false;

    // Validate fields based on current step
    if (currentStep === 0) {
      // Step 1: Client Details - validate client details and addresses
      isValid = await trigger([
        'clientDetails.clientReferenceId',
        'clientDetails.clientName',
        'clientDetails.addresses'
      ]);
    } else if (currentStep === 1) {
      // Step 2: Contract Details - validate contract fields
      isValid = await trigger([
        'contractDetails.effectiveDate',
        'contractDetails.billingAttributes.invoiceBreakout',
        'contractDetails.billingAttributes.claimInvoiceFrequency',
        'contractDetails.billingAttributes.feeInvoiceFrequency',
        'contractDetails.billingAttributes.invoiceAggregationLevel',
        'contractDetails.billingAttributes.invoiceType',
        'contractDetails.billingAttributes.deliveryOption',
        'contractDetails.billingAttributes.supportDocumentVersion'
      ]);
    } else if (currentStep === 2) {
      // Step 3: Contacts & Access - validate contacts array
      isValid = await trigger('contacts');
    } else if (currentStep === 3) {
      // Step 4: Operational Units - validate operationalUnits array
      isValid = await trigger('operationalUnits');
    } else {
      // For other steps, trigger full validation
      isValid = await trigger();
    }

    if (isValid && currentStep < STEP_LABELS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, trigger]);

  const onSubmit = (data: AddClientCombinedFormData) => {
    // Move to next step on valid form submission
    if (currentStep < STEP_LABELS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    // eslint-disable-next-line no-console
    console.log('Form data:', data);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FAFCFF',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Main Content Container */}
      <Box sx={{px: '84px', py: 3, flex: 1, paddingBottom: `${NAV_FOOTER_MIN_HEIGHT}px`}}>
        {/* Title Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          {/* Title and Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ArrowBackIosOutlined
              onClick={() => {
                navigate(-1);
              }}
              sx={{
                fontSize: 22,
                color: '#0C55B8',
                cursor: 'pointer'
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: '29px',
                fontWeight: 700,
                color: '#002677',
                lineHeight: 1.2
              }}
            >
              {pageTitle}
            </Typography>
          </Box>

          {/* Button Group */}
          <Box
            sx={{
              display: 'flex',
              gap: 2
            }}
          >
            {currentStep === 4 ? (
              // Confirmation step buttons - Requirements 7.1, 7.2, 7.3
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleSubmit(
                      (data) => {
                        handleConfirm(data).catch((error: unknown) => {
                          // eslint-disable-next-line no-console
                          console.error('Error in handleConfirm:', error);
                        });
                      },
                      (validationErrors) => {
                        // Handle validation errors if needed
                        // eslint-disable-next-line no-console
                        console.error('❌ Form validation failed:', validationErrors);
                      }
                    )().catch((error: unknown) => {
                      // eslint-disable-next-line no-console
                      console.error('Error in handleSubmit:', error);
                    });
                  }}
                  sx={{
                    backgroundColor: '#002677',
                    color: '#FFFFFF',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#001a5c',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {mode === 'edit' ? 'Save Changes' : 'Confirm'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSaveDraft}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#002677',
                    borderColor: '#002677',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#002677'
                    }
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#4B4D4F',
                    borderColor: '#4B4D4F',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#4B4D4F'
                    }
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              // Default buttons for steps 0-3
              <>
                <Button
                  variant="contained"
                  onClick={handleSaveDraft}
                  sx={{
                    backgroundColor: '#002677',
                    color: '#FFFFFF',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: 'none',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#001a5c',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#4B4D4F',
                    borderColor: '#4B4D4F',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    height: '40px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#4B4D4F'
                    }
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Divider
          sx={{
            my: 3,
            borderColor: '#E5E5E6'
          }}
        />

        {/* Stepper */}
        <Box sx={{mb: 3}}>
          <AddClientStepper currentStep={currentStep} onStepClick={navigateToStep} />
        </Box>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <ClientDetailsStep
              control={control}
              errors={errors}
              addressFields={fields}
              appendAddress={append}
              removeAddress={remove}
              productOverrideFields={productOverrideFields}
              appendProductOverride={appendProductOverride}
              removeProductOverride={removeProductOverride}
              runOffDaysFields={runOffDaysFields}
              appendRunOffDays={appendRunOffDays}
              removeRunOffDays={removeRunOffDays}
            />
          )}
          {currentStep === 1 && (
            <ContractDetailsStep control={control} errors={errors} watch={watch} setValue={setValue} />
          )}
          {currentStep === 2 && (
            <ContactsAccessStep
              control={control}
              errors={errors}
              contactFields={contactFields}
              appendContact={appendContact}
              removeContact={removeContact}
            />
          )}
          {currentStep === 3 && <OperationalUnitsStep control={control} errors={errors} setValue={setValue} />}
          {currentStep === 4 && <ConfirmationStep onEditStep={navigateToStep} formData={getValues()} />}

          {/* Step Navigation Buttons */}
          {/* Show buttons on steps 0-3 only. Confirmation step (4) has buttons in title bar */}
          {/* Steps 0-3 use NavigationFooter component */}
          {/* Step 0 (Client Details) shows only Next button */}
          {currentStep === 0 && <NavigationFooter onNext={handleNext} onBack={handleGoBack} showBack={false} />}
          {/* Steps 1-3 (Contract Details, Contacts & Access, Operational Units) show both buttons */}
          {currentStep >= 1 && currentStep <= 3 && <NavigationFooter onNext={handleNext} onBack={handleGoBack} />}
        </form>
      </Box>

      {/* Footer */}
      {/* <Footer /> */}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle
          id="cancel-dialog-title"
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#323334'
          }}
        >
          Unsaved Changes
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="cancel-dialog-description"
            sx={{
              fontSize: '14px',
              color: '#4B4D4F'
            }}
          >
            You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{padding: '16px 24px', gap: 1}}>
          <Button
            onClick={handleCancelDialogClose}
            variant="outlined"
            sx={{
              borderRadius: '46px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              color: '#4B4D4F',
              borderColor: '#4B4D4F',
              '&:hover': {
                backgroundColor: '#F5F5F5',
                borderColor: '#4B4D4F'
              }
            }}
          >
            Stay on Page
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            sx={{
              borderRadius: '46px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#C40000',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#A30000',
                boxShadow: 'none'
              }
            }}
          >
            Leave Page
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddClientPage;
