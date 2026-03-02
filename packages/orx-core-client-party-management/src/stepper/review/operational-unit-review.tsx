import React from 'react';
import {Box, Typography, Divider, Chip, Grid} from '@mui/material';

import {ReadOnlyField} from '../../components/read-only-field';
import {ReadOnlySelectField} from '../../components/read-only-select-field';
import type {OperationalUnitData} from '../schemas';
import {
  ADDRESS_TYPE_OPTIONS,
  BANK_ACCOUNT_TYPE_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS,
  CLAIM_INVOICE_PAYMENT_TERM_OPTIONS,
  CONTACT_OPTIONS,
  DELIVERY_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS,
  FEE_INVOICE_PAYMENT_TERM_OPTIONS,
  INVOICE_AGGREGATION_OPTIONS,
  INV_CLAIM_QTY_CNT_OPTIONS,
  INVOICE_FREQUENCY_CLAIM_OPTIONS,
  INVOICE_FREQUENCY_FEE_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  LINE_OF_BUSINESS_OPTIONS,
  MARKET_SEGMENT_OPTIONS,
  MR_CLASSIFICATION_OPTIONS,
  MR_GROUP_INDIVIDUAL_OPTIONS,
  MR_PLAN_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PRICING_OPTIONS,
  SUPPORT_DOC_VERSION_OPTIONS,
  SUPPRESSION_TYPE_OPTIONS
} from '../../data/lookup';

interface OperationalUnitReviewProps {
  operationalUnit: OperationalUnitData;
}

export const OperationalUnitReview: React.FC<OperationalUnitReviewProps> = ({operationalUnit}) => {
  const getLabel = (value: string | undefined, labels: {value: string; label: string}[]) => {
    return value ? labels.find((label) => label.value === value)?.label || value : undefined;
  };

  // Check if billing attributes override has any values
  const hasBillingOverride =
    operationalUnit.billingAttributesOverride &&
    (operationalUnit.billingAttributesOverride.claimInvoiceFrequency ||
      operationalUnit.billingAttributesOverride.feeInvoiceFrequency ||
      operationalUnit.billingAttributesOverride.invoiceAggregationLevel ||
      operationalUnit.billingAttributesOverride.invoiceType ||
      operationalUnit.billingAttributesOverride.invoicingClaimQuantityCounts ||
      operationalUnit.billingAttributesOverride.deliveryOption ||
      operationalUnit.billingAttributesOverride.supportDocumentVersion ||
      operationalUnit.billingAttributesOverride.invoiceStaticData ||
      operationalUnit.billingAttributesOverride.feeInvoicePaymentTerm ||
      operationalUnit.billingAttributesOverride.feeInvoicePaymentTermDayType ||
      operationalUnit.billingAttributesOverride.claimInvoicePaymentTerm ||
      operationalUnit.billingAttributesOverride.claimInvoicePaymentTermDayType ||
      operationalUnit.billingAttributesOverride.paymentMethod);

  // Check if payment method is ACH/EFT and has bank details
  const hasPaymentDetails =
    operationalUnit.billingAttributesOverride?.paymentMethod === 'ACH' &&
    (operationalUnit.billingAttributesOverride.bankAccountType ||
      operationalUnit.billingAttributesOverride.routingNumber ||
      operationalUnit.billingAttributesOverride.accountNumber);

  // Check if suppressions are configured
  const hasSuppressions =
    operationalUnit.billingAttributesOverride?.addSuppressions &&
    operationalUnit.billingAttributesOverride?.suppressions &&
    operationalUnit.billingAttributesOverride.suppressions.length > 0;

  return (
    <div>
      {/* Basic Fields - Row 1: Operational Unit Name, Operational Unit ID, LOB Numeric */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Operational Unit Name" value={operationalUnit.name} required />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Operational Unit ID" value={operationalUnit.id} required />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="LOB Numeric" value={operationalUnit.lobNumeric} required />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 2: Market Segment, Line of Business, M&R Plan Type */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Market Segment"
            value={getLabel(operationalUnit.marketSegment, MARKET_SEGMENT_OPTIONS)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Line of Business"
            value={getLabel(operationalUnit.lineOfBusiness, LINE_OF_BUSINESS_OPTIONS)}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="M&R Plan Type"
            value={getLabel(operationalUnit.mrPlanType, MR_PLAN_TYPE_OPTIONS)}
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 3: M&R Group/Individual, M&R Classification, Pass through/Traditional pricing */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="M&R Group/Individual"
            value={getLabel(operationalUnit.mrGroupIndividual, MR_GROUP_INDIVIDUAL_OPTIONS)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="M&R Classification"
            value={getLabel(operationalUnit.mrClassification, MR_CLASSIFICATION_OPTIONS)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReadOnlySelectField
            label="Pass through/Traditional pricing"
            value={getLabel(operationalUnit.passThroughTraditional, PRICING_OPTIONS)}
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 4: Assigned Contacts with Chips */}
      {operationalUnit.assignedContacts && operationalUnit.assignedContacts.length > 0 && (
        <Box
          sx={{
            backgroundColor: '#FAFCFF',
            border: '1px solid #CBCCCD',
            borderRadius: '12px',
            padding: '16px 24px',
            mt: 3
          }}
        >
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#323334',
              mb: 2
            }}
          >
            Assign Contacts
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            {operationalUnit.assignedContacts.map((contactValue: string) => (
              <Chip
                key={contactValue}
                label={getLabel(contactValue, CONTACT_OPTIONS)}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #0C55B8',
                  borderRadius: '24px',
                  height: '36px',
                  '& .MuiChip-label': {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0C55B8',
                    padding: '0 12px'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Addresses Section */}
      {operationalUnit.addresses && operationalUnit.addresses.length > 0 && (
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
            Addresses
          </Typography>
          {operationalUnit.addresses.map((address, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={index} sx={{mb: 3}}>
              {/* Address Row 1 */}
              <Grid container spacing={3} sx={{mb: 3}}>
                <Grid item xs={12} md={4}>
                  <ReadOnlySelectField
                    label="Address Type"
                    value={getLabel(address.addressType, ADDRESS_TYPE_OPTIONS)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="Address 1" value={address.address1} required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="Address 2" value={address.address2} />
                </Grid>
              </Grid>

              {/* Address Row 2 */}
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="State" value={address.state} required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="City" value={address.city} required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="Zip" value={address.zip} required />
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      )}

      {/* Billing Attributes Override Section - Only show if there are overrides */}
      {hasBillingOverride && (
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
            Invoice Preferences Override
          </Typography>

          {/* Row 1: Invoice Frequencies and Aggregation */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Claim Invoice Frequency"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.claimInvoiceFrequency,
                  INVOICE_FREQUENCY_CLAIM_OPTIONS
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Fee Invoice Frequency"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.feeInvoiceFrequency,
                  INVOICE_FREQUENCY_FEE_OPTIONS
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Invoice Aggregation Level"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.invoiceAggregationLevel,
                  INVOICE_AGGREGATION_OPTIONS
                )}
              />
            </Grid>
          </Grid>

          {/* Row 2: Invoice Type, Quantity Counts, Delivery */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Invoice Type"
                value={getLabel(operationalUnit.billingAttributesOverride?.invoiceType, INVOICE_TYPE_OPTIONS)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Invoicing Claim Quantity Counts"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.invoicingClaimQuantityCounts,
                  INV_CLAIM_QTY_CNT_OPTIONS
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Delivery Option"
                value={getLabel(operationalUnit.billingAttributesOverride?.deliveryOption, DELIVERY_OPTIONS)}
              />
            </Grid>
          </Grid>

          {/* Row 3: Support Doc Version, Invoice Static Data */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Support Document Version"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.supportDocumentVersion,
                  SUPPORT_DOC_VERSION_OPTIONS
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlyField
                label="Invoice Static Data"
                value={operationalUnit.billingAttributesOverride?.invoiceStaticData}
              />
            </Grid>
          </Grid>

          {/* Row 4: Fee Invoice Payment Terms */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Fee Invoice Payment Term"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.feeInvoicePaymentTerm,
                  FEE_INVOICE_PAYMENT_TERM_OPTIONS
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Fee Invoice Payment Term Day Type"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.feeInvoicePaymentTermDayType,
                  FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS
                )}
              />
            </Grid>
          </Grid>

          {/* Row 5: Claim Invoice Payment Terms */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Claim Invoice Payment Term"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.claimInvoicePaymentTerm,
                  CLAIM_INVOICE_PAYMENT_TERM_OPTIONS
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Claim Invoice Payment Term Day Type"
                value={getLabel(
                  operationalUnit.billingAttributesOverride?.claimInvoicePaymentTermDayType,
                  CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS
                )}
              />
            </Grid>
          </Grid>

          {/* Payment Method */}
          {operationalUnit.billingAttributesOverride?.paymentMethod && (
            <Grid container spacing={3} sx={{mb: 3}}>
              <Grid item xs={12} md={4}>
                <ReadOnlySelectField
                  label="Payment Method"
                  value={getLabel(operationalUnit.billingAttributesOverride?.paymentMethod, PAYMENT_METHOD_OPTIONS)}
                />
              </Grid>
            </Grid>
          )}

          {/* Bank Account Details - Only show when Payment Method is ACH/EFT */}
          {hasPaymentDetails && (
            <>
              <Divider sx={{my: 3, borderColor: '#AAAAAA'}} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <ReadOnlySelectField
                    label="Bank Account Type"
                    value={getLabel(
                      operationalUnit.billingAttributesOverride?.bankAccountType,
                      BANK_ACCOUNT_TYPE_OPTIONS
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField
                    label="Routing Number"
                    value={operationalUnit.billingAttributesOverride?.routingNumber}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField
                    label="Account Number"
                    value={operationalUnit.billingAttributesOverride?.accountNumber}
                  />
                </Grid>
              </Grid>
            </>
          )}
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
          {operationalUnit.billingAttributesOverride?.suppressions?.map((suppression, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={index}>
              {index > 0 && <Divider sx={{my: 2, borderColor: '#AAAAAA'}} />}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <ReadOnlySelectField
                    label="Suppression Type"
                    value={getLabel(suppression.suppressionType, SUPPRESSION_TYPE_OPTIONS)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="Suppression Start Date" value={suppression.serviceStartDate} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="Suppression End Date" value={suppression.serviceEndDate} />
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      )}
    </div>
  );
};

export default OperationalUnitReview;
