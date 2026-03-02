import React from 'react';
import {Grid} from '@mui/material';
import type {Control, FieldErrors} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../schemas';
import {FormTextField} from '../../components/form-text-field';
import {FormSelectField} from '../../components/form-select-field';
import {
  MARKET_SEGMENT_OPTIONS,
  LINE_OF_BUSINESS_OPTIONS,
  MR_PLAN_TYPE_OPTIONS,
  MR_GROUP_INDIVIDUAL_OPTIONS,
  MR_CLASSIFICATION_OPTIONS,
  PRICING_OPTIONS,
  MOCK_CONTACT_OPTIONS
} from '../../data/lookup';

interface OperationalUnitFieldsProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
}

export const OperationalUnitFields: React.FC<OperationalUnitFieldsProps> = ({
  control,
  errors,
  operationalUnitIndex
}) => {
  return (
    <div>
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormTextField
            name={`operationalUnits.${operationalUnitIndex}.name`}
            control={control}
            label="Operational Unit Name"
            required
            placeholder="Enter name"
            error={errors.operationalUnits?.[operationalUnitIndex]?.name}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            name={`operationalUnits.${operationalUnitIndex}.id`}
            control={control}
            label="Operational Unit ID"
            required
            placeholder="Enter name"
            error={errors.operationalUnits?.[operationalUnitIndex]?.id}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name={`operationalUnits.${operationalUnitIndex}.marketSegment`}
            control={control}
            label="Market Segment"
            options={MARKET_SEGMENT_OPTIONS}
            placeholder="Select market segment"
            error={errors.operationalUnits?.[operationalUnitIndex]?.marketSegment}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name={`operationalUnits.${operationalUnitIndex}.lineOfBusiness`}
            control={control}
            label="Line of Business"
            required
            options={LINE_OF_BUSINESS_OPTIONS}
            placeholder="Select line of business"
            error={errors.operationalUnits?.[operationalUnitIndex]?.lineOfBusiness}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name={`operationalUnits.${operationalUnitIndex}.mrPlanType`}
            control={control}
            label="M&R Plan Type"
            options={MR_PLAN_TYPE_OPTIONS}
            placeholder="Select M&R plan type"
            error={errors.operationalUnits?.[operationalUnitIndex]?.mrPlanType}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name={`operationalUnits.${operationalUnitIndex}.mrGroupIndividual`}
            control={control}
            label="M&R Group/Individual"
            options={MR_GROUP_INDIVIDUAL_OPTIONS}
            placeholder="Select M&R grouping"
            error={errors.operationalUnits?.[operationalUnitIndex]?.mrGroupIndividual}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name={`operationalUnits.${operationalUnitIndex}.mrClassification`}
            control={control}
            label="M&R Classification"
            options={MR_CLASSIFICATION_OPTIONS}
            placeholder="Select M&R classification"
            error={errors.operationalUnits?.[operationalUnitIndex]?.mrClassification}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name={`operationalUnits.${operationalUnitIndex}.passThroughTraditional`}
            control={control}
            label="Pass through/Traditional pricing"
            options={PRICING_OPTIONS}
            placeholder="Select"
            error={errors.operationalUnits?.[operationalUnitIndex]?.passThroughTraditional}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name={`operationalUnits.${operationalUnitIndex}.assignedContacts` as any}
            control={control}
            label="Assign Contacts"
            options={MOCK_CONTACT_OPTIONS}
            placeholder="Select contacts"
            error={errors.operationalUnits?.[operationalUnitIndex]?.assignedContacts as any}
          />
        </Grid>
      </Grid>
    </div>
  );
};
