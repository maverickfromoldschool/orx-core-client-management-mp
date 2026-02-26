import React from 'react';
import {Box, Typography, Switch, Button, Divider} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type {Control, FieldErrors, UseFormSetValue, FieldArrayWithId} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../schemas';
import SuppressionRow from '../../components/suppression-row';

interface SuppressionsSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
  addSuppressions?: boolean;
  suppressionFields: FieldArrayWithId<AddClientCombinedFormData, any>[];
  onAddSuppression: () => void;
  onRemoveSuppression: (index: number) => void;
  namePrefix?: string;
  setValueName?: string;
}

export const SuppressionsSection: React.FC<SuppressionsSectionProps> = ({
  control,
  errors,
  setValue,
  addSuppressions,
  suppressionFields,
  onAddSuppression,
  onRemoveSuppression,
  namePrefix = 'suppressions',
  setValueName = 'addSuppressions'
}) => {
  return (
    <>
      <Divider sx={{borderColor: '#CBCCCD', my: 6}} />

      <div>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mb: 3}}>
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
              setValue(setValueName as any, e.target.checked);
            }}
            sx={{
              width: 44,
              height: 24,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: 0,
                margin: '2px',
                transitionDuration: '300ms',
                '&.Mui-checked': {
                  transform: 'translateX(20px)',
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#002677',
                    opacity: 1,
                    border: 0
                  }
                }
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 20,
                height: 20
              },
              '& .MuiSwitch-track': {
                borderRadius: 12,
                backgroundColor: '#E9E9EA',
                opacity: 1
              }
            }}
          />
          {!addSuppressions && (
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#72777A',
                fontStyle: 'italic'
              }}
            >
              Toggle to add suppressions
            </Typography>
          )}
        </Box>

        {addSuppressions && (
          <Box sx={{mt: 3}}>
            {suppressionFields.map((field, index) => (
              <SuppressionRow
                key={field.id}
                index={index}
                control={control}
                errors={errors}
                onRemove={() => {
                  onRemoveSuppression(index);
                }}
                showDelete={suppressionFields.length > 1}
                showDivider={index > 0}
                namePrefix={namePrefix}
              />
            ))}

            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={onAddSuppression}
              sx={{
                color: '#002677',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 700,
                padding: '8px 0',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              Add another suppression
            </Button>
          </Box>
        )}
      </div>
    </>
  );
};
