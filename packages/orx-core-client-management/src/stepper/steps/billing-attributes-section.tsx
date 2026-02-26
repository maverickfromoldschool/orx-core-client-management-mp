import React, {useEffect} from 'react';
import {Box, Typography, Grid, Divider, Button, Switch} from '@mui/material';
import {useFieldArray, type Control, FieldErrors, UseFormWatch, UseFormSetValue} from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';

import type {AddClientCombinedFormData} from '../schemas';
import {FormTextField} from '../../components/form-text-field';
import {FormSelectField} from '../../components/form-select-field';
import {defaultSuppressionEntryData} from '../schemas/default-values';
import SuppressionRow from '../../components/suppression-row';
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_OPTIONS,
  DELIVERY_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_OPTIONS,
  INV_CLAIM_QTY_CNT_OPTIONS,
  INVOICE_AGGREGATION_OPTIONS,
  INVOICE_BREAKOUT_OPTIONS,
  INVOICE_FREQUENCY_CLAIM_OPTIONS,
  INVOICE_FREQUENCY_FEE_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  SUPPORT_DOC_VERSION_OPTIONS
} from '../../data/lookup';

interface BillingAttributesSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  watch: UseFormWatch<AddClientCombinedFormData>;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
}

export const BillingAttributesSection: React.FC<BillingAttributesSectionProps> = ({
  control,
  errors,
  watch,
  setValue
}) => {
  const addSuppressions = watch('contractDetails.billingAttributes.addSuppressions');

  // useFieldArray for dynamic suppressions management
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'contractDetails.billingAttributes.suppressions'
  });

  // Add a new suppression row
  const handleAddSuppression = () => {
    append(defaultSuppressionEntryData);
  };

  // Remove a suppression row
  const handleRemoveSuppression = (index: number) => {
    remove(index);
  };

  // Auto-add first suppression row when toggle is enabled and no rows exist
  useEffect(() => {
    if (addSuppressions && fields.length === 0) {
      append(defaultSuppressionEntryData);
    }
  }, [addSuppressions, fields.length, append]);

  return (
    <Box
      sx={{
        border: '1px solid #CBCCCD',
        borderRadius: '12px',
        p: 3,
        mb: 3
      }}
    >
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#000000',
          mb: 0.5
        }}
      >
        Invoice Preferences
      </Typography>
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 400,
          color: '#4B4D4F',
          my: 2
        }}
      >
        Complete the fields below.
      </Typography>

      {/* Billing Row 1: Invoice Breakout, Claim Invoice Frequency, Fee Invoice Frequency */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.invoiceBreakout"
            control={control}
            label="Invoice Breakout"
            required
            options={INVOICE_BREAKOUT_OPTIONS}
            placeholder="Select invoice breakout"
            error={errors.contractDetails?.billingAttributes?.invoiceBreakout}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.claimInvoiceFrequency"
            control={control}
            label="Claim Invoice Frequency"
            required
            options={INVOICE_FREQUENCY_CLAIM_OPTIONS}
            placeholder="Select frequency"
            error={errors.contractDetails?.billingAttributes?.claimInvoiceFrequency}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.feeInvoiceFrequency"
            control={control}
            label="Fee Invoice Frequency"
            required
            options={INVOICE_FREQUENCY_FEE_OPTIONS}
            placeholder="Select frequency"
            error={errors.contractDetails?.billingAttributes?.feeInvoiceFrequency}
          />
        </Grid>
      </Grid>

      {/* Billing Row 2: Invoice Aggregation Level, Invoice Type, Invoicing Claim Quantity Counts */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.invoiceAggregationLevel"
            control={control}
            label="Invoice Aggregation Level"
            required
            options={INVOICE_AGGREGATION_OPTIONS}
            placeholder="Select aggregation level"
            error={errors.contractDetails?.billingAttributes?.invoiceAggregationLevel}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.invoiceType"
            control={control}
            label="Invoice Type"
            required
            options={INVOICE_TYPE_OPTIONS}
            placeholder="Select invoice type"
            error={errors.contractDetails?.billingAttributes?.invoiceType}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.invoicingClaimQuantityCounts"
            control={control}
            label="Invoicing Claim Quantity Counts"
            options={INV_CLAIM_QTY_CNT_OPTIONS}
            placeholder="Select quantity count"
            error={errors.contractDetails?.billingAttributes?.invoicingClaimQuantityCounts}
          />
        </Grid>
      </Grid>

      {/* Billing Row 3: Delivery Option, Support Document Version, Invoice Static Data */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.deliveryOption"
            control={control}
            label="Delivery Option"
            required
            options={DELIVERY_OPTIONS}
            placeholder="Select delivery option"
            error={errors.contractDetails?.billingAttributes?.deliveryOption}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.supportDocumentVersion"
            control={control}
            label="Support Document Version"
            required
            options={SUPPORT_DOC_VERSION_OPTIONS}
            placeholder="Select version"
            error={errors.contractDetails?.billingAttributes?.supportDocumentVersion}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.billingAttributes.invoiceStaticData"
            control={control}
            label="Invoice Static Data"
            placeholder="Enter invoice static data"
            error={errors.contractDetails?.billingAttributes?.invoiceStaticData}
          />
        </Grid>
      </Grid>

      {/* Billing Row 4: Fee Invoice Payment Term Day Type, Fee Invoice Payment Term */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.feeInvoicePaymentTermDayType"
            control={control}
            label="Fee Invoice Payment Term Day Type"
            options={FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS}
            placeholder="Select day type"
            error={errors.contractDetails?.billingAttributes?.feeInvoicePaymentTermDayType}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.feeInvoicePaymentTerm"
            control={control}
            label="Fee Invoice Payment Term"
            options={FEE_INVOICE_PAYMENT_TERM_OPTIONS}
            placeholder="Select No. of days"
            error={errors.contractDetails?.billingAttributes?.feeInvoicePaymentTerm}
          />
        </Grid>
      </Grid>

      {/* Billing Row 5: Claim Invoice Payment Term, Claim Invoice Payment Term Day Type */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.claimInvoicePaymentTermDayType"
            control={control}
            label="Claim Invoice Payment Term Day Type"
            options={CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS}
            placeholder="Select day type"
            error={errors.contractDetails?.billingAttributes?.claimInvoicePaymentTermDayType}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.claimInvoicePaymentTerm"
            control={control}
            label="Claim Invoice Payment Term"
            options={CLAIM_INVOICE_PAYMENT_TERM_OPTIONS}
            placeholder="Select No. of days"
            error={errors.contractDetails?.billingAttributes?.claimInvoicePaymentTerm}
          />
        </Grid>
      </Grid>

      {/* Payment Method Section */}
      <Grid container spacing={3} sx={{my: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.billingAttributes.paymentMethod"
            control={control}
            label="Payment Method"
            options={PAYMENT_METHOD_OPTIONS}
            placeholder="Select payment method"
            error={errors.contractDetails?.billingAttributes?.paymentMethod}
          />
        </Grid>
      </Grid>

      {/* Horizontal divider after Payment Method */}
      {watch('contractDetails.billingAttributes.paymentMethod') && <Divider sx={{mb: 3, borderColor: '#AAAAAA'}} />}

      {/* Conditional Bank Account Fields when Payment Method is ACH */}
      {watch('contractDetails.billingAttributes.paymentMethod') === 'ACH' && (
        <Grid container spacing={3} sx={{mb: 3}}>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name="contractDetails.billingAttributes.bankAccountType"
              control={control}
              label="Bank Account Type"
              options={BANK_ACCOUNT_TYPE_OPTIONS}
              placeholder="Select bank account type"
              error={errors.contractDetails?.billingAttributes?.bankAccountType}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormTextField
              name="contractDetails.billingAttributes.routingNumber"
              control={control}
              label="Routing Number"
              placeholder="Enter routing number"
              error={errors.contractDetails?.billingAttributes?.routingNumber}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormTextField
              name="contractDetails.billingAttributes.accountNumber"
              control={control}
              label="Account Number"
              placeholder="Enter account number"
              error={errors.contractDetails?.billingAttributes?.accountNumber}
            />
          </Grid>
        </Grid>
      )}

      {/* Horizontal divider before suppressions section */}
      {watch('contractDetails.billingAttributes.paymentMethod') === 'ACH' && (
        <Divider sx={{my: 6, borderColor: '#AAAAAA'}} />
      )}

      {/* Add Suppressions Toggle Switch */}
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#323334'
            }}
          >
            Add Suppressions
          </Typography>
          <Switch
            checked={addSuppressions === true}
            onChange={(e) => {
              setValue('contractDetails.billingAttributes.addSuppressions', e.target.checked);
            }}
            sx={{
              width: 36,
              height: 20,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: 0,
                margin: 0,
                transitionDuration: '300ms',
                '&.Mui-checked': {
                  transform: 'translateX(16px)',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#FFFFFF',
                    opacity: 1,
                    border: '2px solid #0C55B8'
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#0C55B8',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: '12px 12px'
                    }
                  }
                }
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 20,
                height: 20,
                backgroundColor: '#0C55B8',
                boxShadow: 'none',
                position: 'relative'
              },
              '& .MuiSwitch-track': {
                borderRadius: '41px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #0C55B8',
                opacity: 1
              }
            }}
          />
          {addSuppressions && (
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#4B4D4F'
              }}
            >
              Yes
            </Typography>
          )}
        </Box>

        {/* Suppression fields - shown only when toggle is enabled */}
        {addSuppressions && (
          <Box sx={{mt: 3, pl: 0}}>
            {/* Render suppression rows */}
            {fields.map((field, index) => (
              <SuppressionRow
                key={field.id}
                index={index}
                control={control}
                errors={errors}
                onRemove={() => {
                  handleRemoveSuppression(index);
                }}
                showDivider={index > 0}
                showDelete={fields.length > 1}
              />
            ))}

            {/* Add another suppression button */}
            <Button
              onClick={handleAddSuppression}
              startIcon={<AddIcon />}
              sx={{
                mt: 3,
                color: '#0C55B8',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                padding: '8px 0',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Add another suppression
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
