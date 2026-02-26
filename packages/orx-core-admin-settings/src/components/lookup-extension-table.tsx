import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Box,
  Skeleton,
  Tooltip,
  Paper
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';

import {EmptyState} from './empty-state';

export interface TableColumn {
  id: string;
  label: string;
  width?: number;
  tooltip?: string;
}

export interface LookupExtensionTableRow {
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
  version: number;
  objectCode: string;
  name: string;
  field: string;
  json: any;
  systemDefined: string;
  userMapping: string;
  multipleOccurrences: string;
}

export interface LookupExtensionTableProps {
  data?: LookupExtensionTableRow[];
  isLoading?: boolean;
  onAdd?: () => void; // legacy / convenience
  onAddLookup?: () => void; // used by overview card
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  // optional selection handlers (to mirror LookupTable)
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  columns?: TableColumn[];
}

const columns = [
  {id: 'checkbox', label: '', width: 48},
  {id: 'actions', label: 'Actions', width: 100},
  {
    id: 'lookupField',
    label: 'Lookup field (identifier)',
    width: 250,
    tooltip: 'This is a system identifier which is hidden from end users and cannot be altered once created.'
  },
  {id: 'displayName', label: 'Display Name', width: 250},
  {
    id: 'managedBy',
    label: 'Managed By',
    width: 180,
    tooltip:
      "System-managed fields can't be deleted with limited editing capabilities, while user-managed fields are more flexible."
  },
  {id: 'fieldsCount', label: 'Fields', width: 120},
  {id: 'entriesCount', label: 'Entries', width: 120}
];

const LookupExtensionTable: React.FC<LookupExtensionTableProps> = ({
  data = [],
  isLoading = false,
  onAdd,
  onAddLookup,
  onEdit,
  onDelete,
  selectedIds: selectedIdsProp,
  onSelectionChange,
  columns: columnsProp
}) => {
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>([]);

  // The table no longer performs local filtering; the page/hook/service layer
  // is responsible for delivering the correct page and filtered data.
  const rows = data;

  const cols = columnsProp ?? columns;

  const selectedIds = selectedIdsProp ?? internalSelectedIds;
  const isAllSelected = rows.length > 0 && selectedIds.length === rows.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < rows.length;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ids = event.target.checked ? rows.map((r) => r.objectCode) : [];
    if (typeof onSelectionChange === 'function') onSelectionChange(ids);
    else setInternalSelectedIds(ids);
  };

  const handleSelectOne = (id: string) => {
    const next = selectedIds.includes(id) ? selectedIds.filter((p) => p !== id) : [...selectedIds, id];
    if (typeof onSelectionChange === 'function') onSelectionChange(next);
    else setInternalSelectedIds(next);
  };

  // loading skeleton
  if (isLoading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#323334',
                    borderBottom: '1px solid #CBCCCD',
                    width: column.width
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({length: 5}, (_, i) => `skeleton-${i}`).map((key) => (
              <TableRow key={key}>
                {columns.map((c) => (
                  <TableCell key={c.id}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            {/* Checkbox header */}
            <TableCell padding="checkbox" sx={{width: cols[0]?.width, borderBottom: '1px solid #CBCCCD'}}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
                sx={{
                  color: '#002677',
                  '&.Mui-checked': {color: '#002677'},
                  '&.MuiCheckbox-indeterminate': {color: '#002677'}
                }}
              />
            </TableCell>

            {/* Actions header */}
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: '14px',
                color: '#323334',
                borderBottom: '1px solid #CBCCCD',
                width: cols[1]?.width
              }}
            >
              {cols[1]?.label}
            </TableCell>

            {cols.slice(2).map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#323334',
                  borderBottom: '1px solid #CBCCCD',
                  width: column.width
                }}
              >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                  {column.label}
                  {(column.id === 'objectCode' || column.id === 'managedBy') && (
                    <Tooltip title={String(column.tooltip)} arrow>
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={cols.length} sx={{borderBottom: 'none', padding: 0}}>
                <EmptyState
                  title="No lookup extensions found"
                  actionText="adding a new lookup extension"
                  onAction={onAddLookup ?? onAdd}
                />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item) => {
              const isSelected = selectedIds.includes(item.objectCode);
              return (
                <TableRow
                  key={item.objectCode}
                  hover
                  selected={isSelected}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {backgroundColor: '#F5F5F5'},
                    '&.Mui-selected': {backgroundColor: '#E3F2FD', '&:hover': {backgroundColor: '#BBDEFB'}}
                  }}
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOne(item.objectCode);
                    }}
                    sx={{borderBottom: '1px solid #CBCCCD'}}
                  >
                    <Checkbox checked={isSelected} sx={{color: '#002677', '&.Mui-checked': {color: '#002677'}}} />
                  </TableCell>

                  <TableCell sx={{borderBottom: '1px solid #CBCCCD'}}>
                    <Box sx={{display: 'flex', gap: 0.5}}>
                      <Tooltip title="Delete" arrow>
                        <span>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(item.objectCode);
                            }}
                            disabled={item.systemDefined === 'Y'}
                            sx={{
                              color: '#0C55B8 !important',
                              opacity: item.systemDefined === 'Y' ? 0.5 : 1,
                              cursor: item.systemDefined === 'Y' ? 'not-allowed' : 'pointer',
                              '&:hover': {
                                backgroundColor: item.systemDefined === 'Y' ? 'transparent' : 'rgba(12, 85, 184, 0.04)'
                              }
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(item);
                          }}
                          sx={{color: '#0C55B8', '&:hover': {backgroundColor: 'rgba(12, 85, 184, 0.04)'}}}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#4B4D4F',
                      borderBottom: '1px solid #CBCCCD',
                      cursor: 'pointer',
                      fontWeight: 400,
                      '&:hover': {textDecoration: 'underline'}
                    }}
                  >
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      {item.objectCode}
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '24px',
                          height: '24px',
                          padding: '0 6px',
                          borderRadius: '4px',
                          backgroundColor: '#FCF0F0',
                          color: '#323334',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        {(item.json as {entries?: unknown[]})?.entries?.length ?? 0}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{fontSize: '14px', color: '#323334', borderBottom: '1px solid #CBCCCD'}}>
                    {item.name}
                  </TableCell>

                  <TableCell sx={{fontSize: '14px', color: '#323334', borderBottom: '1px solid #CBCCCD'}}>
                    {item.field}
                  </TableCell>

                  <TableCell sx={{fontSize: '14px', borderBottom: '1px solid #CBCCCD'}}>
                    <Box sx={{display: 'flex', gap: 0.5, flexWrap: 'wrap'}}>
                      {/* Show System badge if systemDefined is 'Y' */}
                      {item.systemDefined === 'Y' && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#FEF9EA',
                            color: '#826100',
                            fontSize: '12px',
                            fontWeight: 600,
                            lineHeight: 1
                          }}
                        >
                          <ComputerIcon sx={{fontSize: '16px', color: '#826100', display: 'flex'}} />
                          <Box component="span" sx={{lineHeight: '16px'}}>
                            System
                          </Box>
                        </Box>
                      )}
                      {/* Show User badge if userMapping is 'Y' OR systemDefined is 'N' */}
                      {(item.userMapping === 'Y' || item.systemDefined === 'N') && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#EEF4FF',
                            color: '#002677',
                            fontSize: '12px',
                            fontWeight: 600,
                            lineHeight: 1
                          }}
                        >
                          <PersonIcon sx={{fontSize: '16px', color: '#002677', display: 'flex'}} />
                          <Box component="span" sx={{lineHeight: '16px'}}>
                            User
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LookupExtensionTable;
