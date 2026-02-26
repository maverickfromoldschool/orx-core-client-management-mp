import React, {useState, useEffect} from 'react';
import {Box, Typography, Button} from '@mui/material';

import {COLORS} from '../constants';
import {ProductAttribute, ProductAttributesTableProps} from '../types';
import {useAssignProductAttribute} from '../../../hooks/use-assign-product-attribute';
import {formatDate} from '../utils/date-formatter';
import {useAttributeRows} from '../hooks/use-attribute-rows';
import {useAttributeEditing} from '../hooks/use-attribute-editing';
import {useAttributeValues} from '../hooks/use-attribute-values';

import {AttributeRow} from './attribute-row';
import {TableHeader} from './table-header';
import {DeleteConfirmationDialog} from './delete-confirmation-dialog';

/**
 * ProductAttributesTable component
 * Custom table for displaying and managing product attributes with inline editing
 */
export const ProductAttributesTable: React.FC<ProductAttributesTableProps> = ({
  productGroupDetails,
  productId,
  attributes: initialAttributes
}) => {
  const {assignAttribute, updateAttribute, deleteAttribute} = useAssignProductAttribute();
  const [attributes, setAttributes] = useState<ProductAttribute[]>(initialAttributes);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<string | null>(null);

  // Custom hooks for state management
  const {attributeValuesMap, loadAttributeValues, loadInitialAttributeValues} = useAttributeValues();
  const {
    newRows,
    newRowValues,
    datePickerStates: newRowDatePickerStates,
    addNewRow,
    removeNewRow,
    updateNewRowField,
    toggleNewRowDatePicker,
    clearNewRow
  } = useAttributeRows();
  const {
    editingRowId,
    editingValues,
    datePickerStates: editingDatePickerStates,
    startEditing,
    cancelEditing,
    updateEditingField,
    toggleDatePicker,
    finishEditing
  } = useAttributeEditing();

  // Load attribute values for existing attributes on initial mount
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadInitialAttributeValues(initialAttributes);
  }, [loadInitialAttributeValues, initialAttributes]);

  const handleAddNewRow = () => {
    addNewRow(productId);
  };

  const handleSaveNewRow = async (id: number) => {
    const rowData = newRowValues[id];
    if (!rowData) return;

    const newAssignedAttribute = await assignAttribute({
      attribute: rowData.attribute,
      attributeVal: rowData.attributeVal,
      startDate: rowData.startDate,
      endDate: rowData.endDate,
      productId: rowData.productId,
      productExtId: ''
    });

    if (newAssignedAttribute) {
      setAttributes((prevAttributes) => [
        ...prevAttributes,
        {
          productExtId: newAssignedAttribute.productExtId,
          productId: newAssignedAttribute.productId,
          attribute: newAssignedAttribute.attribute,
          attributeVal: newAssignedAttribute.attributeVal,
          startDate: formatDate(newAssignedAttribute.startDt),
          endDate: newAssignedAttribute.endDt ? formatDate(newAssignedAttribute.endDt) : null
        }
      ]);
      clearNewRow(id);
    }
  };

  const handleNewRowFieldChange = async (
    rowId: number,
    field: 'attribute' | 'attributeVal' | 'startDate' | 'endDate',
    value: string
  ) => {
    updateNewRowField(rowId, field, value);

    // Fetch attribute values when attribute is selected
    if (field === 'attribute' && value) {
      await loadAttributeValues(value);
    }
  };

  const handleEditRow = async (attributeId: string) => {
    const attr = attributes.find((a) => a.productExtId === attributeId);
    if (!attr) return;

    startEditing(attributeId, {
      attribute: attr.attribute,
      attributeVal: attr.attributeVal,
      startDate: attr.startDate,
      endDate: attr.endDate || ''
    });

    // Fetch attribute values for editing (if not already loaded)
    if (attr.attribute) {
      await loadAttributeValues(attr.attribute);
    }
  };

  const handleSaveEditedRow = async (attributeId: string) => {
    const updatedValues = editingValues[attributeId];
    if (!updatedValues) return;

    const updatedAttribute = await updateAttribute({
      productExtId: attributeId,
      productId,
      attribute: updatedValues.attribute,
      attributeVal: updatedValues.attributeVal,
      startDate: updatedValues.startDate,
      endDate: updatedValues.endDate
    });

    if (updatedAttribute) {
      setAttributes((prevAttributes) =>
        prevAttributes.map((attr) =>
          attr.productExtId === attributeId
            ? {
                productExtId: updatedAttribute.productExtId,
                productId: updatedAttribute.productId,
                attribute: updatedAttribute.attribute,
                attributeVal: updatedAttribute.attributeVal,
                startDate: formatDate(updatedAttribute.startDt),
                endDate: updatedAttribute.endDt ? formatDate(updatedAttribute.endDt) : null
              }
            : attr
        )
      );
      finishEditing();
    }
  };

  const handleFieldChange = async (
    attributeId: string,
    field: 'attribute' | 'attributeVal' | 'startDate' | 'endDate',
    value: string
  ) => {
    updateEditingField(attributeId, field, value);

    // Fetch attribute values when attribute is selected
    if (field === 'attribute' && value) {
      await loadAttributeValues(value);
    }
  };

  const handleDeleteClick = (productExtId: string) => {
    setAttributeToDelete(productExtId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (attributeToDelete) {
      const success = await deleteAttribute({productExtId: attributeToDelete});
      if (success) {
        setAttributes((prevAttributes) => prevAttributes.filter((attr) => attr.productExtId !== attributeToDelete));
      }
    }
    setDeleteConfirmOpen(false);
    setAttributeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setAttributeToDelete(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '64px'
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '1.71em',
            color: COLORS.TEXT_BLACK
          }}
        >
          Number of attributes: {attributes.length || 0}
        </Typography>

        <Button
          variant="contained"
          onClick={handleAddNewRow}
          startIcon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill={COLORS.SECONDARY_WARM_WHITE} />
            </svg>
          }
          sx={{
            padding: '8px 24px 8px 16px',
            borderRadius: '46px',
            backgroundColor: COLORS.SECONDARY_DARK_BLUE,
            color: COLORS.SECONDARY_WARM_WHITE,
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '1.4em',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#001a5c'
            }
          }}
        >
          Assign Attributes
        </Button>
      </Box>

      {/* Table Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        <TableHeader />

        {/* Table Rows */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}
        >
          {/* New Rows */}
          {newRows.map((rowId) => {
            const rowValues = newRowValues[rowId];
            if (!rowValues) return null;

            const datePickerKey = `new-${rowId}`;

            return (
              <AttributeRow
                key={rowId}
                values={{
                  attribute: rowValues.attribute,
                  attributeVal: rowValues.attributeVal,
                  startDate: rowValues.startDate,
                  endDate: rowValues.endDate
                }}
                isEditing
                availableAttributes={productGroupDetails?.productGroupAttributeList || []}
                attributeValuesMap={attributeValuesMap}
                datePickerState={newRowDatePickerStates[datePickerKey] || {startDateOpen: false, endDateOpen: false}}
                onFieldChange={(field, value) => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleNewRowFieldChange(rowId, field, value);
                }}
                onDatePickerToggle={(field, open) => {
                  toggleNewRowDatePicker(rowId, field, open);
                }}
                onSave={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleSaveNewRow(rowId);
                }}
                onCancel={() => {
                  removeNewRow(rowId);
                }}
                onEdit={() => undefined}
                onDelete={() => undefined}
              />
            );
          })}

          {/* Existing Rows */}
          {attributes.map((attr) => {
            const isEditing = editingRowId === attr.productExtId;
            const editedValues = editingValues[attr.productExtId];
            const currentValues =
              isEditing && editedValues
                ? editedValues
                : {
                    attribute: attr.attribute,
                    attributeVal: attr.attributeVal,
                    startDate: attr.startDate,
                    endDate: attr.endDate || ''
                  };

            return (
              <AttributeRow
                key={attr.productExtId}
                values={currentValues}
                isEditing={isEditing}
                availableAttributes={productGroupDetails?.productGroupAttributeList || []}
                attributeValuesMap={attributeValuesMap}
                datePickerState={
                  editingDatePickerStates[attr.productExtId] || {startDateOpen: false, endDateOpen: false}
                }
                onFieldChange={(field, value) => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleFieldChange(attr.productExtId, field, value);
                }}
                onDatePickerToggle={(field, open) => {
                  toggleDatePicker(attr.productExtId, field, open);
                }}
                onSave={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleSaveEditedRow(attr.productExtId);
                }}
                onCancel={cancelEditing}
                onEdit={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  handleEditRow(attr.productExtId);
                }}
                onDelete={() => {
                  handleDeleteClick(attr.productExtId);
                }}
              />
            );
          })}
        </Box>
      </Box>

      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};
