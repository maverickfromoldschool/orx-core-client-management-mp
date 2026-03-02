import React, {useState} from 'react';
import {Accordion, AccordionSummary, AccordionDetails, Box, Typography, Grid, Paper} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type {Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId} from 'react-hook-form';

import {FormTextField} from '../../components/form-text-field';
import {AddressSection} from '../../components/address-section';
import {ProductOverrideSection} from '../../components/product-override-section';
import {RunOffDaysSection} from '../../components/run-off-days-section';
import type {AddClientCombinedFormData} from '../schemas';

interface ClientDetailsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  addressFields: FieldArrayWithId<AddClientCombinedFormData, 'clientDetails.addresses'>[];
  appendAddress: UseFieldArrayAppend<AddClientCombinedFormData, 'clientDetails.addresses'>;
  removeAddress: UseFieldArrayRemove;
  productOverrideFields: FieldArrayWithId<AddClientCombinedFormData, 'clientDetails.productOverrides'>[];
  appendProductOverride: UseFieldArrayAppend<AddClientCombinedFormData, 'clientDetails.productOverrides'>;
  removeProductOverride: UseFieldArrayRemove;
  runOffDaysFields: FieldArrayWithId<AddClientCombinedFormData, 'clientDetails.runOffDaysByClaimType'>[];
  appendRunOffDays: UseFieldArrayAppend<AddClientCombinedFormData, 'clientDetails.runOffDaysByClaimType'>;
  removeRunOffDays: UseFieldArrayRemove;
  readOnly?: boolean;
}

export const ClientDetailsStep: React.FC<ClientDetailsStepProps> = ({
  control,
  errors,
  addressFields,
  appendAddress,
  removeAddress,
  productOverrideFields,
  appendProductOverride,
  removeProductOverride,
  runOffDaysFields,
  appendRunOffDays,
  removeRunOffDays,
  readOnly = false
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        border: '1px solid #CBCCCD',
        borderRadius: '12px !important',
        boxShadow: 'none',
        '&:before': {
          display: 'none'
        },
        '&.Mui-expanded': {
          margin: 0
        }
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: '#002677',
              fontSize: '24px'
            }}
          />
        }
        sx={{
          padding: '16px 24px',
          '& .MuiAccordionSummary-content': {
            margin: 0,
            flexDirection: 'column',
            gap: '4px'
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0
          }
        }}
      >
        <Typography
          sx={{
            fontSize: '23px',
            fontWeight: 700,
            color: '#323334',
            lineHeight: 1.2
          }}
        >
          Client Details
        </Typography>
        <Typography
          sx={{
            marginY: '16px',
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4,
            my: 2
          }}
        >
          Complete the fields below.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '0 24px 24px 24px'
        }}
      >
        {/* Client Info Fields - Two Column Layout */}
        <Box sx={{mb: 3}}>
          {/* First Row: Client Reference ID, Client ID, Client Name */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <FormTextField
                name="clientDetails.clientReferenceId"
                control={control}
                label="Client ID"
                required
                placeholder="Enter client ID"
                error={errors.clientDetails?.clientReferenceId}
                helpTooltip="A unique identifier for the client reference"
                disabled={readOnly}
              />
            </Grid>
            {/* Hide Client ID field - it's system generated */}
            <Grid item xs={12} md={4}>
              <FormTextField
                name="clientDetails.clientName"
                control={control}
                label="Client Name"
                required
                placeholder="Enter client name"
                error={errors.clientDetails?.clientName}
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Address Section */}
        <AddressSection
          control={control}
          errors={errors}
          fields={addressFields}
          append={appendAddress}
          remove={removeAddress}
        />

        {/* Client Attributes */}
        <Paper sx={{p: 3, mb: 3}}>
          <Typography variant="h6" sx={{mb: 2}}>
            Client Attributes
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormTextField
                name="clientDetails.runOffDaysMemberClaims"
                control={control}
                label="Run off Days Member Claims"
                placeholder="Enter run off days member claims"
                error={errors.clientDetails?.runOffDaysMemberClaims}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField
                name="clientDetails.runOffDaysPharmacy"
                control={control}
                label="Run off Days Pharmacy"
                placeholder="Enter run off days pharmacy"
                error={errors.clientDetails?.runOffDaysPharmacy}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField
                name="clientDetails.source"
                control={control}
                label="Source"
                placeholder="Enter source"
                error={errors.clientDetails?.source}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Client Options */}
        <Paper sx={{p: 3, mb: 3}}>
          <Typography variant="h6" sx={{mb: 3}}>
            Client Options
          </Typography>
          <Box sx={{mb: 3}}>
            <ProductOverrideSection
              control={control}
              errors={errors}
              fields={productOverrideFields}
              append={appendProductOverride}
              remove={removeProductOverride}
              readOnly={readOnly}
            />
          </Box>
          <RunOffDaysSection
            control={control}
            errors={errors}
            fields={runOffDaysFields}
            append={appendRunOffDays}
            remove={removeRunOffDays}
            readOnly={readOnly}
          />
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default ClientDetailsStep;
