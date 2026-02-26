/* eslint-disable @typescript-eslint/no-unused-vars */
import {useState, useCallback} from 'react';

import {AttributeRowData, DatePickerState} from '../components/attribute-row-types';

interface UseAttributeEditingReturn {
  editingRowId: string | null;
  editingValues: Record<string, AttributeRowData>;
  datePickerStates: Record<string, DatePickerState>;
  startEditing: (rowId: string, initialValues: AttributeRowData) => void;
  cancelEditing: () => void;
  updateEditingField: (rowId: string, field: keyof AttributeRowData, value: string) => void;
  toggleDatePicker: (attributeId: string, field: 'startDateOpen' | 'endDateOpen', open: boolean) => void;
  finishEditing: () => void;
}

/**
 * Custom hook to manage attribute row editing state
 */
export const useAttributeEditing = (): UseAttributeEditingReturn => {
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, AttributeRowData>>({});
  const [datePickerStates, setDatePickerStates] = useState<Record<string, DatePickerState>>({});

  const startEditing = useCallback((rowId: string, initialValues: AttributeRowData) => {
    setEditingRowId(rowId);
    setEditingValues((prev) => ({
      ...prev,
      [rowId]: initialValues
    }));
  }, []);

  const cancelEditing = useCallback(() => {
    if (editingRowId) {
      setEditingValues((prev) => {
        const {[editingRowId]: _, ...updated} = prev;
        return updated;
      });
    }
    setEditingRowId(null);
  }, [editingRowId]);

  const updateEditingField = useCallback((rowId: string, field: keyof AttributeRowData, value: string) => {
    setEditingValues((prev) => {
      const currentValue = prev[rowId];
      if (!currentValue) return prev;

      return {
        ...prev,
        [rowId]: {
          ...currentValue,
          [field]: value,
          // Reset attributeVal when attribute changes
          ...(field === 'attribute' ? {attributeVal: ''} : {})
        }
      };
    });
  }, []);

  const toggleDatePicker = useCallback((attributeId: string, field: 'startDateOpen' | 'endDateOpen', open: boolean) => {
    setDatePickerStates((prev) => ({
      ...prev,
      [attributeId]: {
        startDateOpen: prev[attributeId]?.startDateOpen || false,
        endDateOpen: prev[attributeId]?.endDateOpen || false,
        [field]: open
      }
    }));
  }, []);

  const finishEditing = useCallback(() => {
    if (editingRowId) {
      setEditingValues((prev) => {
        const {[editingRowId]: _, ...updated} = prev;
        return updated;
      });
    }
    setEditingRowId(null);
  }, [editingRowId]);

  return {
    editingRowId,
    editingValues,
    datePickerStates,
    startEditing,
    cancelEditing,
    updateEditingField,
    toggleDatePicker,
    finishEditing
  };
};
