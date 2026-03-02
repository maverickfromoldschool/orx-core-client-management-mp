import React, {useState} from 'react';
import {Box, Grid, IconButton, Divider, Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type {Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId} from 'react-hook-form';
import type {State} from 'react-country-state-city/dist/esm/types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import type {AddClientCombinedFormData} from '../stepper/schemas';
import {ADDRESS_TYPE_OPTIONS} from '../data/lookup';

import {FormTextField} from './form-text-field';
import {FormSelectField} from './form-select-field';
import StateSelect from './state-select';
import CitySelect from './city-select';

interface AddressSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  fields: FieldArrayWithId<AddClientCombinedFormData, 'clientDetails.addresses'>[];
  append: UseFieldArrayAppend<AddClientCombinedFormData, 'clientDetails.addresses'>;
  remove: UseFieldArrayRemove;
}

export const AddressSection: React.FC<AddressSectionProps> = ({control, errors, fields, append, remove}) => {
  const hasMultipleAddresses = fields.length > 1;
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

  const handleAddAddress = () => {
    append({
      addressType: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    });
  };

  const handleDeleteAddress = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div>
      {fields.map((field, index) => {
        const addressErrors = errors.clientDetails?.addresses?.[index];
        const selectedStateId = selectedStateIds.get(index);

        return (
          <React.Fragment key={field.id}>
            {/* Horizontal divider between addresses */}
            {index > 0 && (
              <Divider
                sx={{
                  my: 5,
                  borderColor: '#CBCCCD'
                }}
              />
            )}

            <Box sx={{position: 'relative'}}>
              {hasMultipleAddresses && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    display: 'flex',
                    gap: 0.5
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleDeleteAddress(index);
                    }}
                    aria-label={`Delete address ${index + 1}`}
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

              {/* First Row: Address Type, Address 1, Address 2 */}
              <Grid container spacing={3} sx={{mb: 3}}>
                <Grid item xs={12} md={4}>
                  <FormSelectField
                    name={`clientDetails.addresses.${index}.addressType`}
                    control={control}
                    label="Address Type"
                    required
                    options={ADDRESS_TYPE_OPTIONS}
                    placeholder="Select address type"
                    error={addressErrors?.addressType}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormTextField
                    name={`clientDetails.addresses.${index}.address1`}
                    control={control}
                    label="Address 1"
                    required
                    placeholder="Enter street address"
                    error={addressErrors?.address1}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormTextField
                    name={`clientDetails.addresses.${index}.address2`}
                    control={control}
                    label="Address 2"
                    placeholder="Apt, suite, unit, etc."
                    error={addressErrors?.address2}
                  />
                </Grid>
              </Grid>

              {/* Second Row: State, City, Zip (equal widths) */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <StateSelect
                    name={`clientDetails.addresses.${index}.state`}
                    control={control}
                    label="State"
                    required
                    placeholder="Enter state"
                    error={addressErrors?.state}
                    onStateChange={(state) => {
                      handleStateChange(index, state);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CitySelect
                    name={`clientDetails.addresses.${index}.city`}
                    control={control}
                    label="City"
                    required
                    placeholder="Enter city"
                    error={addressErrors?.city}
                    stateId={selectedStateId}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormTextField
                    name={`clientDetails.addresses.${index}.zip`}
                    control={control}
                    label="Zip"
                    required
                    placeholder="Enter ZIP code"
                    error={addressErrors?.zip}
                  />
                </Grid>
              </Grid>
            </Box>
          </React.Fragment>
        );
      })}

      {/* Add Address Button */}
      <Box sx={{mt: 3}}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            padding: '8px'
            // '&:hover': {
            //   backgroundColor: 'rgba(0, 38, 119, 0.08)'
            // }
          }}
        >
          Add another Address
        </Button>
      </Box>
    </div>
  );
};

export default AddressSection;
