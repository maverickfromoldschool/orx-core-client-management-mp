import React from 'react';
import {Box, Select, MenuItem} from '@mui/material';

import {AttributeValue} from '../../../hooks/use-get-attribute';
import {COLORS} from '../constants';

import {DateField} from './date-field';
import {ActionButtons} from './action-buttons';
import {AttributeRowData, DatePickerState} from './attribute-row-types';

interface AttributeRowProps {
  values: AttributeRowData;
  isEditing: boolean;
  availableAttributes: {attribute: string}[];
  attributeValuesMap: Record<string, AttributeValue[]>;
  datePickerState: DatePickerState;
  onFieldChange: (field: keyof AttributeRowData, value: string) => void;
  onDatePickerToggle: (field: 'startDateOpen' | 'endDateOpen', open: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AttributeRow: React.FC<AttributeRowProps> = ({
  values,
  isEditing,
  availableAttributes,
  attributeValuesMap,
  datePickerState,
  onFieldChange,
  onDatePickerToggle,
  onSave,
  onCancel,
  onEdit,
  onDelete
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '24px'
      }}
    >
      {/* Attribute Field */}
      <Box sx={{flex: 1}}>
        <Select
          displayEmpty
          value={values.attribute}
          onChange={(e) => {
            onFieldChange('attribute', e.target.value);
          }}
          size="small"
          disabled={!isEditing}
          sx={{
            width: '100%',
            backgroundColor: isEditing ? COLORS.NEUTRAL_WHITE : COLORS.NEUTRAL_20,
            '& .MuiOutlinedInput-notchedOutline': {
              border: isEditing ? `1px solid ${COLORS.NEUTRAL_70}` : 'none'
            }
          }}
        >
          <MenuItem value="" disabled>
            Select attribute
          </MenuItem>
          {availableAttributes.map((attr) => (
            <MenuItem key={attr.attribute} value={attr.attribute}>
              {attr.attribute}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Value Field */}
      <Box sx={{flex: 1}}>
        <Select
          displayEmpty
          value={values.attributeVal}
          onChange={(e) => {
            onFieldChange('attributeVal', e.target.value);
          }}
          size="small"
          disabled={!isEditing || !values.attribute}
          sx={{
            width: '100%',
            backgroundColor: isEditing ? COLORS.NEUTRAL_WHITE : COLORS.NEUTRAL_20,
            '& .MuiOutlinedInput-notchedOutline': {
              border: isEditing ? `1px solid ${COLORS.NEUTRAL_70}` : 'none'
            }
          }}
        >
          <MenuItem value="" disabled>
            Select value
          </MenuItem>
          {attributeValuesMap[values.attribute]?.map((attrVal) => (
            <MenuItem key={attrVal.attributeValue} value={attrVal.attributeValue}>
              {attrVal.description}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Start Date Field */}
      <Box sx={{flex: 1}}>
        <DateField
          value={values.startDate}
          onChange={(value) => {
            onFieldChange('startDate', value);
          }}
          disabled={!isEditing}
          isOpen={datePickerState.startDateOpen}
          onToggle={(open) => {
            onDatePickerToggle('startDateOpen', open);
          }}
        />
      </Box>

      {/* End Date Field */}
      <Box sx={{flex: 1}}>
        <DateField
          value={values.endDate}
          onChange={(value) => {
            onFieldChange('endDate', value);
          }}
          disabled={!isEditing}
          isOpen={datePickerState.endDateOpen}
          onToggle={(open) => {
            onDatePickerToggle('endDateOpen', open);
          }}
        />
      </Box>

      {/* Actions */}
      <ActionButtons isEditing={isEditing} onSave={onSave} onCancel={onCancel} onEdit={onEdit} onDelete={onDelete} />
    </Box>
  );
};
