import React from 'react';
import {Box, Grid} from '@mui/material';
import type {Control, FieldErrors} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../schemas';
import {FormTextField} from '../../components/form-text-field';
import {FormSelectField} from '../../components/form-select-field';
import {FormDateField} from '../../components/form-date-field';
import {ASSIGNED_TO_OPTIONS} from '../../data/lookup';

interface ContractInfoSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
}

export const ContractInfoSection: React.FC<ContractInfoSectionProps> = ({control, errors}) => {
  return (
    <Box sx={{mb: 5}}>
      {/* Row 1: Client Contract ID, Effective Date, Termination Date */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.clientContractId"
            control={control}
            label="Client Contract ID"
            placeholder="Enter contract ID"
            error={errors.contractDetails?.clientContractId}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormDateField
            name="contractDetails.effectiveDate"
            control={control}
            label="Effective Date"
            required
            error={errors.contractDetails?.effectiveDate}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormDateField
            name="contractDetails.terminationDate"
            control={control}
            label="Termination Date"
            error={errors.contractDetails?.terminationDate}
          />
        </Grid>
      </Grid>

      {/* Row 2: Contract Term, Client Membership, Client DOA Signor */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.contractTerm"
            control={control}
            label="Contract Term "
            placeholder="Enter contract term"
            error={errors.contractDetails?.contractTerm}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.clientMembership"
            control={control}
            label="Client Membership"
            placeholder="Enter client membership"
            error={errors.contractDetails?.clientMembership}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.clientDoaSignor"
            control={control}
            label="Client DOA Signor"
            placeholder="Enter client DOA signor"
            error={errors.contractDetails?.clientDoaSignor}
          />
        </Grid>
      </Grid>

      {/* Row 3: Contracting Legal Entity for OptumRx, Contracting Legal Entity for Client, Assigned To */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.contractingLegalEntityOptumRx"
            control={control}
            label="Contracting Legal Entity for OptumRx"
            placeholder="Enter legal entity"
            error={errors.contractDetails?.contractingLegalEntityOptumRx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            name="contractDetails.contractingLegalEntityClient"
            control={control}
            label="Contracting Legal Entity for Client"
            placeholder="Enter legal entity"
            error={errors.contractDetails?.contractingLegalEntityClient}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.assignedTo"
            control={control}
            label="Assigned to"
            options={ASSIGNED_TO_OPTIONS}
            placeholder="Select Assigned to"
            error={errors.contractDetails?.assignedTo}
          />
        </Grid>
      </Grid>

      {/* Row 4: Run-Off Effective Date */}
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
          <FormSelectField
            name="contractDetails.runOffEffectiveDate"
            control={control}
            label="Run-Off Days"
            options={RUN_OFF_EFFECTIVE_DATE_OPTIONS}
            placeholder="Select No. of days"
            error={errors.contractDetails?.runOffEffectiveDate}
          />
        </Grid> */}
        <Grid item xs={12} md={4}>
          <FormDateField
            name="contractDetails.runOffEffectiveDate"
            control={control}
            label="Run-Off Effective Date"
            error={errors.contractDetails?.runOffEffectiveDate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
