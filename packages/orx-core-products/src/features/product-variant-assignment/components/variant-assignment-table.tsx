import React, {useMemo, useCallback} from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridRowId} from '@mui/x-data-grid';

import {VariantAssignment} from '../types';
import {formatDate, formatBoolean} from '../utils';

/**
 * Convert string array to GridRowSelectionModel
 * Handles edge cases with defensive error handling
 *
 * @param ids - Array of string IDs to convert
 * @returns GridRowSelectionModel object with 'include' type and Set of IDs
 */
const arrayToSelectionModel = (ids: string[] | null | undefined): GridRowSelectionModel => {
  // Handle null, undefined, or invalid input
  if (!ids || !Array.isArray(ids)) {
    return {
      type: 'include',
      ids: new Set<GridRowId>()
    };
  }

  try {
    // Filter out any non-string values and create Set
    const validIds = ids.filter((id) => typeof id === 'string' && id.length > 0);
    return {
      type: 'include',
      ids: new Set<GridRowId>(validIds)
    };
  } catch (error) {
    console.error('Error converting array to selection model:', error);
    return {
      type: 'include',
      ids: new Set<GridRowId>()
    };
  }
};

/**
 * Convert GridRowSelectionModel to string array
 * Handles edge cases with defensive error handling
 *
 * @param model - GridRowSelectionModel to convert
 * @returns Array of string IDs
 */
const selectionModelToArray = (model: GridRowSelectionModel | null | undefined): string[] => {
  // Handle null or undefined input
  if (!model) {
    return [];
  }

  try {
    // For 'include' type, convert Set to array
    if (model.type === 'include' && model.ids) {
      // Ensure ids is iterable (Set)
      if (model.ids instanceof Set) {
        return Array.from(model.ids) as string[];
      }
      // Fallback if ids is already an array or other iterable
      return Array.from(model.ids as Iterable<GridRowId>) as string[];
    }

    // For 'exclude' type, we cannot determine the full set without all possible IDs
    // Return empty array as we only use 'include' type in this implementation
    return [];
  } catch (error) {
    console.error('Error converting selection model to array:', error);
    return [];
  }
};

/**
 * Props for VariantAssignmentTable component
 */
export interface VariantAssignmentTableProps {
  variantAssignments: VariantAssignment[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (assignment: VariantAssignment) => void;
  onDelete: (assignment: VariantAssignment) => void;
  loading?: boolean;
}

/**
 * Common typography styles for table cells
 */
const CELL_TEXT_STYLES = {
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '19.6px',
  color: '#323334'
} as const;

/**
 * Common typography styles for table headers
 */
const HEADER_TEXT_STYLES = {
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '19.6px',
  color: '#323334'
} as const;

/**
 * Custom header renderer
 */
const renderHeader = (headerName: string) => () => <Typography sx={HEADER_TEXT_STYLES}>{headerName}</Typography>;

/**
 * Actions cell renderer
 */
const ActionsCell: React.FC<{
  assignment: VariantAssignment;
  onEdit?: (assignment: VariantAssignment) => void;
  onDelete?: (assignment: VariantAssignment) => void;
}> = ({assignment, onEdit, onDelete}) => (
  <Box sx={{display: 'flex', gap: 0.5, alignItems: 'center'}}>
    <IconButton
      size="small"
      onClick={() => onDelete?.(assignment)}
      aria-label={`delete ${assignment.variantField}`}
      sx={{
        color: '#0C55B8',
        padding: '4px',
        '&:hover': {
          backgroundColor: 'rgba(12, 85, 184, 0.04)'
        }
      }}
    >
      <DeleteOutlineIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={() => onEdit?.(assignment)}
      aria-label={`edit ${assignment.variantField}`}
      sx={{
        color: '#0C55B8',
        padding: '4px',
        '&:hover': {
          backgroundColor: 'rgba(12, 85, 184, 0.04)'
        }
      }}
    >
      <EditOutlinedIcon fontSize="small" />
    </IconButton>
  </Box>
);

/**
 * Assigned Product Variant cell renderer
 */
const AssignedProductVariantCell: React.FC<{assignment: VariantAssignment}> = ({assignment}) => (
  <Typography sx={CELL_TEXT_STYLES}>{assignment.variantField}</Typography>
);

/**
 * Simple text cell renderer
 */
const TextCell: React.FC<{value: string}> = ({value}) => <Typography sx={CELL_TEXT_STYLES}>{value}</Typography>;

/**
 * No rows overlay component
 */
const NoRowsOverlay: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#4B4D4F'
    }}
    role="status"
    aria-live="polite"
  >
    No variant assignments found
  </Box>
);

/**
 * VariantAssignmentTable component
 * Displays variant assignments in a customizable MUI DataGrid
 */
export const VariantAssignmentTable: React.FC<VariantAssignmentTableProps> = ({
  variantAssignments,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  loading = false
}) => {
  /**
   * Column definitions with memoization for performance
   */
  const columns = useMemo<GridColDef<VariantAssignment>[]>(
    () => [
      {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        disableReorder: true,
        renderHeader: renderHeader('Actions'),
        renderCell: (params: GridRenderCellParams<VariantAssignment>) => (
          <ActionsCell assignment={params.row} onEdit={onEdit} onDelete={onDelete} />
        )
      },
      {
        field: 'variantField',
        headerName: 'Assigned Product Variant',
        width: 250,
        sortable: false,
        renderHeader: renderHeader('Assigned Product Variant'),
        renderCell: (params: GridRenderCellParams<VariantAssignment>) => (
          <AssignedProductVariantCell assignment={params.row} />
        )
      },
      {
        field: 'transactionProcessing',
        headerName: 'Transaction Processing',
        width: 200,
        sortable: false,
        renderHeader: renderHeader('Transaction Processing'),
        renderCell: (params: GridRenderCellParams<VariantAssignment>) => (
          <TextCell value={formatBoolean(params.row.transactionProcessing)} />
        )
      },
      {
        field: 'priceDetermination',
        headerName: 'Price Determination',
        width: 180,
        sortable: false,
        renderHeader: renderHeader('Price Determination'),
        renderCell: (params: GridRenderCellParams<VariantAssignment>) => (
          <TextCell value={formatBoolean(params.row.priceDetermination)} />
        )
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        width: 150,
        sortable: false,
        renderHeader: renderHeader('Start Date'),
        renderCell: (params: GridRenderCellParams<VariantAssignment>) => (
          <TextCell value={formatDate(params.row.startDate)} />
        )
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        width: 150,
        sortable: false,
        renderHeader: renderHeader('End Date'),
        renderCell: (params: GridRenderCellParams<VariantAssignment>) => (
          <TextCell value={formatDate(params.row.endDate)} />
        )
      }
    ],
    [onEdit, onDelete]
  );

  /**
   * Convert variant assignments to GridRowsProp format
   */
  const rows = useMemo(() => variantAssignments, [variantAssignments]);

  /**
   * Convert selectedIds prop to GridRowSelectionModel format
   * Memoized to avoid unnecessary conversions on re-renders
   */
  const rowSelectionModel = useMemo<GridRowSelectionModel>(() => arrayToSelectionModel(selectedIds), [selectedIds]);

  /**
   * Handle selection changes from DataGrid
   * Converts GridRowSelectionModel back to string[] for parent component
   */
  const handleSelectionChange = useCallback(
    (newSelectionModel: GridRowSelectionModel) => {
      const newSelectedIds = selectionModelToArray(newSelectionModel);
      onSelectionChange(newSelectedIds);
    },
    [onSelectionChange]
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        paddingTop: '1px',
        overflow: 'hidden',
        '& .MuiDataGrid-root': {
          border: 'none',
          width: '100%'
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #CBCCCD',
          minHeight: '54px !important',
          maxHeight: '54px !important',
          lineHeight: '54px !important'
        },
        '& .MuiDataGrid-columnHeader': {
          padding: '16px',
          height: '54px',
          '&:focus': {
            outline: '2px solid #0066F5',
            outlineOffset: '-2px'
          },
          '&:focus-within': {
            outline: '2px solid #0066F5',
            outlineOffset: '-2px'
          }
        },
        '& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--checkboxSelection': {
          paddingLeft: '16px',
          paddingRight: '0',
          height: '54px',
          display: 'flex',
          alignItems: 'center'
        },
        '& .MuiDataGrid-columnHeaderCheckbox': {
          padding: 0,
          height: '54px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 700,
          overflow: 'visible'
        },
        '& .MuiDataGrid-columnSeparator': {
          display: 'none'
        },
        '& .MuiDataGrid-row': {
          '&:hover': {
            backgroundColor: '#F5F5F5',
            cursor: 'pointer'
          },
          '&.Mui-selected': {
            backgroundColor: '#E3F2FD',
            '&:hover': {
              backgroundColor: '#BBDEFB'
            }
          }
        },
        '& .MuiDataGrid-cell': {
          padding: '16px',
          borderBottom: '1px solid #CBCCCD',
          display: 'flex',
          alignItems: 'center',
          '&:focus': {
            outline: '2px solid #0066F5',
            outlineOffset: '-2px'
          },
          '&:focus-within': {
            outline: '2px solid #0066F5',
            outlineOffset: '-2px'
          }
        },
        '& .MuiDataGrid-footerContainer': {
          display: 'none'
        },
        '& .MuiDataGrid-virtualScroller': {
          minHeight: '200px'
        },
        '& .MuiDataGrid-overlayWrapper': {
          minHeight: '200px'
        }
      }}
      role="region"
      aria-label="Variant assignments table"
    >
      <DataGrid<VariantAssignment>
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooter
        autoHeight
        rowHeight={52}
        columnHeaderHeight={54}
        getRowId={(row) => row.id}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleSelectionChange}
        initialState={{
          sorting: {
            sortModel: []
          }
        }}
        slotProps={{
          noRowsOverlay: {
            sx: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#4B4D4F'
            }
          },
          baseCheckbox: {
            'aria-label': 'Select row'
          }
        }}
        slots={{
          noRowsOverlay: NoRowsOverlay
        }}
        sx={{
          '& .MuiDataGrid-loadingOverlay': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }
        }}
        aria-label="Variant assignments data table"
      />
    </Box>
  );
};
