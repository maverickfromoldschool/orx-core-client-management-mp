/*
  File replaced with a clean, working implementation below.
  The previous content above was corrupted. The replacement implementation
  is the full component starting from the top of the file.
*/

'use client';

import React from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Button,
  TextField,
  Checkbox,
  Switch,
  Tabs,
  Tab,
  Box,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Tooltip,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {format, parse, isValid} from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import CodeIcon from '@mui/icons-material/Code';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {useLookupExtensionDialog} from '../useLookupExtensionDialog/use-lookup-extension-dialog';
import {useLookupExtensionApi} from '../../lookup-extension-page/useLookupExtensionApi/use-lookup-extension-api';
import {JsonConfigEditor} from '../../components/json-config-editor';

import {LookupExtensionDialogProps, DropdownOption} from './lookup-extension-dialog.types';

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

/**
 * Lookup API response - actual structure from backend
 */
interface LookupApiResponse {
  content?: {
    values?: {
      id?: {
        fieldVal?: string;
        [key: string]: any;
      };
      displayName?: string;
      notes?: string;
      description?: string;
      [key: string]: any;
    }[];
    [key: string]: any;
  }[];
  page?: any;
}

/**
 * Small defensive mapper for lookup value responses
 * Uses item.displayName as label and item.id.fieldVal as value
 */
const mapLookupToDropdownOptions = (response: LookupApiResponse): DropdownOption[] => {
  try {
    const content = response?.content;
    if (!content || !Array.isArray(content) || content.length === 0) {
      return [];
    }

    const values = content[0]?.values?.filter((item) => item?.['disableDisplaySw'] !== 'Y');
    if (!values || !Array.isArray(values)) {
      return [];
    }

    return values
      .map((item) => {
        // value comes from id.fieldVal
        const value = item?.id?.fieldVal || '';
        // label comes from displayName or description as fallback
        const label = item?.displayName || item?.description || value || 'Unknown';

        return {
          value: value?.trim() || '',
          label: label?.trim() || ''
        };
      })
      .filter((opt) => opt.value !== '') // Remove empty values
      .filter(
        (opt, index, self) =>
          // Remove duplicates based on value
          index === self.findIndex((t) => t.value === opt.value)
      );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error mapping lookup response:', err);
    return [];
  }
};

interface EntryRow {
  id: string;
  lookupValue?: string;
  values?: Record<string, string>;
  draft?: boolean;
}
interface FieldRow {
  id: string;
  element?: string;
  displayName?: string;
  dataType?: string;
  lookupCode?: string;
  required?: boolean;
  draft?: boolean;
}

export function LookupExtensionDialog(props: LookupExtensionDialogProps) {
  useLookupExtensionDialog(props);
  const lookupApi = useLookupExtensionApi();
  const {showSuccess, showError} = useNotification();
  const {open: openProp, onClose: onCloseProp} = props;

  const [internalOpen, setInternalOpen] = React.useState(true);
  const open = typeof openProp === 'boolean' ? openProp : internalOpen;
  const setOpen = (v: boolean) => {
    if (typeof openProp === 'boolean') {
      if (!v && typeof onCloseProp === 'function') onCloseProp();
    } else setInternalOpen(v);
  };

  const [tab, setTab] = React.useState(0);
  const [extensionId, setExtensionId] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [lookupCode, setLookupCode] = React.useState('');
  const [systemDefined, setSystemDefined] = React.useState(false); // Requirement 6: Initial state OFF
  const [userMapping, setUserMapping] = React.useState(false);
  const [multipleOccurrences, setMultipleOccurrences] = React.useState(false); // Requirement 6: Initial state OFF

  // start empty when creating a new extension (no data passed in yet)
  const [fields, setFields] = React.useState<FieldRow[]>([]);
  const [entries, setEntries] = React.useState<EntryRow[]>([]);

  // counters for generating ids for soft-added rows
  const [nextFieldIndex, setNextFieldIndex] = React.useState(1);
  const [nextEntryIndex, setNextEntryIndex] = React.useState(1);

  const [editingFieldIds, setEditingFieldIds] = React.useState<string[]>([]);
  const [tempFields, setTempFields] = React.useState<Record<string, FieldRow>>({});

  const [editingEntryIds, setEditingEntryIds] = React.useState<string[]>([]);
  const [tempEntries, setTempEntries] = React.useState<Record<string, EntryRow>>({});

  // JSON editor state
  const [jsonEditorOpen, setJsonEditorOpen] = React.useState(false);
  const [jsonEditorData, setJsonEditorData] = React.useState<{rowId: string; fieldKey: string; value: object | null}>({
    rowId: '',
    fieldKey: '',
    value: null
  });

  // Lookup value options mapped by lookup code (field id)
  const [lookupValueOptions, setLookupValueOptions] = React.useState<Record<string, DropdownOption[]>>({});
  // Main lookup value options for the top-level lookup code (used for Lookup Value column in Entries)
  const [mainLookupValueOptions, setMainLookupValueOptions] = React.useState<DropdownOption[]>([]);

  // Validation error states
  const [fieldElementErrors, setFieldElementErrors] = React.useState<Record<string, string>>({});
  const [fieldDisplayNameErrors, setFieldDisplayNameErrors] = React.useState<Record<string, string>>({});
  const [fieldLookupCodeErrors, setFieldLookupCodeErrors] = React.useState<Record<string, string>>({});
  const [entryLookupValueErrors, setEntryLookupValueErrors] = React.useState<Record<string, string>>({});

  // Top-level form field errors
  const [extensionIdError, setExtensionIdError] = React.useState<string>('');
  const [displayNameError, setDisplayNameError] = React.useState<string>('');
  const [lookupCodeError, setLookupCodeError] = React.useState<string>('');

  /**
   * Fetch lookup values for the main (top-level) lookup code
   * These options will be used for the Lookup Value column in Entries table
   */
  const fetchMainLookupValues = React.useCallback(async (topLevelLookupCode: string) => {
    if (!topLevelLookupCode?.trim()) return;

    try {
      const response = await axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
        field: topLevelLookupCode,
        page: 0,
        size: 100
      });

      const options = mapLookupToDropdownOptions(response.data);
      setMainLookupValueOptions(options);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error fetching main lookup values for', topLevelLookupCode, ':', err);
      // Set empty array on error
      setMainLookupValueOptions([]);
    }
  }, []);

  /**
   * Fetch lookup values for a given lookup code (field)
   */
  const fetchLookupValues = React.useCallback(async (fieldLookupCode: string) => {
    if (!fieldLookupCode?.trim()) return;

    try {
      const response = await axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
        field: fieldLookupCode,
        page: 0,
        size: 100
      });

      const options = mapLookupToDropdownOptions(response.data);
      // Store options using the field id that matches this lookup code
      setLookupValueOptions((prev) => ({
        ...prev,
        [fieldLookupCode]: options
      }));
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error fetching lookup values for', fieldLookupCode, ':', err);
      // Set empty array on error
      setLookupValueOptions((prev) => ({
        ...prev,
        [fieldLookupCode]: []
      }));
    }
  }, []);

  // initialize when editing an existing extension
  React.useEffect(() => {
    const init = props.initialData;
    if (!init) return;

    const initRecord = init;
    const {
      objectCode,
      name,
      field,
      systemDefined: systemDefinedVal,
      userMapping: userMappingVal,
      multipleOccurrences: multipleOccurrencesVal,
      json: js
    } = initRecord;

    // populate simple scalar fields
    setExtensionId(typeof objectCode === 'string' ? objectCode : '');
    setDisplayName(typeof name === 'string' ? name : '');
    const initialLookupCode = typeof field === 'string' ? field : '';
    setLookupCode(initialLookupCode);
    setSystemDefined((typeof systemDefinedVal === 'string' ? systemDefinedVal : 'N').toUpperCase() === 'Y');
    setUserMapping((typeof userMappingVal === 'string' ? userMappingVal : 'N').toUpperCase() === 'Y');
    setMultipleOccurrences(
      (typeof multipleOccurrencesVal === 'string' ? multipleOccurrencesVal : 'N').toUpperCase() === 'Y'
    );

    // Fetch main lookup values if lookup code is present
    if (initialLookupCode?.trim()) {
      fetchMainLookupValues(initialLookupCode).catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch main lookup values on init:', err);
      });
    }

    // populate fields and entries from json
    const jsObj = js as Record<string, unknown> | undefined;
    const f = Array.isArray(jsObj?.['fields']) ? jsObj['fields'] : [];
    const e = Array.isArray(jsObj?.['entries']) ? jsObj['entries'] : [];

    // map to the dialog's internal row shapes
    // Use displayName (fieldName from API) as the key for entries
    const mappedFields = f.map((ff, idx) => {
      const ffObj = ff as Record<string, unknown> | undefined;
      const fieldNameVal = ffObj?.['fieldName'];
      const elementVal = ffObj?.['element'];
      const dataTypeVal = ffObj?.['dataType'];
      const lookupCodeVal = ffObj?.['lookupCode'];
      const requiredVal = ffObj?.['required'];

      const fieldName = typeof fieldNameVal === 'string' ? fieldNameVal : '';
      const element = typeof elementVal === 'string' ? elementVal : '';
      const fieldId = fieldName || element || `f-${idx}`;

      return {
        id: fieldId,
        element,
        displayName: fieldName,
        dataType: typeof dataTypeVal === 'string' ? dataTypeVal : '',
        lookupCode: typeof lookupCodeVal === 'string' ? lookupCodeVal : '',
        required: !!requiredVal
      } as FieldRow;
    });

    setFields(mappedFields);

    // Fetch lookup values for all field lookup codes
    mappedFields.forEach((fieldItem) => {
      if (fieldItem.lookupCode?.trim()) {
        fetchLookupValues(fieldItem.lookupCode).catch((err: unknown) => {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch lookup values for field:', fieldItem.lookupCode, err);
        });
      }
    });
    setEntries(
      e.map((ee, idx) => {
        const eeObj = ee as Record<string, unknown> | undefined;
        const lookupValueVal = eeObj?.['lookupValue'];
        const idVal = eeObj?.['id'];
        const lookupValue = typeof lookupValueVal === 'string' ? lookupValueVal : '';
        let entryId: string;
        if (typeof lookupValueVal === 'string') {
          entryId = lookupValueVal;
        } else if (typeof idVal === 'string') {
          entryId = idVal;
        } else {
          entryId = `r-${idx}`;
        }

        return {
          id: entryId,
          lookupValue,
          values: eeObj as Record<string, string>
        } as EntryRow;
      })
    );
  }, [props.initialData, fetchMainLookupValues, fetchLookupValues]);

  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // Define cancel functions before they're used
  const cancelEditField = (id: string) => {
    // if this was a draft row (just added), remove it from fields entirely
    const f = fields.find((r) => r.id === id);
    if (f?.draft) {
      setFields((s) => s.filter((r) => r.id !== id));
    }
    setTempFields((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = p;
      return rest;
    });
    setEditingFieldIds((s) => s.filter((x) => x !== id));
  };
  const cancelEditEntry = (id: string) => {
    const e = entries.find((r) => r.id === id);
    if (e?.draft) {
      setEntries((s) => s.filter((r) => r.id !== id));
    }
    setTempEntries((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = p;
      return rest;
    });
    setEditingEntryIds((s) => s.filter((x) => x !== id));
  };

  const handleClose = () => {
    setOpen(false);
  };
  // Reset the dialog's local state to its initial values. This ensures that
  // when the dialog is closed and reopened it does not retain previous data
  // (behaves like a destroyed/recreated component).
  const resetLocalState = () => {
    setTab(0);
    setExtensionId('');
    setDisplayName('');
    setLookupCode('');
    setSystemDefined(false); // Requirement 6: Reset to OFF
    setUserMapping(false);
    setMultipleOccurrences(false); // Requirement 6: Reset to OFF
    setFields([]);
    setEntries([]);
    setNextFieldIndex(1);
    setNextEntryIndex(1);
    setEditingFieldIds([]);
    setTempFields({});
    setEditingEntryIds([]);
    setTempEntries({});
    // Requirement 4: Clear all error messages
    setExtensionIdError('');
    setDisplayNameError('');
    setLookupCodeError('');
    setFieldElementErrors({});
    setFieldDisplayNameErrors({});
    setFieldLookupCodeErrors({});
    setEntryLookupValueErrors({});
    setSaveError(null);
  };

  // When the dialog is explicitly closed via handleClose, reset state.
  const handleCloseAndReset = () => {
    setOpen(false);
    resetLocalState();
  };

  /**
   * Validate top-level lookup code for uniqueness against field lookup codes
   */
  const validateTopLevelLookupCode = (code: string): boolean => {
    if (!code?.trim()) {
      setLookupCodeError('');
      return true;
    }

    const codeLower = code.trim().toLowerCase();

    // Check against all field lookup codes
    const matchesFieldLookupCode = fields.some((f) => f.lookupCode?.trim().toLowerCase() === codeLower);

    if (matchesFieldLookupCode) {
      setLookupCodeError('This lookup code matches a field lookup code');
      return false;
    }

    setLookupCodeError('');
    return true;
  };

  const handleSave = async () => {
    // Clear any previous error
    setSaveError(null);

    let hasError = false;

    // Validate Extension ID
    if (!extensionId?.trim()) {
      setExtensionIdError('Extension (identifier) is required');
      hasError = true;
    } else {
      setExtensionIdError('');
    }

    // Validate Display Name
    if (!displayName?.trim()) {
      setDisplayNameError('Display name is required');
      hasError = true;
    } else {
      setDisplayNameError('');
    }

    // Validate Lookup Code
    if (!lookupCode?.trim()) {
      setLookupCodeError('Lookup code is required');
      hasError = true;
    } else if (!validateTopLevelLookupCode(lookupCode)) {
      hasError = true;
    }

    if (hasError) {
      setSaveError('Please fix the errors above before saving');
      return;
    }

    setSaving(true);

    try {
      // Determine if this is create or update based on initialData
      const isUpdate = !!props.initialData;
      const currentUser = 'CURRENT_USER'; // TODO: Get from auth context
      // Format date without milliseconds and timezone: YYYY-MM-DDTHH:mm:ss
      const now = new Date().toISOString().split('.')[0];

      // Build API request directly
      const initData = props.initialData as Record<string, unknown> | undefined;
      const createdByVal = initData?.['createdBy'];
      const createdDateVal = initData?.['createdDate'];
      const versionVal = initData?.['version'];

      // Ensure createdBy and createdDate are always strings
      const createdByFinal: string =
        typeof createdByVal === 'string' && createdByVal.length > 0 ? createdByVal : currentUser;
      const createdDateFinal: string | undefined =
        typeof createdDateVal === 'string' && createdDateVal.length > 0 ? createdDateVal : now;

      const apiData = {
        extensionCode: extensionId,
        name: displayName,
        field: lookupCode,
        jsonData: {
          fields: fields
            .filter((f) => !f.draft)
            .map((f, index) => ({
              seqNumber: index + 1,
              fieldName: f.displayName || '',
              element: f.element || '',
              dataType: f.dataType || '',
              lookupCode: f.lookupCode || null,
              required: f.required || false
            })),
          entries: entries
            .filter((e) => !e.draft)
            .map((e) => ({
              lookupValue: e.lookupValue || '',
              ...e.values
            }))
        },
        systemSw: (systemDefined ? 'Y' : 'N') as string,
        userMappingSw: (userMapping ? 'Y' : 'N') as string,
        multipleOccurrencesSw: (multipleOccurrences ? 'Y' : 'N') as string,
        createdBy: createdByFinal,
        createdDate: createdDateFinal,
        modifiedBy: currentUser,
        modifiedDate: now,
        version: typeof versionVal === 'number' ? versionVal : 0
      };

      if (isUpdate) {
        await lookupApi.updateLookupExtension(apiData);
        showSuccess('Lookup extension updated successfully');
      } else {
        await lookupApi.createLookupExtension(apiData);
        showSuccess('Lookup extension created successfully');
      }

      // Success - call onSave callback if provided
      if (props.onSave) {
        props.onSave();
      }

      // Close and reset the dialog
      handleCloseAndReset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save lookup extension';
      setSaveError(errorMessage);
      showError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('Error saving lookup extension:', error);
    } finally {
      setSaving(false);
    }
  };
  const handleTabChange = (_: React.SyntheticEvent, newVal: number) => {
    // when navigating away from a tab, discard any *draft* rows that are still in edit mode
    if (tab === 0 && newVal !== 0) {
      // leaving Fields tab: cancel only drafts
      editingFieldIds.slice().forEach((id) => {
        const f = fields.find((r) => r.id === id);
        if (f?.draft) cancelEditField(id);
      });
    }
    if (tab === 1 && newVal !== 1) {
      // leaving Entries tab: cancel only drafts
      editingEntryIds.slice().forEach((id) => {
        const e = entries.find((r) => r.id === id);
        if (e?.draft) cancelEditEntry(id);
      });
    }
    setTab(newVal);
  };

  // Soft-add: create a draft in temp state and put it into edit mode
  const addField = () => {
    const id = `field-${nextFieldIndex}`;
    setNextFieldIndex((i) => i + 1);
    // append a draft row so it is visible in the table immediately
    setFields((s) => [...s, {id, draft: true, displayName: '', dataType: '', element: ''}]);
    setTempFields((p) => ({...p, [id]: {id, displayName: '', dataType: '', element: ''}}));
    setEditingFieldIds((s) => (s.includes(id) ? s : [...s, id]));
  };

  const addEntry = () => {
    const id = `row-${nextEntryIndex}`;
    setNextEntryIndex((i) => i + 1);
    setEntries((s) => [...s, {id, draft: true}]);
    setTempEntries((p) => ({...p, [id]: {id}}));
    setEditingEntryIds((s) => (s.includes(id) ? s : [...s, id]));
  };

  const updateField = (id: string, patch: Partial<FieldRow>) => {
    if (editingFieldIds.includes(id)) {
      setTempFields((prev) => {
        const base = prev[id] ?? fields.find((f) => f.id === id) ?? {id};
        return {...prev, [id]: {...base, ...patch}};
      });
    } else {
      setFields((s) => s.map((r) => (r.id === id ? {...r, ...patch} : r)));
    }
  };

  const updateEntry = (id: string, patch: Partial<EntryRow>) => {
    if (editingEntryIds.includes(id)) {
      setTempEntries((prev) => ({
        ...prev,
        [id]: {...(prev[id] ?? entries.find((e) => e.id === id) ?? {id}), ...patch}
      }));
    } else {
      setEntries((s) => s.map((r) => (r.id === id ? {...r, ...patch} : r)));
    }
  };

  const startEditField = (id: string) => {
    const existing = fields.find((f) => f.id === id);
    if (!existing) return;
    setTempFields((p) => ({...p, [id]: {...existing}}));
    setEditingFieldIds((s) => (s.includes(id) ? s : [...s, id]));
    // Clear errors when starting to edit
    setFieldElementErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = prev;
      return rest;
    });
    setFieldDisplayNameErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = prev;
      return rest;
    });
    setFieldLookupCodeErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = prev;
      return rest;
    });
  };

  /**
   * Validate field for duplicate element, displayName, and lookup code
   */
  const validateField = (id: string, fieldData: FieldRow): boolean => {
    let fieldIsValid = true;
    const errors: {element?: string; displayName?: string; lookupCode?: string} = {};

    // Check for duplicate element (excluding current row)
    const duplicateElement = fields.find(
      (f) => f.id !== id && f.element?.trim().toLowerCase() === fieldData.element?.trim().toLowerCase()
    );
    if (duplicateElement) {
      errors.element = 'This element value is already in use';
      fieldIsValid = false;
    }

    // Check for duplicate displayName (excluding current row)
    const duplicateDisplayName = fields.find(
      (f) => f.id !== id && f.displayName?.trim().toLowerCase() === fieldData.displayName?.trim().toLowerCase()
    );
    if (duplicateDisplayName) {
      errors.displayName = 'This display name is already in use';
      fieldIsValid = false;
    }

    // Check for duplicate lookup code (excluding current row)
    if (fieldData.lookupCode?.trim()) {
      const lookupCodeLower = fieldData.lookupCode.trim().toLowerCase();

      // Check against other fields
      const duplicateLookupCode = fields.find(
        (f) => f.id !== id && f.lookupCode?.trim().toLowerCase() === lookupCodeLower
      );

      // Check against top-level lookup code
      const matchesTopLevel = lookupCode?.trim().toLowerCase() === lookupCodeLower;

      if (duplicateLookupCode) {
        errors.lookupCode = 'This lookup code is already in use';
        fieldIsValid = false;
      } else if (matchesTopLevel) {
        errors.lookupCode = 'This lookup code matches the main lookup code';
        fieldIsValid = false;
      }
    }

    // Update error states
    if (errors.element) {
      setFieldElementErrors((prev) => ({...prev, [id]: errors.element || ''}));
    } else {
      setFieldElementErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[id]: _removed, ...rest} = prev;
        return rest;
      });
    }

    if (errors.displayName) {
      setFieldDisplayNameErrors((prev) => ({...prev, [id]: errors.displayName || ''}));
    } else {
      setFieldDisplayNameErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[id]: _removed, ...rest} = prev;
        return rest;
      });
    }

    if (errors.lookupCode) {
      setFieldLookupCodeErrors((prev) => ({...prev, [id]: errors.lookupCode || ''}));
    } else {
      setFieldLookupCodeErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[id]: _removed, ...rest} = prev;
        return rest;
      });
    }

    return fieldIsValid;
  };

  const saveEditField = (id: string) => {
    const edited = tempFields[id];
    if (!edited) return;

    // Validate before saving
    if (!validateField(id, edited)) {
      return; // Don't save if validation fails
    }

    // remove draft flag when persisting
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {draft: _draft, ...toSave} = edited as FieldRow & {draft?: boolean};
    setFields((s) => s.map((r) => (r.id === id ? {...r, ...toSave, draft: false} : r)));
    setTempFields((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = p;
      return rest;
    });
    setEditingFieldIds((s) => s.filter((x) => x !== id));

    // If this field has a lookup code, fetch the lookup values
    if (toSave.lookupCode?.trim()) {
      fetchLookupValues(toSave.lookupCode).catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch lookup values:', err);
      });
    }
  };
  const deleteField = (id: string) => {
    setFields((s) => s.filter((r) => r.id !== id));
    setTempFields((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = p;
      return rest;
    });
    setEditingFieldIds((s) => s.filter((x) => x !== id));
  };

  // Validate entry for duplicate lookup values
  const validateEntry = (id: string): boolean => {
    const entry = tempEntries[id];
    if (!entry?.lookupValue) {
      // Clear error if no value
      setEntryLookupValueErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[id]: _removed, ...rest} = prev;
        return rest;
      });
      return true;
    }

    const lookupValueLower = entry.lookupValue.toLowerCase().trim();

    // Check for duplicate lookup values in ALL entries (both saved and being edited)
    // For currently editing entries, check tempEntries; for others, check entries
    const allEntryValues = entries
      .map((e) => {
        if (e.id === id) return null; // Skip current entry
        // If this entry is being edited, use temp value; otherwise use saved value
        const value = editingEntryIds.includes(e.id) ? tempEntries[e.id]?.lookupValue : e.lookupValue;
        return value?.toLowerCase().trim();
      })
      .filter(Boolean);

    const duplicateLookupValue = allEntryValues.includes(lookupValueLower);

    if (duplicateLookupValue) {
      setEntryLookupValueErrors((prev) => ({
        ...prev,
        [id]: 'This value is already in use'
      }));
      return false;
    }

    // Clear error if no duplicate
    setEntryLookupValueErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = prev;
      return rest;
    });
    return true;
  };

  const startEditEntry = (id: string) => {
    const existing = entries.find((e) => e.id === id);
    if (!existing) return;

    // Clear any existing errors for this entry
    setEntryLookupValueErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = prev;
      return rest;
    });

    setTempEntries((p) => ({...p, [id]: {...existing}}));
    setEditingEntryIds((s) => (s.includes(id) ? s : [...s, id]));
  };
  const saveEditEntry = (id: string) => {
    const edited = tempEntries[id];
    if (!edited) return;

    // Validate before saving
    if (!validateEntry(id)) {
      return; // Don't save if validation fails
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {draft: _draft, ...toSave} = edited as EntryRow & {draft?: boolean};
    setEntries((s) => s.map((r) => (r.id === id ? {...r, ...toSave, draft: false} : r)));
    setTempEntries((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = p;
      return rest;
    });
    setEditingEntryIds((s) => s.filter((x) => x !== id));
  };
  const deleteEntry = (id: string) => {
    setEntries((s) => s.filter((r) => r.id !== id));
    setTempEntries((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[id]: _removed, ...rest} = p;
      return rest;
    });
    setEditingEntryIds((s) => s.filter((x) => x !== id));
  };

  const isFieldRowValid = (d: FieldRow) => Boolean(d?.element?.trim() && d.displayName?.trim() && d.dataType?.trim());
  const isEntryRowValid = (d: EntryRow) => {
    if (!d) return false;
    const lookupValueStr = typeof d.lookupValue === 'string' ? d.lookupValue : '';
    if (!lookupValueStr.trim()) return false;
    // ensure all required fields have values - check by displayName
    const requiredFields = fields.filter((f) => f.required);
    return requiredFields.every((rf) => {
      const fieldKey = rf.displayName || rf.id;
      const val = d.values?.[fieldKey];
      let valStr: string;
      if (typeof val === 'string') {
        valStr = val;
      } else if (val) {
        valStr = String(val);
      } else {
        valStr = '';
      }
      return valStr.trim() !== '';
    });
  };

  // Build extra dynamic columns for entries: any keys present on entry objects
  // (or their values map) other than 'lookupValue' and any existing field displayNames.
  const entryExtraColumns = React.useMemo(() => {
    const fieldDisplayNames = new Set(fields.map((f) => f.displayName || f.id));
    const keys = new Set<string>();
    entries.forEach((row) => {
      // Only inspect the entry's `values` object for extra keys.
      const values = (row.values ?? {}) as Record<string, unknown>;
      if (!values || typeof values !== 'object') return;
      Object.keys(values).forEach((k) => {
        if (k === 'lookupValue') return;
        if (fieldDisplayNames.has(k)) return; // already rendered as a dynamic field column
        keys.add(k);
      });
    });
    return Array.from(keys);
  }, [entries, fields]);

  // Also reset local state if the dialog becomes closed from the outside
  // (parent controlled `open` prop). This covers the case where the parent
  // toggles `open` to false without calling our local close handler.
  React.useEffect(() => {
    if (!open) resetLocalState();
  }, [open]);

  return (
    // Use PaperProps.sx to control the dialog width responsively. We set
    // maxWidth={false} so MUI's breakpoint sizing is disabled and we can
    // provide an explicit width with a responsive fallback for small screens.
    <Dialog
      open={open}
      onClose={handleCloseAndReset}
      maxWidth={false}
      PaperProps={{
        sx: {
          // 920px on md+ screens, but leave some page margin on small devices
          width: '70%'
        }
      }}
    >
      <DialogTitle sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography sx={{color: '#002677', fontWeight: 700, fontSize: '29px', lineHeight: '36px'}}>
          Add Lookup Extension
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{mb: 2}}>
          <Grid item xs={4}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
              <Typography component="label" sx={{fontSize: '16px', fontWeight: 700, color: 'text.primary'}}>
                Extension Code
                <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                  *
                </Typography>
              </Typography>

              <Tooltip title="The extension code is a unique identifier for this extension." arrow placement="right">
                <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
              </Tooltip>
            </Box>

            <TextField
              fullWidth
              value={extensionId}
              onChange={(e) => {
                // Requirement 7: Max length 30
                const newValue = e.target.value.slice(0, 30);
                setExtensionId(newValue);
                // Clear error when user types
                if (newValue?.trim()) {
                  setExtensionIdError('');
                }
              }}
              onBlur={() => {
                if (!extensionId?.trim()) {
                  setExtensionIdError('Extension code is required');
                }
              }}
              disabled={!!props.initialData}
              error={!!extensionIdError}
              helperText={extensionIdError || `${extensionId.length}/30 characters`}
              FormHelperTextProps={{
                sx: {minHeight: '20px', margin: '3px 14px 0'}
              }}
              inputProps={{maxLength: 30}} // Requirement 7
            />
          </Grid>
          <Grid item xs={4}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
              <Typography component="label" sx={{fontSize: '16px', fontWeight: 700, color: 'text.primary'}}>
                Name
                <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                  *
                </Typography>
              </Typography>

              <Tooltip title="The display name is the label shown to the user." arrow placement="right">
                <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
              </Tooltip>
            </Box>

            <TextField
              placeholder="Enter Display Name"
              fullWidth
              value={displayName}
              onChange={(e) => {
                // Requirement 7: Max length 50
                const newValue = e.target.value.slice(0, 50);
                setDisplayName(newValue);
                // Clear error when user types
                if (newValue?.trim()) {
                  setDisplayNameError('');
                }
              }}
              onBlur={() => {
                if (!displayName?.trim()) {
                  setDisplayNameError('Display name is required');
                }
              }}
              error={!!displayNameError}
              helperText={displayNameError || `${displayName.length}/50 characters`}
              FormHelperTextProps={{
                sx: {minHeight: '20px', margin: '3px 14px 0'}
              }}
              inputProps={{maxLength: 50}} // Requirement 7
            />
          </Grid>
          <Grid item xs={4}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
              <Typography component="label" sx={{fontSize: '16px', fontWeight: 700, color: 'text.primary'}}>
                Lookup Code
                <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                  *
                </Typography>
              </Typography>

              <Tooltip title="The lookup code is used to identify this extension." arrow placement="right">
                <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
              </Tooltip>
            </Box>
            {/* Autocomplete with search button to match original styling */}
            <Box sx={{display: 'flex', alignItems: 'stretch', gap: 0}}>
              <Autocomplete<DropdownOption, false, false, true>
                options={props.lookupCodeOptions || []}
                value={lookupCode ? {label: lookupCode, value: lookupCode} : null}
                onChange={(_, newValue) => {
                  const newLookupCode = typeof newValue === 'string' ? newValue : (newValue?.value ?? '');
                  setLookupCode(newLookupCode);
                  // Validate uniqueness
                  validateTopLevelLookupCode(newLookupCode);
                  // Fetch lookup values for the main lookup code
                  if (newLookupCode?.trim()) {
                    fetchMainLookupValues(newLookupCode).catch((err: unknown) => {
                      // eslint-disable-next-line no-console
                      console.error('Failed to fetch main lookup values:', err);
                    });
                  } else {
                    setMainLookupValueOptions([]);
                  }
                }}
                onInputChange={(_, newInputValue) => {
                  // Allow free text input
                  setLookupCode(newInputValue);
                  // Validate uniqueness
                  validateTopLevelLookupCode(newInputValue);
                  // Fetch lookup values when user types
                  if (newInputValue?.trim()) {
                    fetchMainLookupValues(newInputValue).catch((err: unknown) => {
                      // eslint-disable-next-line no-console
                      console.error('Failed to fetch main lookup values:', err);
                    });
                  } else {
                    setMainLookupValueOptions([]);
                  }
                }}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return option.label || option.value || '';
                }}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                freeSolo
                disabled={props.lookupsLoading || entries.filter((e) => !e.draft).length > 0 || !!props.initialData} // Requirement 2: Not editable when editing existing extension
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!lookupCodeError}
                    helperText={lookupCodeError || ' '}
                    FormHelperTextProps={{
                      sx: {minHeight: '20px', margin: '3px 14px 0'}
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {borderRadius: '4px 0 0 4px'}
                    }}
                  />
                )}
                sx={{
                  flex: 1,
                  '& .MuiAutocomplete-inputRoot': {
                    paddingRight: '9px !important'
                  }
                }}
              />
              <IconButton
                aria-label="search lookup"
                sx={{
                  height: '55px',
                  minWidth: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#002677',
                  color: '#FBF9F4',
                  borderRadius: '0 4px 4px 0',
                  '&:hover': {backgroundColor: '#0C55B8'}
                }}
              >
                <SearchIcon sx={{color: '#FBF9F4'}} />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center'}}>
              {/* Requirement 6: System Defined switch */}
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1, minWidth: 220}}>
                <Typography sx={{fontWeight: 500, fontSize: '16px'}}>System Defined</Typography>
                <Switch
                  sx={{
                    width: 36,
                    height: 20,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                      padding: 0,
                      margin: 0,
                      transitionDuration: '300ms',
                      '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#FFFFFF',
                          opacity: 1,
                          border: '2px solid #0C55B8'
                        },
                        '& .MuiSwitch-thumb': {
                          backgroundColor: '#0C55B8',
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: '10px 10px'
                          }
                        }
                      },
                      '&.Mui-disabled': {
                        '& .MuiSwitch-thumb': {
                          backgroundColor: '#B1B2B4'
                        },
                        '&.Mui-checked .MuiSwitch-thumb': {
                          backgroundColor: '#B1B2B4'
                        },
                        '& + .MuiSwitch-track': {
                          opacity: 1,
                          border: '2px solid #B1B2B4',
                          backgroundColor: '#FFFFFF'
                        }
                      }
                    },
                    '& .MuiSwitch-thumb': {
                      width: 20,
                      height: 20,
                      backgroundColor: '#757575',
                      boxShadow: 'none'
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 10,
                      border: '2px solid #757575',
                      backgroundColor: '#FFFFFF',
                      opacity: 1,
                      transition: 'background-color 300ms, border-color 300ms',
                      boxSizing: 'border-box'
                    }
                  }}
                  checked={systemDefined}
                  onChange={() => {
                    const newValue = !systemDefined;
                    setSystemDefined(newValue);
                    // Requirement 6: Reset User Mapping when System Defined is turned off
                    if (!newValue) {
                      setUserMapping(false);
                    }
                  }}
                />
                <Typography sx={{fontWeight: 400, fontSize: '16px', color: '#323334'}}>
                  {systemDefined ? 'Yes' : 'No'}
                </Typography>
              </Box>
              {/* Requirement 6: User Mapping only visible when System Defined is ON */}
              {systemDefined && (
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, minWidth: 220}}>
                  <Typography sx={{fontWeight: 500, fontSize: '16px'}}>User Mapping</Typography>
                  <Switch
                    sx={{
                      width: 36,
                      height: 20,
                      padding: 0,
                      '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: 0,
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFFFFF',
                            opacity: 1,
                            border: '2px solid #0C55B8'
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#0C55B8',
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              backgroundSize: '10px 10px'
                            }
                          }
                        },
                        '&.Mui-disabled': {
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '&.Mui-checked .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: '2px solid #B1B2B4',
                            backgroundColor: '#FFFFFF'
                          }
                        }
                      },
                      '& .MuiSwitch-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#757575',
                        boxShadow: 'none'
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10,
                        border: '2px solid #757575',
                        backgroundColor: '#FFFFFF',
                        opacity: 1,
                        transition: 'background-color 300ms, border-color 300ms',
                        boxSizing: 'border-box'
                      }
                    }}
                    checked={userMapping}
                    onChange={() => {
                      setUserMapping((v) => !v);
                    }}
                  />
                  <Typography sx={{fontWeight: 400, fontSize: '16px', color: '#323334'}}>
                    {userMapping ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              )}
              {/* Requirement 6: Multiple Occurrences switch */}
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1, minWidth: 220}}>
                <Typography sx={{fontWeight: 500, fontSize: '16px'}}>Multiple Occurrences</Typography>
                <Switch
                  sx={{
                    width: 36,
                    height: 20,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                      padding: 0,
                      margin: 0,
                      transitionDuration: '300ms',
                      '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#FFFFFF',
                          opacity: 1,
                          border: '2px solid #0C55B8'
                        },
                        '& .MuiSwitch-thumb': {
                          backgroundColor: '#0C55B8',
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: '10px 10px'
                          }
                        }
                      },
                      '&.Mui-disabled': {
                        '& .MuiSwitch-thumb': {
                          backgroundColor: '#B1B2B4'
                        },
                        '&.Mui-checked .MuiSwitch-thumb': {
                          backgroundColor: '#B1B2B4'
                        },
                        '& + .MuiSwitch-track': {
                          opacity: 1,
                          border: '2px solid #B1B2B4',
                          backgroundColor: '#FFFFFF'
                        }
                      }
                    },
                    '& .MuiSwitch-thumb': {
                      width: 20,
                      height: 20,
                      backgroundColor: '#757575',
                      boxShadow: 'none'
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 10,
                      border: '2px solid #757575',
                      backgroundColor: '#FFFFFF',
                      opacity: 1,
                      transition: 'background-color 300ms, border-color 300ms',
                      boxSizing: 'border-box'
                    }
                  }}
                  checked={multipleOccurrences}
                  onChange={() => {
                    setMultipleOccurrences((v) => !v);
                  }}
                />
                <Typography sx={{fontWeight: 400, fontSize: '16px', color: '#323334'}}>
                  {multipleOccurrences ? 'Yes' : 'No'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{mb: 2, '& .MuiTabs-indicator': {backgroundColor: '#FF612B', height: 3}}}
        >
          <Tab
            label="Fields"
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '18px',
              color: '#0C55B8',
              '&.Mui-selected': {color: '#002677'}
            }}
          />
          <Tab
            label="Entries"
            disabled={!lookupCode?.trim() || fields.filter((f) => !f.draft).length === 0} // Requirement 3: Disabled when no lookup code or no saved fields
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '18px',
              color: '#0C55B8',
              '&.Mui-selected': {color: '#002677'},
              '&.Mui-disabled': {color: '#B1B2B4', opacity: 0.6}
            }}
          />
        </Tabs>

        {tab === 0 && (
          <div>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
              <Typography sx={{mt: 1, fontSize: '14px', lineHeight: '14px', fontWeight: 700}}>
                Number of fields:&nbsp;
                <Typography component="span" sx={{fontSize: '14px', lineHeight: '14px', fontWeight: 400}}>
                  {fields.length}
                </Typography>
              </Typography>
              <Button
                sx={{
                  borderRadius: '46px',
                  backgroundColor: '#002677',
                  color: '#FBF9F4',
                  fontWeight: 700,
                  fontSize: '16px'
                }}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addField}
                disabled={entries.length > 0}
              >
                Add Field
              </Button>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>
                    Field Name&nbsp;
                    <Typography component="span" sx={{color: '#D32F2F'}}>
                      *
                    </Typography>
                  </TableCell>
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>
                    Element&nbsp;
                    <Typography component="span" sx={{color: '#D32F2F'}}>
                      *
                    </Typography>
                  </TableCell>
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>
                    Data Type&nbsp;
                    <Typography component="span" sx={{color: '#D32F2F'}}>
                      *
                    </Typography>
                  </TableCell>
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>Lookup Code</TableCell>
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>Required</TableCell>
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((row) => {
                  const isEditing = editingFieldIds.includes(row.id);
                  const data = isEditing ? (tempFields[row.id] ?? row) : row;
                  return (
                    <TableRow key={row.id}>
                      <TableCell sx={{verticalAlign: 'top'}}>
                        <TextField
                          fullWidth
                          placeholder="Enter display name"
                          value={data.displayName ?? ''}
                          onChange={(e) => {
                            updateField(row.id, {displayName: e.target.value});
                          }}
                          disabled={!isEditing}
                          error={!!fieldDisplayNameErrors[row.id]}
                          helperText={fieldDisplayNameErrors[row.id] || ' '}
                          FormHelperTextProps={{
                            sx: {minHeight: '20px', margin: '3px 14px 0'}
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{verticalAlign: 'top'}}>
                        <TextField
                          fullWidth
                          placeholder="Enter element"
                          value={data.element ?? ''}
                          onChange={(e) => {
                            updateField(row.id, {element: e.target.value});
                          }}
                          disabled={!isEditing}
                          error={!!fieldElementErrors[row.id]}
                          helperText={fieldElementErrors[row.id] || ' '}
                          FormHelperTextProps={{
                            sx: {minHeight: '20px', margin: '3px 14px 0'}
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{verticalAlign: 'top'}}>
                        <div>
                          <Select
                            fullWidth
                            value={data.dataType ?? ''}
                            onChange={(e) => {
                              updateField(row.id, {dataType: e.target.value});
                            }}
                            disabled={!isEditing}
                          >
                            <MenuItem value="">Select data type</MenuItem>
                            {props.dataTypeOptions && props.dataTypeOptions.length > 0 ? (
                              props.dataTypeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))
                            ) : (
                              <>
                                <MenuItem value="lookup">Lookup</MenuItem>
                                <MenuItem value="amt">Amount (AMT)</MenuItem>
                                <MenuItem value="bps">Basis Point (BPS)</MenuItem>
                                <MenuItem value="dte">Date (DTE)</MenuItem>
                              </>
                            )}
                          </Select>
                          <Box sx={{minHeight: '20px', margin: '3px 14px 0'}} />
                        </div>
                      </TableCell>
                      <TableCell sx={{verticalAlign: 'top'}}>
                        {/* Lookup code with Autocomplete dropdown */}
                        <Autocomplete<DropdownOption, false, false, true>
                          options={props.lookupCodeOptions || []}
                          value={data.lookupCode ? {label: data.lookupCode, value: data.lookupCode} : null}
                          onChange={(_, newValue) => {
                            updateField(row.id, {
                              lookupCode: typeof newValue === 'string' ? newValue : (newValue?.value ?? '')
                            });
                          }}
                          onInputChange={(_, newInputValue) => {
                            // Allow free text input
                            updateField(row.id, {lookupCode: newInputValue});
                          }}
                          getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return option.label || option.value || '';
                          }}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          freeSolo
                          disabled={!isEditing}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select or enter lookup code"
                              error={!!fieldLookupCodeErrors[row.id]}
                              helperText={fieldLookupCodeErrors[row.id] || ' '}
                              FormHelperTextProps={{
                                sx: {minHeight: '20px', margin: '3px 14px 0'}
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  paddingRight: '9px !important'
                                }
                              }}
                            />
                          )}
                          sx={{
                            '& .MuiAutocomplete-inputRoot': {
                              paddingRight: '9px !important'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{verticalAlign: 'top'}}>
                        <div>
                          <Checkbox
                            checked={!!data.required}
                            onChange={(e) => {
                              updateField(row.id, {required: e.target.checked});
                            }}
                            disabled={!isEditing}
                          />
                          <Box sx={{minHeight: '20px', margin: '3px 14px 0'}} />
                        </div>
                      </TableCell>
                      <TableCell sx={{verticalAlign: 'top'}}>
                        <Box sx={{paddingTop: '8px'}}>
                          {isEditing ? (
                            <>
                              <IconButton
                                onClick={() => {
                                  saveEditField(row.id);
                                }}
                                size="small"
                                disabled={!isFieldRowValid(data)}
                                sx={!isFieldRowValid(data) ? undefined : {color: '#0C55B8'}}
                              >
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  cancelEditField(row.id);
                                }}
                                size="small"
                                sx={{color: '#0C55B8'}}
                              >
                                <ClearIcon />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                onClick={() => {
                                  startEditField(row.id);
                                }}
                                size="small"
                                sx={{color: '#0C55B8'}}
                                disabled={entries.length > 0}
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  deleteField(row.id);
                                }}
                                size="small"
                                sx={{color: '#0C55B8'}}
                                disabled={entries.length > 0}
                              >
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {tab === 1 && (
          <div>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
              <Typography sx={{mt: 1, fontSize: '14px', lineHeight: '14px', fontWeight: 700}}>
                Number of entries:&nbsp;
                <Typography component="span" sx={{fontSize: '14px', lineHeight: '14px', fontWeight: 400}}>
                  {entries.length}
                </Typography>
              </Typography>
              <Button
                sx={{
                  borderRadius: '46px',
                  backgroundColor: '#002677',
                  color: '#FBF9F4',
                  fontWeight: 700,
                  fontSize: '16px'
                }}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addEntry}
                disabled={fields.length === 0 || !lookupCode}
              >
                Add Entry
              </Button>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>
                    Lookup Value&nbsp;
                    <Typography component="span" sx={{color: '#D32F2F'}}>
                      *
                    </Typography>
                  </TableCell>
                  {fields.map((f) => (
                    <TableCell key={f.id} sx={{fontSize: '14px', fontWeight: 700}}>
                      {f.displayName ?? f.element ?? f.id}
                      {f.required ? (
                        <Typography component="span" sx={{color: '#D32F2F'}}>
                          {' '}
                          *
                        </Typography>
                      ) : null}
                    </TableCell>
                  ))}
                  {entryExtraColumns.map((col) => (
                    <TableCell key={col} sx={{fontSize: '14px', fontWeight: 700}}>
                      {col}
                    </TableCell>
                  ))}
                  <TableCell sx={{fontSize: '14px', fontWeight: 700}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((row) => {
                  const isEditing = editingEntryIds.includes(row.id);
                  const data = isEditing ? (tempEntries[row.id] ?? row) : row;
                  return (
                    <TableRow key={row.id}>
                      <TableCell sx={{verticalAlign: 'top'}}>
                        {/* Lookup Value with Autocomplete dropdown based on main lookup code */}
                        {mainLookupValueOptions.length > 0 ? (
                          <Autocomplete<DropdownOption, false, false, true>
                            options={mainLookupValueOptions}
                            value={
                              data.lookupValue
                                ? mainLookupValueOptions.find((opt) => opt.value === data.lookupValue) || {
                                    label: typeof data.lookupValue === 'string' ? data.lookupValue : '',
                                    value: typeof data.lookupValue === 'string' ? data.lookupValue : ''
                                  }
                                : null
                            }
                            onChange={(_, newValue) => {
                              if (!isEditing) return;
                              updateEntry(row.id, {
                                lookupValue: typeof newValue === 'string' ? newValue : (newValue?.value ?? '')
                              });
                            }}
                            onInputChange={(_, newInputValue) => {
                              // Allow free text input
                              if (!isEditing) return;
                              updateEntry(row.id, {lookupValue: newInputValue});
                            }}
                            getOptionLabel={(option) => {
                              if (typeof option === 'string') return option;
                              return option.label || option.value || '';
                            }}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            freeSolo
                            disabled={!isEditing}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select or enter value"
                                error={!!entryLookupValueErrors[row.id]}
                                helperText={entryLookupValueErrors[row.id] || ' '}
                                FormHelperTextProps={{
                                  sx: {minHeight: '20px', margin: '3px 14px 0'}
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    paddingRight: '9px !important'
                                  }
                                }}
                              />
                            )}
                            sx={{
                              '& .MuiAutocomplete-inputRoot': {
                                paddingRight: '9px !important'
                              }
                            }}
                          />
                        ) : (
                          <TextField
                            fullWidth
                            value={data.lookupValue ?? ''}
                            onChange={(e) => {
                              updateEntry(row.id, {lookupValue: e.target.value});
                            }}
                            disabled={!isEditing}
                            error={!!entryLookupValueErrors[row.id]}
                            helperText={entryLookupValueErrors[row.id] || ' '}
                            FormHelperTextProps={{
                              sx: {minHeight: '20px', margin: '3px 14px 0'}
                            }}
                          />
                        )}
                      </TableCell>
                      {fields.map((f) => {
                        const fieldKey = f.displayName || f.id;
                        const cellValue = isEditing
                          ? (tempEntries[row.id]?.values?.[fieldKey] ?? '')
                          : (row.values?.[fieldKey] ?? '');

                        // Check if this field has a lookup code - if so, render dropdown
                        const hasLookupCode = f.lookupCode?.trim();
                        const lookupOptions: DropdownOption[] =
                          hasLookupCode && f.lookupCode ? lookupValueOptions[f.lookupCode] || [] : [];

                        return (
                          <TableCell key={f.id} sx={{verticalAlign: 'top'}}>
                            {hasLookupCode ? (
                              // Render Multi-Select Autocomplete dropdown for fields with lookup code
                              <Autocomplete<DropdownOption, true, false, true>
                                multiple
                                options={lookupOptions}
                                value={
                                  cellValue
                                    ? (Array.isArray(cellValue)
                                        ? cellValue
                                        : (typeof cellValue === 'string' ? cellValue : '').split(',')
                                      )
                                        .map((val) => {
                                          const valStr = typeof val === 'string' ? val : String(val);
                                          return valStr.trim();
                                        })
                                        .filter((val) => val)
                                        .map(
                                          (val) =>
                                            lookupOptions.find((opt: DropdownOption) => opt.value === val) || {
                                              label: val,
                                              value: val
                                            }
                                        )
                                    : []
                                }
                                onChange={(_, newValue) => {
                                  if (!isEditing) return;
                                  const entryFieldKey = f.displayName || f.id;
                                  const current = tempEntries[row.id]?.values ?? row.values ?? {};
                                  const valueStr = newValue
                                    .map((v) => (typeof v === 'string' ? v : (v?.value ?? '')))
                                    .filter((v) => v)
                                    .join(',');
                                  updateEntry(row.id, {
                                    values: {...current, [entryFieldKey]: valueStr}
                                  });
                                }}
                                getOptionLabel={(option) => {
                                  if (typeof option === 'string') return option;
                                  return option.label || option.value || '';
                                }}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                freeSolo
                                disabled={!isEditing}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select or enter values"
                                    helperText=" "
                                    FormHelperTextProps={{
                                      sx: {minHeight: '20px', margin: '3px 14px 0'}
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        paddingRight: '9px !important'
                                      }
                                    }}
                                  />
                                )}
                                sx={{
                                  '& .MuiAutocomplete-inputRoot': {
                                    paddingRight: '9px !important'
                                  }
                                }}
                              />
                            ) : (
                              // Render based on dataType when no lookup code
                              (() => {
                                const dataType = f.dataType?.toLowerCase();
                                const isNumber = dataType === 'nbr';
                                const isDate = dataType === 'dte';

                                if (isDate) {
                                  // Render DatePicker for Date type
                                  const dateValue = cellValue
                                    ? parse(typeof cellValue === 'string' ? cellValue : '', 'yyyy-MM-dd', new Date())
                                    : null;
                                  return (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        value={dateValue && isValid(dateValue) ? dateValue : null}
                                        onChange={(newValue) => {
                                          if (!isEditing) return;
                                          const dateFieldKey = f.displayName || f.id;
                                          const current = tempEntries[row.id]?.values ?? row.values ?? {};
                                          // Convert Dayjs to Date before formatting
                                          let dateToFormat: Date | null;
                                          if (newValue instanceof Date) {
                                            dateToFormat = newValue;
                                          } else if (newValue) {
                                            dateToFormat = new Date(newValue.toString());
                                          } else {
                                            dateToFormat = null;
                                          }
                                          updateEntry(row.id, {
                                            values: {
                                              ...current,
                                              [dateFieldKey]:
                                                dateToFormat && isValid(dateToFormat)
                                                  ? format(dateToFormat, 'yyyy-MM-dd')
                                                  : ''
                                            }
                                          });
                                        }}
                                        disabled={!isEditing}
                                        slotProps={{
                                          textField: {
                                            fullWidth: true,
                                            helperText: ' ',
                                            FormHelperTextProps: {
                                              sx: {minHeight: '20px', margin: '3px 14px 0'}
                                            }
                                          }
                                        }}
                                      />
                                    </LocalizationProvider>
                                  );
                                } else if (isNumber) {
                                  // Render Number TextField with 2 decimal validation
                                  return (
                                    <TextField
                                      fullWidth
                                      type="number"
                                      value={cellValue}
                                      onChange={(e) => {
                                        if (!isEditing) return;
                                        const {value} = e.target;
                                        // Validate number with up to 2 decimals
                                        if (value && !/^-?\d*\.?\d{0,2}$/.test(value)) {
                                          return; // Don't update if invalid format
                                        }
                                        const numberFieldKey = f.displayName || f.id;
                                        const current = tempEntries[row.id]?.values ?? row.values ?? {};
                                        updateEntry(row.id, {
                                          values: {...current, [numberFieldKey]: value}
                                        });
                                      }}
                                      disabled={!isEditing}
                                      helperText=" "
                                      FormHelperTextProps={{
                                        sx: {minHeight: '20px', margin: '3px 14px 0'}
                                      }}
                                      inputProps={{
                                        step: '0.01'
                                      }}
                                    />
                                  );
                                } else if (dataType === 'jsn') {
                                  // Render JSON editor icon for JSN type
                                  let jsonValue: object | null = null;
                                  try {
                                    jsonValue =
                                      cellValue && typeof cellValue === 'string' ? JSON.parse(cellValue) : cellValue;
                                  } catch {
                                    jsonValue = null;
                                  }
                                  return (
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px'
                                      }}
                                    >
                                      <Tooltip title="Edit JSON" arrow>
                                        <span>
                                          <IconButton
                                            onClick={() => {
                                              setJsonEditorData({
                                                rowId: row.id,
                                                fieldKey: f.displayName || f.id,
                                                value: jsonValue
                                              });
                                              setJsonEditorOpen(true);
                                            }}
                                            disabled={!isEditing}
                                            size="large"
                                            sx={{
                                              color: isEditing ? '#002677' : '#999',
                                              '&:hover': {
                                                backgroundColor: 'rgba(0, 38, 119, 0.08)'
                                              }
                                            }}
                                          >
                                            <CodeIcon fontSize="large" />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                    </Box>
                                  );
                                } else {
                                  // Render regular TextField for text type
                                  return (
                                    <TextField
                                      fullWidth
                                      value={cellValue}
                                      onChange={(e) => {
                                        if (!isEditing) return;
                                        const textFieldKey = f.displayName || f.id;
                                        const current = tempEntries[row.id]?.values ?? row.values ?? {};
                                        updateEntry(row.id, {
                                          values: {...current, [textFieldKey]: e.target.value}
                                        });
                                      }}
                                      disabled={!isEditing}
                                      helperText=" "
                                      FormHelperTextProps={{
                                        sx: {minHeight: '20px', margin: '3px 14px 0'}
                                      }}
                                    />
                                  );
                                }
                              })()
                            )}
                          </TableCell>
                        );
                      })}

                      {entryExtraColumns.map((col) => {
                        const cellValue = isEditing
                          ? (tempEntries[row.id]?.values?.[col] ?? '')
                          : (row.values?.[col] ?? '');
                        let displayValue: string;
                        if (typeof cellValue === 'string') {
                          displayValue = cellValue;
                        } else if (cellValue) {
                          displayValue = String(cellValue);
                        } else {
                          displayValue = '';
                        }
                        return (
                          <TableCell key={col} sx={{verticalAlign: 'top'}}>
                            <TextField
                              fullWidth
                              value={displayValue}
                              onChange={(e) => {
                                if (!isEditing) return;
                                const current = tempEntries[row.id]?.values ?? row.values ?? {};
                                updateEntry(row.id, {
                                  values: {...current, [col]: e.target.value}
                                });
                              }}
                              disabled={!isEditing}
                              helperText=" "
                              FormHelperTextProps={{
                                sx: {minHeight: '20px', margin: '3px 14px 0'}
                              }}
                            />
                          </TableCell>
                        );
                      })}
                      <TableCell sx={{verticalAlign: 'top'}}>
                        <Box sx={{paddingTop: '8px'}}>
                          {isEditing ? (
                            <>
                              <IconButton
                                onClick={() => {
                                  saveEditEntry(row.id);
                                }}
                                size="small"
                                disabled={!isEntryRowValid(data)}
                                sx={!isEntryRowValid(data) ? undefined : {color: '#0C55B8'}}
                              >
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  cancelEditEntry(row.id);
                                }}
                                size="small"
                                sx={{color: '#0C55B8'}}
                              >
                                <ClearIcon />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                onClick={() => {
                                  startEditEntry(row.id);
                                }}
                                size="small"
                                sx={{color: '#0C55B8'}}
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  deleteEntry(row.id);
                                }}
                                size="small"
                                sx={{color: '#0C55B8'}}
                              >
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
      <DialogActions
        sx={{p: 2, justifyContent: 'flex-end', gap: 1}}
      >
        {saveError && <Typography sx={{color: '#D32F2F', fontSize: '14px', mr: 'auto'}}>{saveError}</Typography>}
        <Button
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#323334',
            borderRadius: '46px',
            border: '1px solid #323334'
          }}
          onClick={handleClose}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          sx={{backgroundColor: '#002677', fontSize: '16px', fontWeight: 700, color: '#FBF9F4', borderRadius: '46px'}}
          variant="contained"
          onClick={handleSave}
          disabled={
            saving ||
            !extensionId?.trim() ||
            !displayName?.trim() ||
            !lookupCode?.trim() ||
            !!extensionIdError ||
            !!displayNameError ||
            !!lookupCodeError ||
            Object.keys(fieldElementErrors).length > 0 ||
            Object.keys(fieldDisplayNameErrors).length > 0 ||
            Object.keys(fieldLookupCodeErrors).length > 0 ||
            Object.keys(entryLookupValueErrors).length > 0 ||
            fields.filter((f) => !f.draft).length === 0 // Requirement 5: Disable if no saved fields
          }
          startIcon={saving ? <CircularProgress size={20} sx={{color: '#FBF9F4'}} /> : null}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>

      {/* JSON Config Editor Dialog */}
      <JsonConfigEditor
        open={jsonEditorOpen}
        value={jsonEditorData.value}
        onChange={(newValue) => {
          // Update the entry value with the new JSON
          const {rowId, fieldKey} = jsonEditorData;
          const current = tempEntries[rowId]?.values ?? entries.find((e) => e.id === rowId)?.values ?? {};
          updateEntry(rowId, {
            values: {...current, [fieldKey]: JSON.stringify(newValue)}
          });
        }}
        onClose={() => {
          setJsonEditorOpen(false);
        }}
        title="Edit JSON Value"
      />
    </Dialog>
  );
}

export default LookupExtensionDialog;
