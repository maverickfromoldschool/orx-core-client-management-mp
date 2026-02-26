import React from 'react';
import {Grid, Typography, Divider, Box} from '@mui/material';

import {ReadOnlyField} from '../../components/read-only-field';
import {ReadOnlySelectField} from '../../components/read-only-select-field';
import type {AddClientCombinedFormData} from '../schemas';
import {
  SUPPRESSION_TYPE_OPTIONS,
  ASSIGNED_TO_OPTIONS,
  INVOICE_BREAKOUT_OPTIONS,
  INVOICE_FREQUENCY_CLAIM_OPTIONS,
  INVOICE_FREQUENCY_FEE_OPTIONS,
  INVOICE_AGGREGATION_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  DELIVERY_OPTIONS,
  SUPPORT_DOC_VERSION_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  BANK_ACCOUNT_TYPE_OPTIONS,
  INV_CLAIM_QTY_CNT_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS
} from '../../data/lookup';

interface ContractDetailsReviewProps {
  formData: AddClientCombinedFormData;
}

export const ContractDetailsReview: React.FC<ContractDetailsReviewProps> = ({formData}) => {
  const getLabel = (value: string | undefined, labels: {value: string; label: string}[]) => {
    return value ? labels.find((label) => label.value === value)?.label || value : undefined;
  };

  // Check if suppressions are configured
  const hasSuppressions =
    formData.contractDetails.billingAttributes.addSuppressions &&
    formData.contractDetails.billingAttributes.suppressions &&
    formData.contractDetails.billingAttributes.suppressions.length > 0;

  return (
    <div>
      {/* Contract Information Fields - Row 1 */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Client Contract ID" value={formData.contractDetails.clientContractId} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Effective Date" value={formData.contractDetails.effectiveDate} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Termination Date" value={formData.contractDetails.terminationDate} />
        </Grid>
      </Grid>

      {/* Contract Information Fields - Row 2 */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Contract Term" value={formData.contractDetails.contractTerm} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Client Membership" value={formData.contractDetails.clientMembership} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Client DOA Signor" value={formData.contractDetails.clientDoaSignor} />
        </Grid>
      </Grid>

      {/* Contract Information Fields - Row 3 */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlyField
            label="Contracting Legal Entity for OptumRx"
            value={formData.contractDetails.contractingLegalEntityOptumRx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField
            label="Contracting Legal Entity for Client"
            value={formData.contractDetails.contractingLegalEntityClient}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Assigned to"
            value={getLabel(formData.contractDetails.assignedTo, ASSIGNED_TO_OPTIONS)}
          />
        </Grid>
      </Grid>

      {/* Contract Information Fields - Row 4 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Run-Off Effective Date" value={formData.contractDetails.runOffEffectiveDate} />
        </Grid>
      </Grid>

      {/* Billing Attributes Section */}
      <Divider sx={{my: 3, borderColor: '#CBCCCD'}} />
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#000000',
          mb: 2
        }}
      >
        Invoice Preferences
      </Typography>

      {/* Billing Attributes - Row 1 */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Invoice Breakout"
            value={getLabel(formData.contractDetails.billingAttributes.invoiceBreakout, INVOICE_BREAKOUT_OPTIONS)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Claim Invoice Frequency"
            value={getLabel(
              formData.contractDetails.billingAttributes.claimInvoiceFrequency,
              INVOICE_FREQUENCY_CLAIM_OPTIONS
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Fee Invoice Frequency"
            value={getLabel(
              formData.contractDetails.billingAttributes.feeInvoiceFrequency,
              INVOICE_FREQUENCY_FEE_OPTIONS
            )}
          />
        </Grid>
      </Grid>

      {/* Billing Attributes - Row 2 */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Invoice Aggregation Level"
            value={getLabel(
              formData.contractDetails.billingAttributes.invoiceAggregationLevel,
              INVOICE_AGGREGATION_OPTIONS
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Invoice Type"
            value={getLabel(formData.contractDetails.billingAttributes.invoiceType, INVOICE_TYPE_OPTIONS)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Invoicing Claim Quantity Counts"
            value={getLabel(
              formData.contractDetails.billingAttributes.invoicingClaimQuantityCounts,
              INV_CLAIM_QTY_CNT_OPTIONS
            )}
          />
        </Grid>
      </Grid>

      {/* Billing Attributes - Row 3 */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Delivery Option"
            value={getLabel(formData.contractDetails.billingAttributes.deliveryOption, DELIVERY_OPTIONS)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Support Document Version"
            value={getLabel(
              formData.contractDetails.billingAttributes.supportDocumentVersion,
              SUPPORT_DOC_VERSION_OPTIONS
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField
            label="Invoice Static Data"
            value={formData.contractDetails.billingAttributes.invoiceStaticData}
          />
        </Grid>
      </Grid>

      {/* Billing Attributes - Row 4: Fee Invoice Payment Term, Fee Invoice Payment Term Day Type */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Fee Invoice Payment Term"
            value={getLabel(
              formData.contractDetails.billingAttributes.feeInvoicePaymentTerm,
              FEE_INVOICE_PAYMENT_TERM_OPTIONS
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Fee Invoice Payment Term Day Type"
            value={getLabel(
              formData.contractDetails.billingAttributes.feeInvoicePaymentTermDayType,
              FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS
            )}
          />
        </Grid>
      </Grid>

      {/* Billing Attributes - Row 5: Claim Invoice Payment Term, Claim Invoice Payment Term Day Type */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Claim Invoice Payment Term"
            value={getLabel(
              formData.contractDetails.billingAttributes.claimInvoicePaymentTerm,
              CLAIM_INVOICE_PAYMENT_TERM_OPTIONS
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Claim Invoice Payment Term Day Type"
            value={getLabel(
              formData.contractDetails.billingAttributes.claimInvoicePaymentTermDayType,
              CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS
            )}
          />
        </Grid>
      </Grid>

      {/* Billing Attributes - Row 6: Payment Method */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Payment Method"
            value={getLabel(formData.contractDetails.billingAttributes.paymentMethod, PAYMENT_METHOD_OPTIONS)}
          />
        </Grid>
      </Grid>

      {/* Autopay Information Section - Only show if payment method is ACH */}
      {formData.contractDetails.billingAttributes.paymentMethod === 'ACH' && (
        <>
          <Divider sx={{my: 3, borderColor: '#CBCCCD'}} />
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#000000',
              mb: 2
            }}
          >
            Autopay Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Bank Account Type"
                value={getLabel(formData.contractDetails.billingAttributes.bankAccountType, BANK_ACCOUNT_TYPE_OPTIONS)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlyField label="Routing Number" value={formData.contractDetails.billingAttributes.routingNumber} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlyField label="Account Number" value={formData.contractDetails.billingAttributes.accountNumber} />
            </Grid>
          </Grid>
        </>
      )}

      {/* Suppressions Section - Only show when configured */}
      {hasSuppressions && (
        <>
          <Divider sx={{my: 3, borderColor: '#CBCCCD'}} />
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#000000',
              mb: 2
            }}
          >
            Suppressions
          </Typography>

          <Box sx={{mt: 2}}>
            {formData.contractDetails.billingAttributes.suppressions.map((suppression, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={index} sx={{mb: 3}}>
                {index > 0 && <Divider sx={{mb: 3, borderColor: '#CBCCCD'}} />}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <ReadOnlySelectField
                      label="Suppression Type"
                      value={getLabel(suppression.suppressionType, SUPPRESSION_TYPE_OPTIONS)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ReadOnlyField label="Suppression Start Date" value={suppression.suppressionStartDate} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ReadOnlyField label="Suppression End Date" value={suppression.suppressionEndDate} />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </>
      )}
    </div>
  );
};

export default ContractDetailsReview;
