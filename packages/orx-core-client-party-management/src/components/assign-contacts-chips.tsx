import React, {useState} from 'react';
import {Box, Typography, Chip, FormControl, Select, MenuItem, InputLabel, ListSubheader, Checkbox} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {Controller} from 'react-hook-form';
import type {Control} from 'react-hook-form';

import {AddClientCombinedFormData} from '../stepper/schemas';

// Contact option interface for dropdown
interface ContactOption {
  value: string;
  label: string;
}

interface AssignContactsChipsProps {
  control: Control<AddClientCombinedFormData>;
  operationalUnitIndex: number;
  availableContacts: ContactOption[];
}

/**
 * AssignContactsChips Component
 *
 * Displays a dropdown for selecting contacts and shows selected contacts as removable chips.
 * Requirements: 2.10-2.13, 9.7
 *
 * - Light blue card background (#FAFCFF) with 12px border radius
 * - Dropdown for selecting contacts
 * - Display selected contacts as chips with X icon
 * - Click X icon removes contact from selection
 */
export const AssignContactsChips: React.FC<AssignContactsChipsProps> = ({
  control,
  operationalUnitIndex,
  availableContacts
}) => {
  // Watch the current assigned contacts for display purposes
  // Note: The actual value is managed by the Controller below

  // (removed unused assignedContacts variable)

  // Local state for multi-select dialog
  const [selectOpen, setSelectOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string[]>([]);

  // Get label for a contact value
  const getContactLabel = (value: string): string => {
    const contact = availableContacts.find((c) => c.value === value);
    return contact?.label || value;
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FAFCFF',
        border: '1px solid #CBCCCD',
        borderRadius: '12px',
        padding: '16px 24px',
        mt: 3
      }}
    >
      <Controller
        name={`operationalUnits.${operationalUnitIndex}.assignedContacts`}
        control={control}
        render={({field}) => {
          // Handle removing a contact chip (Requirement 2.13)
          const handleRemoveContact = (contactValue: string) => {
            field.onChange((field.value || []).filter((v: string) => v !== contactValue));
          };

          // Multi-select dropdown logic
          const handleOpen = () => {
            setPendingSelection(field.value || []);
            setSelectOpen(true);
          };
          const handleClose = () => {
            setSelectOpen(false);
          };
          // Remove onChange from Select, handle selection via MenuItem click
          const handleToggle = (contactValue: string) => {
            setPendingSelection((prev) =>
              prev.includes(contactValue) ? prev.filter((v) => v !== contactValue) : [...prev, contactValue]
            );
          };
          const handleSave = () => {
            field.onChange(pendingSelection);
            setSelectOpen(false);
          };
          const handleCancel = () => {
            setSelectOpen(false);
          };

          return (
            <>
              {/* Multi-select dropdown for contacts */}
              <FormControl fullWidth size="small" sx={{mt: 3}}>
                <InputLabel
                  id={`assign-contacts-label-${operationalUnitIndex}`}
                  sx={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#323334',
                    transform: 'translate(0, -24px)',
                    '&.Mui-focused': {
                      color: '#323334'
                    },
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(0, -24px)'
                    }
                  }}
                  shrink
                >
                  Assign Contacts
                </InputLabel>
                <Select
                  labelId={`assign-contacts-label-${operationalUnitIndex}`}
                  multiple
                  open={selectOpen}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  value={pendingSelection}
                  // Remove onChange, handle selection via MenuItem click
                  onChange={() => {
                    /* noop: handled by MenuItem click */
                  }}
                  displayEmpty
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    mt: 1,
                    minHeight: '40px',
                    width: '392px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #4B4D4F',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 14px',
                      fontSize: '16px',
                      color: pendingSelection.length === 0 ? '#6B6C6F' : '#323334'
                    },
                    '& .MuiSelect-icon': {
                      color: '#323334',
                      right: '12px'
                    }
                  }}
                  renderValue={() => {
                    let count = 0;
                    if (selectOpen) {
                      count = pendingSelection.length;
                    } else if (field.value) {
                      count = field.value.length;
                    }
                    let text = '';
                    if (count === 0) {
                      text = 'Select contacts';
                    } else {
                      text = `${count} selected`;
                    }
                    return (
                      <Typography
                        sx={{
                          fontSize: '16px',
                          color: count === 0 ? '#6B6C6F' : '#323334'
                        }}
                      >
                        {text}
                      </Typography>
                    );
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {maxHeight: 340, width: 392}
                    }
                  }}
                >
                  {availableContacts.length === 0 ? (
                    <MenuItem disabled value="">
                      <Typography sx={{color: '#6B6C6F', fontSize: '14px'}}>No contacts available</Typography>
                    </MenuItem>
                  ) : (
                    <>
                      {availableContacts.map((contact) => (
                        <MenuItem
                          key={contact.value}
                          value={contact.value}
                          sx={{
                            backgroundColor: pendingSelection.includes(contact.value) ? '#F0F7FF' : 'inherit',
                            '&.Mui-selected': {
                              backgroundColor: '#F0F7FF !important'
                            }
                          }}
                          onClick={() => {
                            handleToggle(contact.value);
                          }}
                        >
                          <Checkbox
                            checked={pendingSelection.includes(contact.value)}
                            sx={{mr: 1, p: 0.5}}
                            tabIndex={-1}
                            disableRipple
                          />
                          {contact.label}
                        </MenuItem>
                      ))}
                      {/* Save/Cancel buttons as ListSubheader at the bottom */}
                      <ListSubheader
                        disableSticky
                        sx={{borderTop: '1px solid #eee', mt: 1, background: '#fff', zIndex: 1}}
                      >
                        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, pt: 1}}>
                          <button
                            type="button"
                            onClick={handleSave}
                            style={{
                              backgroundColor: '#002677',
                              borderRadius: '46px',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 24px',
                              fontWeight: 700,
                              fontSize: 16,
                              cursor: 'pointer'
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            style={{
                              background: '#fff',
                              color: '#0C55B8',
                              border: '1px solid #0C55B8',
                              borderRadius: '46px',
                              padding: '8px 24px',
                              fontWeight: 700,
                              fontSize: 16,
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </Box>
                      </ListSubheader>
                    </>
                  )}
                </Select>
              </FormControl>

              {/* Display selected contacts as chips (Requirements 2.11, 2.12) */}
              {field.value && field.value.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    mt: 2
                  }}
                >
                  {field.value.map((contactValue: string) => (
                    <Chip
                      key={contactValue}
                      label={getContactLabel(contactValue)}
                      onDelete={() => {
                        handleRemoveContact(contactValue);
                      }}
                      deleteIcon={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#0C55B8',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#0A4A9E'
                            }
                          }}
                        >
                          <CloseIcon
                            sx={{
                              fontSize: '14px !important',
                              color: '#FFFFFF !important'
                            }}
                          />
                        </Box>
                      }
                      sx={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0C55B8',
                        borderRadius: '6px',
                        height: '32px',
                        '& .MuiChip-label': {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0C55B8',
                          padding: '0 8px 0 12px'
                        },
                        '& .MuiChip-deleteIcon': {
                          margin: '0 8px 0 0'
                        },
                        '&:hover': {
                          backgroundColor: '#F0F7FF'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </>
          );
        }}
      />
    </Box>
  );
};

export default AssignContactsChips;
