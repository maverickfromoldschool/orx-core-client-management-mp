import React from 'react';
import {Box, Grid} from '@mui/material';
import type {Control, FieldErrors} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../schemas';
import {FormTextField} from '../../components/form-text-field';
import {FormSelectField} from '../../components/form-select-field';
import {BANK_ACCOUNT_TYPE_OPTIONS} from '../../data/lookup';

interface AutopaySectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  paymentMethod: string | undefined;
}

export const AutopaySection: React.FC<AutopaySectionProps> = ({control, errors, paymentMethod}) => {
  if (paymentMethod !== 'ach') {
    return null;
  }

  return (
    <Box
      sx={{
        border: '1px solid #CBCCCD',
        borderRadius: '12px',
        p: 3
      }}
    >
      {/* Horizontal divider */}
      <Box
        sx={{
          borderTop: '1px solid #CBCCCD',
          mb: 3
        }}
      />

      {/* Autopay Row: Bank Account Type, Routing Number, Account Number (3 fields) */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.bankAccountType"
            control={control}
            label="Bank Account Type"
            required
            options={BANK_ACCOUNT_TYPE_OPTIONS}
            placeholder="Select account type"
            error={errors.contractDetails?.billingAttributes?.bankAccountType}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.billingAttributes.routingNumber"
            control={control}
            label="Routing Number"
            required
            placeholder="Enter routing number"
            error={errors.contractDetails?.billingAttributes?.routingNumber}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.billingAttributes.accountNumber"
            control={control}
            label="Account Number"
            required
            placeholder="Enter account number"
            error={errors.contractDetails?.billingAttributes?.accountNumber}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
