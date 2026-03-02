import React, {useState, useEffect} from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Divider,
  Box,
  Button,
  Switch
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import {useWatch, useFieldArray, type Control, type FieldErrors, UseFormSetValue} from 'react-hook-form';

import {AddClientCombinedFormData} from '../schemas';
import {FormSelectField} from '../../components/form-select-field';
import {FormTextField} from '../../components/form-text-field';
import {defaultOperationalUnitSuppressionEntryData} from '../schemas/default-values';
import SuppressionRow from '../../components/suppression-row';
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  INVOICE_AGGREGATION_OPTIONS,
  INVOICE_FREQUENCY_CLAIM_OPTIONS,
  INVOICE_FREQUENCY_FEE_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  DELIVERY_OPTIONS,
  SUPPORT_DOC_VERSION_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS,
  INV_CLAIM_QTY_CNT_OPTIONS
} from '../../data/lookup';

interface BillingAttributesOverrideSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
}

export const BillingAttributesOverrideSection: React.FC<BillingAttributesOverrideSectionProps> = ({
  control,
  errors,
  operationalUnitIndex,
  setValue
}) => {
  const [expanded, setExpanded] = useState(false);

  // Watch payment method to conditionally show bank account fields
  const paymentMethod = useWatch({
    control,
    name: `operationalUnits.${operationalUnitIndex}.billingAttributesOverride.paymentMethod`
  });

  // Watch addSuppressions value
  const addSuppressions = useWatch({
    control,
    name: `operationalUnits.${operationalUnitIndex}.billingAttributesOverride.addSuppressions`
  });

  // useFieldArray for dynamic suppressions management
  const {fields, append, remove} = useFieldArray({
    control,
    name: `operationalUnits.${operationalUnitIndex}.billingAttributesOverride.suppressions`
  });

  // Add a new suppression row
  const handleAddSuppression = () => {
    append(defaultOperationalUnitSuppressionEntryData);
  };

  // Remove a suppression row
  const handleRemoveSuppression = (index: number) => {
    remove(index);
  };

  // Auto-add first suppression row when "Yes" is selected and no rows exist
  useEffect(() => {
    if (addSuppressions === true && fields.length === 0) {
      append(defaultOperationalUnitSuppressionEntryData);
    }
  }, [addSuppressions, fields.length, append]);

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  // Check if payment method is ACH/EFT to show bank account fields (Requirement 5.3)
  const showBankAccountFields = paymentMethod === 'ACH';

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        border: '1px solid #CBCCCD',
        borderRadius: '12px !important',
        boxShadow: 'none',
        mt: 3,
        '&:before': {
          display: 'none'
        },
        '&.Mui-expanded': {
          margin: 0,
          marginTop: '24px'
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
            fontSize: '20px',
            fontWeight: 700,
            color: '#323334',
            lineHeight: 1.2
          }}
        >
          Invoice Preferences
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4
          }}
        >
          You may override the Invoice Preferences outlined under the contract details section here.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '0 24px 24px 24px'
        }}
      >
        {/* Billing Override Row 1: Claim Invoice Frequency, Fee Invoice Frequency, Invoice Aggregation Level */}
        <Grid container spacing={3} sx={{mb: 3}}>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.claimInvoiceFrequency`}
              control={control}
              label="Claim Invoice Frequency"
              options={INVOICE_FREQUENCY_CLAIM_OPTIONS}
              placeholder="Select invoice frequency"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.claimInvoiceFrequency}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.feeInvoiceFrequency`}
              control={control}
              label="Fee Invoice Frequency"
              options={INVOICE_FREQUENCY_FEE_OPTIONS}
              placeholder="Select invoice frequency"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.feeInvoiceFrequency}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceAggregationLevel`}
              control={control}
              label="Invoice Aggregation Level"
              options={INVOICE_AGGREGATION_OPTIONS}
              placeholder="Select Aggregation level"
              error={
                errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceAggregationLevel
              }
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 2: Invoice Type, Invoicing Claim Quantity Counts, Delivery Option */}
        {/* Requirements 4.9-4.11 */}
        <Grid container spacing={3} sx={{mb: 3}}>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceType`}
              control={control}
              label="Invoice Type"
              options={INVOICE_TYPE_OPTIONS}
              placeholder="Select invoice type"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceType}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoicingClaimQuantityCounts`}
              control={control}
              label="Invoicing Claim Quantity Counts"
              options={INV_CLAIM_QTY_CNT_OPTIONS}
              placeholder="Select quantity count"
              error={
                errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoicingClaimQuantityCounts
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.deliveryOption`}
              control={control}
              label="Delivery Option"
              options={DELIVERY_OPTIONS}
              placeholder="Select delivery option"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.deliveryOption}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 3: Support Document Version, Invoice Static Data */}
        {/* Requirements 4.12-4.13 */}
        <Grid container spacing={3} sx={{mb: 3}}>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.supportDocumentVersion`}
              control={control}
              label="Support Document Version"
              options={SUPPORT_DOC_VERSION_OPTIONS}
              placeholder="Select document version"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.supportDocumentVersion}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormTextField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceStaticData`}
              control={control}
              label="Invoice Static Data"
              placeholder="Enter invoice static data"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceStaticData}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 4: Fee Invoice Payment Term Day Type, Fee Invoice Payment Term */}
        {/* Requirements 4.14-4.15 */}
        <Grid container spacing={3} sx={{mb: 3}}>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.feeInvoicePaymentTermDayType`}
              control={control}
              label="Fee Invoice Payment Term Day Type"
              options={FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS}
              placeholder="Select day type"
              error={
                errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.feeInvoicePaymentTermDayType
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.feeInvoicePaymentTerm`}
              control={control}
              label="Fee Invoice Payment Term"
              options={FEE_INVOICE_PAYMENT_TERM_OPTIONS}
              placeholder="Select No. of days"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.feeInvoicePaymentTerm}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 5: Claim Invoice Payment Term, Claim Invoice Payment Term Day Type */}
        {/* Requirements 4.16-4.17 */}
        <Grid container spacing={3} sx={{mb: 3}}>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.claimInvoicePaymentTermDayType`}
              control={control}
              label="Claim Invoice Payment Term Day Type"
              options={CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS}
              placeholder="Select day type"
              error={
                errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride
                  ?.claimInvoicePaymentTermDayType
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.claimInvoicePaymentTerm`}
              control={control}
              label="Claim Invoice Payment Term"
              options={CLAIM_INVOICE_PAYMENT_TERM_OPTIONS}
              placeholder="Select No. of days"
              error={
                errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.claimInvoicePaymentTerm
              }
            />
          </Grid>
        </Grid>

        {/* Payment Method Section (Task 5.1, 5.2, 5.3) */}
        {/* Requirement 5.1: Payment Method dropdown */}
        <Grid container spacing={3} sx={{my: 3}}>
          <Grid item xs={12} md={4}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.paymentMethod`}
              control={control}
              label="Payment Method"
              options={PAYMENT_METHOD_OPTIONS}
              placeholder="Select payment method"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.paymentMethod}
            />
          </Grid>
        </Grid>

        {/* Requirement 5.2: Horizontal divider after Payment Method */}
        {paymentMethod && <Divider sx={{mb: 3, borderColor: '#AAAAAA'}} />}

        {/* Requirement 5.3-5.6: Conditional bank account fields when Payment Method is ACH/EFT */}
        {showBankAccountFields && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormSelectField
                name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.bankAccountType`}
                control={control}
                label="Bank Account Type"
                options={BANK_ACCOUNT_TYPE_OPTIONS}
                placeholder="Select bank account type"
                error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.bankAccountType}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.routingNumber`}
                control={control}
                label="Routing Number"
                placeholder="Enter routing number"
                error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.routingNumber}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.accountNumber`}
                control={control}
                label="Account Number"
                placeholder="Enter account number"
                error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.accountNumber}
              />
            </Grid>
          </Grid>
        )}

        {/* Horizontal divider before suppressions section */}
        {showBankAccountFields && <Divider sx={{my: 6, borderColor: '#AAAAAA'}} />}

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
                setValue(
                  `operationalUnits.${operationalUnitIndex}.billingAttributesOverride.addSuppressions`,
                  e.target.checked
                );
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
            {addSuppressions === true && (
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

          {/* Suppression fields - shown only when toggle is on */}
          {addSuppressions === true && (
            <Box sx={{mt: 3, pl: 0}}>
              {/* Render suppression rows */}
              {fields.map((field, suppressionIndex) => (
                <SuppressionRow
                  key={field.id}
                  index={suppressionIndex}
                  control={control}
                  errors={errors}
                  namePrefix={`operationalUnits[${operationalUnitIndex}].billingAttributesOverride`}
                  onRemove={() => {
                    handleRemoveSuppression(suppressionIndex);
                  }}
                  showDivider={suppressionIndex > 0}
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
      </AccordionDetails>
    </Accordion>
  );
};
