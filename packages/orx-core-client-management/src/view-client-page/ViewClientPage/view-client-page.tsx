import React, {useEffect} from 'react';
import {
  Box,
  Typography,
  Button,
  Skeleton,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import ArrowBackIosOutlined from '@mui/icons-material/ArrowBackIosOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import {useBreadcrumbs} from '@optum-rx-core/orx-core-client-shared';

import {useViewClientPage} from '../useViewClientPage/use-view-client-page';
import {ReviewAccordion} from '../../components/review-accordion';
import {InfoBanner} from '../../components/info-banner';
import {ClientDetailsReview} from '../../stepper/review/client-details-review';
import {ContractDetailsReview} from '../../stepper/review/contract-details-review';
import {ContactsReview} from '../../stepper/review/contacts-review';
import {OperationalUnitReview} from '../../stepper/review/operational-unit-review';

export function ViewClientPage() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const {setBreadcrumbs} = useBreadcrumbs();

  const {
    clientData,
    isLoading,
    error,
    handleEdit,
    handleDuplicate,
    handleBack,
    ref,
    duplicateDialogOpen,
    duplicateClientName,
    setDuplicateClientName,
    handleDuplicateDialogClose,
    handleDuplicateSave
  } = useViewClientPage();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setBreadcrumbs([
      {name: 'Home', link: '/'},
      {name: 'Clients', link: '/clients'},
      {name: 'View', link: `/clients/#/view-client/${clientData?.clientDetails.clientId ?? ''}`}
    ]);
  }, [setBreadcrumbs, clientData?.clientDetails.clientId]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{minHeight: '100vh', backgroundColor: '#FAFCFF'}}>
        <Box sx={{px: '84px', py: 3}}>
          <Skeleton variant="rectangular" height={60} sx={{mb: 2}} />
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </Box>
    );
  }

  // Error state
  if (error || !clientData) {
    return (
      <Box sx={{minHeight: '100vh', backgroundColor: '#FAFCFF'}}>
        <Box sx={{px: '84px', py: 3}}>
          <Alert severity="error">
            {error?.message || 'Client not found. Please check the client ID and try again.'}
          </Alert>
          <Button startIcon={<ArrowBackIosOutlined />} onClick={handleBack} sx={{mt: 2}}>
            Back to Client List
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box ref={ref} sx={{minHeight: '100vh', backgroundColor: '#FAFCFF', display: 'flex', flexDirection: 'column'}}>
      {/* Main Content Container */}
      <Box sx={{px: '84px', py: 3, flex: 1}}>
        {/* Title Bar with Back Arrow */}
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
              onClick={handleBack}
              sx={{
                fontSize: 22,
                color: '#0C55B8',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
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
              {clientData.clientDetails.clientName}
            </Typography>
          </Box>

          {/* Duplicate Button */}
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleDuplicate}
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              borderColor: '#002677',
              color: '#002677',
              px: 3,
              py: 1,
              borderRadius: '46px',
              '&:hover': {
                borderColor: '#002677',
                backgroundColor: 'rgba(0, 38, 119, 0.08)'
              }
            }}
          >
            Duplicate
          </Button>
        </Box>

        {/* Info Banner */}
        <InfoBanner
          title="View Only"
          message={
            <>
              You cannot edit information on this screen. To make changes, click the{' '}
              <span style={{fontWeight: 750}}>edit</span> icon next to the section you want to update.
            </>
          }
        />

        {/* Review Sections */}
        <Stack spacing={3} sx={{mt: 3}}>
          {/* Client Details Section */}
          <ReviewAccordion
            title="Client Details"
            defaultExpanded
            onEdit={() => {
              handleEdit(0);
            }}
          >
            <ClientDetailsReview formData={clientData} />
          </ReviewAccordion>

          {/* Contract Details Section */}
          <ReviewAccordion
            title="Contract Details"
            onEdit={() => {
              handleEdit(1);
            }}
          >
            <ContractDetailsReview formData={clientData} />
          </ReviewAccordion>

          {/* Contacts & Access Section */}
          <ReviewAccordion
            title="Contacts & Access"
            onEdit={() => {
              handleEdit(2);
            }}
          >
            <ContactsReview formData={clientData} />
          </ReviewAccordion>

          {/* Operational Units Sections */}
          {clientData.operationalUnits?.map((unit, index) => {
            const unitName = unit.name || `Operational Unit ${index + 1}`;
            return (
              <ReviewAccordion
                key={unit.id || unit.name || `unit-${index}`}
                title={`Operational Units - ${unitName}`}
                onEdit={() => {
                  handleEdit(3);
                }}
              >
                <OperationalUnitReview operationalUnit={unit} />
              </ReviewAccordion>
            );
          })}
        </Stack>
      </Box>

      {/* Duplicate Client Dialog */}
      <Dialog
        open={duplicateDialogOpen}
        onClose={handleDuplicateDialogClose}
        aria-labelledby="duplicate-dialog-title"
        aria-describedby="duplicate-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
            minWidth: '500px'
          }
        }}
      >
        <DialogTitle
          id="duplicate-dialog-title"
          sx={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#002677',
            paddingBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '16px'
          }}
        >
          Duplicate Client
          <IconButton
            aria-label="close"
            onClick={handleDuplicateDialogClose}
            sx={{
              color: '#4B4D4F',
              '&:hover': {
                backgroundColor: '#F5F5F5'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="duplicate-dialog-description"
            sx={{
              fontSize: '14px',
              color: '#4B4D4F',
              marginBottom: '20px'
            }}
          >
            Create a new name for your duplicate client. Once saved it will be added to the clients overview table.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Duplicate Client Name"
            placeholder="Enter duplicate client name"
            type="text"
            fullWidth
            required
            variant="outlined"
            value={duplicateClientName}
            onChange={(e) => {
              setDuplicateClientName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && duplicateClientName.trim()) {
                handleDuplicateSave().catch(() => {
                  // Error already handled in the function
                });
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                '& fieldset': {
                  borderColor: '#CBCCCD'
                },
                '&:hover fieldset': {
                  borderColor: '#0C55B8'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0C55B8'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#4B4D4F',
                '&.Mui-focused': {
                  color: '#0C55B8'
                }
              },
              '& .MuiInputLabel-asterisk': {
                color: '#C40000'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{padding: '16px 24px', gap: 1, justifyContent: 'flex-start'}}>
          <Button
            onClick={() => {
              handleDuplicateSave().catch(() => {
                // Error already handled in the function
              });
            }}
            variant="contained"
            disabled={!duplicateClientName.trim()}
            sx={{
              borderRadius: '46px',
              padding: '8px 24px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#002677',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#001a5c',
                boxShadow: 'none'
              },
              '&:disabled': {
                backgroundColor: '#E5E5E6',
                color: '#A6A8AB'
              }
            }}
          >
            Save
          </Button>
          <Button
            onClick={handleDuplicateDialogClose}
            variant="outlined"
            sx={{
              borderRadius: '46px',
              padding: '8px 24px',
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
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewClientPage;
