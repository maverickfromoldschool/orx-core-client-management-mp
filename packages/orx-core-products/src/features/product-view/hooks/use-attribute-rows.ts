import {useState, useCallback} from 'react';

import {AttributeRowData, DatePickerState} from '../components/attribute-row-types';
import {getTodayFormatted} from '../utils/date-formatter';

interface UseAttributeRowsReturn {
  newRows: number[];
  newRowValues: Record<number, AttributeRowData & {productId: string}>;
  datePickerStates: Record<string, DatePickerState>;
  addNewRow: (productId: string) => void;
  removeNewRow: (id: number) => void;
  updateNewRowField: (rowId: number, field: keyof AttributeRowData, value: string) => void;
  toggleNewRowDatePicker: (rowId: number, field: 'startDateOpen' | 'endDateOpen', open: boolean) => void;
  clearNewRow: (id: number) => void;
}

/**
 * Custom hook to manage new attribute rows
 */
export const useAttributeRows = (): UseAttributeRowsReturn => {
  const [newRows, setNewRows] = useState<number[]>([]);
  const [newRowValues, setNewRowValues] = useState<Record<number, AttributeRowData & {productId: string}>>({});
  const [datePickerStates, setDatePickerStates] = useState<Record<string, DatePickerState>>({});

  const addNewRow = useCallback((productId: string) => {
    const newRowId = Date.now();
    setNewRows((prev) => [newRowId, ...prev]);
    setNewRowValues((prev) => ({
      ...prev,
      [newRowId]: {
        attribute: '',
        attributeVal: '',
        startDate: getTodayFormatted(),
        endDate: '',
        productId
      }
    }));
  }, []);

  const removeNewRow = useCallback((id: number) => {
    setNewRows((prev) => prev.filter((rowId) => rowId !== id));
    setNewRowValues((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _, ...updated} = prev;
      return updated;
    });
  }, []);

  const updateNewRowField = useCallback((rowId: number, field: keyof AttributeRowData, value: string) => {
    setNewRowValues((prev) => {
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

  const toggleNewRowDatePicker = useCallback((rowId: number, field: 'startDateOpen' | 'endDateOpen', open: boolean) => {
    const key = `new-${rowId}`;
    setDatePickerStates((prev) => ({
      ...prev,
      [key]: {
        startDateOpen: prev[key]?.startDateOpen || false,
        endDateOpen: prev[key]?.endDateOpen || false,
        [field]: open
      }
    }));
  }, []);

  const clearNewRow = useCallback(
    (id: number) => {
      removeNewRow(id);
    },
    [removeNewRow]
  );

  return {
    newRows,
    newRowValues,
    datePickerStates,
    addNewRow,
    removeNewRow,
    updateNewRowField,
    toggleNewRowDatePicker,
    clearNewRow
  };
};
