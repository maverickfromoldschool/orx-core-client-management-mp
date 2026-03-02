import React, {useState} from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import {useFieldArray, useWatch} from 'react-hook-form';
import type {Control, FieldErrors, UseFormSetValue} from 'react-hook-form';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import type {AddClientCombinedFormData} from '../schemas';
import {defaultOperationalUnitAddressData} from '../schemas';
import {FormTextField} from '../../components/form-text-field';
import {FormSelectField} from '../../components/form-select-field';
import {AssignContactsChips} from '../../components/assign-contacts-chips';
import {
  MARKET_SEGMENT_OPTIONS,
  LINE_OF_BUSINESS_OPTIONS,
  MR_PLAN_TYPE_OPTIONS,
  MR_GROUP_INDIVIDUAL_OPTIONS,
  MR_CLASSIFICATION_OPTIONS,
  PRICING_OPTIONS,
  MOCK_CONTACT_OPTIONS
} from '../../data/lookup';

import {OperationalUnitAddressSection} from './operational-unit-address-section';
import {BillingAttributesOverrideSection} from './billing-override-section';

interface OperationalUnitsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
}

// Helper function to convert contacts from ContactsAccessStep to dropdown options
const getContactOptionsFromFormContacts = (
  contacts: AddClientCombinedFormData['contacts'] | undefined
): {value: string; label: string}[] => {
  if (!contacts || contacts.length === 0) {
    return MOCK_CONTACT_OPTIONS;
  }

  // Filter contacts that have at least first name or last name
  const validContacts = contacts.filter((contact) => contact.firstName || contact.lastName);

  if (validContacts.length === 0) {
    return MOCK_CONTACT_OPTIONS;
  }

  return validContacts.map((contact, index) => ({
    value: `contact_${index}_${contact.email || index}`,
    label: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || `Contact ${index + 1}`
  }));
};

export const OperationalUnitsStep: React.FC<OperationalUnitsStepProps> = ({control, errors, setValue}) => {
  // Track which operational unit card is expanded (index-based)
  // Initialize to 0 so first card is expanded by default (Requirement 1.4)
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  // Field array for operational units (Requirement 8.4)
  // Task 6.4: Add append and remove methods for managing multiple units
  const {fields, remove, prepend} = useFieldArray({
    control,
    name: 'operationalUnits'
  });

  // Watch all operational units to get current names for collapsed card titles
  const operationalUnits = useWatch({
    control,
    name: 'operationalUnits'
  });

  // Get contact options from form contacts or use mock data as fallback
  const contactOptions = getContactOptionsFromFormContacts(undefined);

  // Task 6.1: Implement accordion expand/collapse logic
  // Only one card expanded at a time - clicking collapsed card expands it and collapses others
  const handleAccordionChange = (index: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedIndex(isExpanded ? index : -1);
  };

  // Task 6.3: Handle delete operational unit
  // Requirements 5.7, 5.8
  const handleDeleteOperationalUnit = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Adjust expanded index if needed
      if (expandedIndex === index) {
        // If deleting the expanded card, expand the previous one or the first one
        setExpandedIndex(index > 0 ? index - 1 : 0);
      } else if (expandedIndex > index) {
        // If deleting a card before the expanded one, adjust the index
        setExpandedIndex(expandedIndex - 1);
      }
    }
  };

  // Task 6.4: Handle add new operational unit
  // Requirements 5.2, 5.3
  const handleAddOperationalUnit = () => {
    prepend({
      name: '',
      id: '',
      lobNumeric: '',
      lineOfBusiness: '',
      marketSegment: '',
      mrPlanType: '',
      mrGroupIndividual: '',
      mrClassification: '',
      passThroughTraditional: '',
      assignedContacts: [],
      addresses: [defaultOperationalUnitAddressData],
      billingAttributesOverride: undefined,
      addSuppressions: false,
      suppressions: []
    });
    // Expand the newly added card
    setExpandedIndex(0);
  };

  return (
    <div>
      {/* Operational unit cards with 56px gap (Requirement 5.10) */}
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '56px'}}>
        {fields.map((field, index) => {
          const isExpanded = expandedIndex === index;
          // Task 6.2: Get the operational unit name for collapsed card title
          // Requirements 5.5, 5.6
          // Use watched values to get the current name (not the initial field value)
          const unitName = operationalUnits?.[index]?.name || '';
          const nameSuffix = unitName ? ` - ${unitName}` : '';
          const displayTitle = isExpanded ? 'Operational Units' : `Operational Units${nameSuffix}`;

          return (
            <Accordion
              key={field.id}
              expanded={isExpanded}
              onChange={handleAccordionChange(index)}
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  },
                  '& .MuiAccordionSummary-content.Mui-expanded': {
                    margin: 0
                  }
                }}
              >
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '4px', flex: 1}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography
                      sx={{
                        fontSize: '23px',
                        fontWeight: 700,
                        color: '#323334',
                        lineHeight: 1.2
                      }}
                    >
                      {displayTitle}
                    </Typography>
                    {/* Delete icon beside OU name, only on collapsed cards and if more than one OU */}
                    {fields.length > 1 && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOperationalUnit(index);
                        }}
                        aria-label={`Delete operational unit ${index + 1}`}
                        disableRipple
                        sx={{
                          padding: 0,
                          color: '#0C55B8',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#002677'
                          }
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#4B4D4F',
                      lineHeight: 1.4,
                      my: 2
                    }}
                  >
                    Complete the fields below.
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: '30px 24px'
                }}
              >
                {/* Basic Fields Section (Task 3) */}
                <div>
                  {/* Row 1: Operational Unit Name, Operational Unit ID, Market Segment (Requirements 2.1-2.3, 7.4) */}
                  <Grid container spacing={3} sx={{mb: 3}}>
                    <Grid item xs={12} md={4}>
                      <FormTextField
                        name={`operationalUnits.${index}.name`}
                        control={control}
                        label="Operational Unit Name"
                        required
                        placeholder="Enter name"
                        error={errors.operationalUnits?.[index]?.name}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormTextField
                        name={`operationalUnits.${index}.id`}
                        control={control}
                        label="Operational Unit ID"
                        required
                        placeholder="Enter name"
                        error={errors.operationalUnits?.[index]?.id}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormTextField
                        name={`operationalUnits.${index}.lobNumeric`}
                        control={control}
                        label="LOB Numeric"
                        required
                        placeholder="Enter name"
                        error={errors.operationalUnits?.[index]?.lobNumeric}
                      />
                    </Grid>
                  </Grid>

                  {/* Row 2: Line of Business, M&R Plan Type, M&R Group/Individual (Requirements 2.4-2.6, 7.5) */}
                  <Grid container spacing={3} sx={{mb: 3}}>
                    <Grid item xs={12} md={4}>
                      <FormSelectField
                        name={`operationalUnits.${index}.marketSegment`}
                        control={control}
                        label="Market Segment"
                        options={MARKET_SEGMENT_OPTIONS}
                        placeholder="Select market segment"
                        error={errors.operationalUnits?.[index]?.marketSegment}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormSelectField
                        name={`operationalUnits.${index}.lineOfBusiness`}
                        control={control}
                        label="Line of Business"
                        required
                        options={LINE_OF_BUSINESS_OPTIONS}
                        placeholder="Select line of business"
                        error={errors.operationalUnits?.[index]?.lineOfBusiness}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormSelectField
                        name={`operationalUnits.${index}.mrPlanType`}
                        control={control}
                        label="M&R Plan Type"
                        options={MR_PLAN_TYPE_OPTIONS}
                        placeholder="Select M&R plan type"
                        error={errors.operationalUnits?.[index]?.mrPlanType}
                      />
                    </Grid>
                  </Grid>

                  {/* Row 3: M&R Classification, Pass through/Traditional pricing, Run-off Period (Requirements 2.7-2.9, 7.6) */}
                  <Grid container spacing={3} sx={{mb: 3}}>
                    <Grid item xs={12} md={4}>
                      <FormSelectField
                        name={`operationalUnits.${index}.mrGroupIndividual`}
                        control={control}
                        label="M&R Group/Individual"
                        options={MR_GROUP_INDIVIDUAL_OPTIONS}
                        placeholder="Select M&R grouping"
                        error={errors.operationalUnits?.[index]?.mrGroupIndividual}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormSelectField
                        name={`operationalUnits.${index}.mrClassification`}
                        control={control}
                        label="M&R Classification"
                        options={MR_CLASSIFICATION_OPTIONS}
                        placeholder="Select M&R classification"
                        error={errors.operationalUnits?.[index]?.mrClassification}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormSelectField
                        name={`operationalUnits.${index}.passThroughTraditional`}
                        control={control}
                        label="Pass through/Traditional pricing"
                        options={PRICING_OPTIONS}
                        placeholder="Select"
                        error={errors.operationalUnits?.[index]?.passThroughTraditional}
                      />
                    </Grid>
                  </Grid>

                  {/* Assign Contacts Chips Section (Task 3) */}
                  {/* Requirements 2.10-2.13, 9.7 */}
                  <AssignContactsChips
                    control={control}
                    operationalUnitIndex={index}
                    availableContacts={contactOptions}
                  />
                </div>

                {/* Horizontal separator between basic fields and address section (Task 4.1) */}
                <Divider sx={{my: 6, borderColor: '#AAAAAA'}} />

                {/* Address Section (Task 4) */}
                <OperationalUnitAddressSection control={control} errors={errors} operationalUnitIndex={index} />

                {/* Billing Attributes Override Section (Task 5) - includes ACH fields and Suppressions */}
                <BillingAttributesOverrideSection
                  control={control}
                  errors={errors}
                  operationalUnitIndex={index}
                  setValue={setValue}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Task 6.4: Add another operational unit button */}
      {/* Requirements 5.2, 5.3 */}
      <Box sx={{mt: 3}}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddOperationalUnit}
          sx={{
            color: '#002677',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            padding: '8px 24px',
            borderRadius: '999px',
            borderColor: '#002677',
            borderWidth: '1px',
            backgroundColor: '#FAF8F2',
            '&:hover': {
              backgroundColor: '#F5F1E8',
              borderColor: '#002677',
              borderWidth: '1px'
            }
          }}
        >
          Add another operational unit
        </Button>
      </Box>
    </div>
  );
};

export default OperationalUnitsStep;
