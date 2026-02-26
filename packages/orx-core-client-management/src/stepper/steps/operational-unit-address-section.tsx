import React, {useState} from 'react';
import {Box, Grid, Divider, IconButton, Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useFieldArray} from 'react-hook-form';
import type {Control, FieldErrors} from 'react-hook-form';
import {State} from 'react-country-state-city/dist/esm/types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import type {AddClientCombinedFormData} from '../schemas';
import {defaultOperationalUnitAddressData} from '../schemas';
import {FormTextField} from '../../components/form-text-field';
import {FormSelectField} from '../../components/form-select-field';
import {ADDRESS_TYPE_OPTIONS} from '../../data/lookup';
import StateSelect from '../../components/state-select';
import CitySelect from '../../components/city-select';

interface OperationalUnitAddressSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
}

export const OperationalUnitAddressSection: React.FC<OperationalUnitAddressSectionProps> = ({
  control,
  errors,
  operationalUnitIndex
}) => {
  // Store selected state IDs for each address index
  const [selectedStateIds, setSelectedStateIds] = useState<Map<number, number>>(new Map());

  const handleStateChange = (index: number, state: State | null) => {
    setSelectedStateIds((prev) => {
      const newMap = new Map(prev);
      if (state?.id) {
        newMap.set(index, state.id);
      } else {
        newMap.delete(index);
      }
      return newMap;
    });
  };

  // Nested useFieldArray for addresses within each operational unit (Task 4.2)
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress
  } = useFieldArray({
    control,
    name: `operationalUnits.${operationalUnitIndex}.addresses`
  });

  const handleAddAddress = () => {
    appendAddress(defaultOperationalUnitAddressData);
  };

  const handleDeleteAddress = (addressIndex: number) => {
    if (addressFields.length > 1) {
      removeAddress(addressIndex);
    }
  };

  return (
    <div>
      {addressFields.map((addressField, addressIndex) => {
        const selectedStateId = selectedStateIds.get(addressIndex);
        return (
          <Box key={addressField.id}>
            {/* Delete button for addresses after the first (Task 4.4) */}
            {addressIndex > 0 && (
              <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>
                <IconButton
                  onClick={() => {
                    handleDeleteAddress(addressIndex);
                  }}
                  aria-label={`Delete address ${addressIndex + 1}`}
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
              </Box>
            )}

            {/* Address Row 1: Address Type, Address 1, Address 2 (Requirements 3.2-3.4, 7.8) */}
            <Grid container spacing={3} sx={{mb: 3}}>
              <Grid item xs={12} md={4}>
                <FormSelectField
                  name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.addressType`}
                  control={control}
                  label="Address Type"
                  required
                  options={ADDRESS_TYPE_OPTIONS}
                  placeholder="Select Address type"
                  error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.addressType}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormTextField
                  name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.address1`}
                  control={control}
                  label="Address 1"
                  required
                  placeholder="Enter Address 1"
                  error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.address1}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormTextField
                  name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.address2`}
                  control={control}
                  label="Address 2"
                  placeholder="Enter Address 2"
                  error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.address2}
                />
              </Grid>
            </Grid>

            {/* Address Row 2: City, State, Zip (Requirements 3.5-3.7, 7.9) */}
            <Grid container spacing={3} sx={{mb: addressIndex < addressFields.length - 1 ? 3 : 0}}>
              <Grid item xs={12} md={4}>
                <StateSelect
                  name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.state`}
                  control={control}
                  label="State"
                  required
                  placeholder="Enter state"
                  error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.state}
                  onStateChange={(state) => {
                    handleStateChange(addressIndex, state);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CitySelect
                  name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.city`}
                  control={control}
                  label="City"
                  required
                  placeholder="Enter city"
                  error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.city}
                  stateId={selectedStateId}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormTextField
                  name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.zip`}
                  control={control}
                  label="Zip"
                  required
                  placeholder="Enter zip"
                  error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.zip}
                />
              </Grid>
            </Grid>

            {/* Divider between multiple addresses */}
            {addressIndex < addressFields.length - 1 && <Divider sx={{my: 3, borderColor: '#AAAAAA'}} />}
          </Box>
        );
      })}

      {/* Add another billing address button (Task 4.5) */}
      <Box sx={{mt: 3}}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
          sx={{
            color: '#0C55B8',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: 'rgba(12, 85, 184, 0.08)'
            }
          }}
        >
          Add another billing address
        </Button>
      </Box>
    </div>
  );
};
