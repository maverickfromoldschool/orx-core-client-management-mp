/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
import React, {useMemo} from 'react';
import {Box, IconButton, Link, Chip, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

import {ProductsTableProps, Product} from '../types';

/**
 * Status configuration for badge rendering
 */
const STATUS_CONFIG = {
  active: {
    label: 'Active',
    backgroundColor: '#E0F3DF',
    color: '#066605'
  },
  inactive: {
    label: 'Inactive',
    backgroundColor: '#F5F5F5',
    color: '#4B4D4F'
  },
  pending: {
    label: 'Pending',
    backgroundColor: '#FFF4E5',
    color: '#663C00'
  }
} as const;

/**
 * Common typography styles for table cells
 */
const CELL_TEXT_STYLES = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '22.4px',
  color: '#4B4D4F'
} as const;

/**
 * Common typography styles for table headers
 */
const HEADER_TEXT_STYLES = {
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '19.6px',
  color: '#000000'
} as const;

/**
 * Link styles
 */
const LINK_STYLES = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '22.4px',
  color: '#0C55B8'
} as const;

/**
 * Custom header renderer
 */
const renderHeader = (headerName: string) => () => <Typography sx={HEADER_TEXT_STYLES}>{headerName}</Typography>;

/**
 * Actions cell renderer
 */
const ActionsCell: React.FC<{
  product: Product;
  onEdit?: (product: Product) => void;
  onCopy?: (product: Product) => void;
}> = ({product, onEdit, onCopy}) => (
  <Box sx={{display: 'flex', gap: '8px', alignItems: 'center'}}>
    <IconButton
      size="small"
      onClick={() => onEdit?.(product)}
      aria-label={`edit ${product.product}`}
      sx={{
        color: '#0C55B8',
        padding: '4px',
        '&:hover': {
          backgroundColor: 'rgba(12, 85, 184, 0.08)'
        }
      }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={() => onCopy?.(product)}
      aria-label={`copy ${product.product}`}
      sx={{
        color: '#0C55B8',
        padding: '4px',
        '&:hover': {
          backgroundColor: 'rgba(12, 85, 184, 0.08)'
        }
      }}
    >
      <ContentCopyIcon fontSize="small" />
    </IconButton>
  </Box>
);

/**
 * Product cell renderer with name and code
 */
const ProductCell: React.FC<{product: Product}> = ({product}) => (
  <div>
    <Link
      component="button"
      type="button"
      underline="hover"
      sx={{
        ...LINK_STYLES,
        display: 'block',
        '&:hover': {
          color: '#003d99'
        }
      }}
    >
      {product.product}
    </Link>
    <Typography sx={CELL_TEXT_STYLES}>{product.productCode}</Typography>
  </div>
);

/**
 * Product type cell renderer with name and code
 */
const ProductTypeCell: React.FC<{product: Product}> = ({product}) => (
  <div>
    <Link
      component="button"
      type="button"
      underline="hover"
      sx={{
        ...LINK_STYLES,
        display: 'block',
        '&:hover': {
          color: '#003d99'
        }
      }}
    >
      {product.productTypeDesc}
    </Link>
    <Typography sx={CELL_TEXT_STYLES}>{product.productType}</Typography>
  </div>
);

/**
 * Charge type cell renderer with name and code
 */
const ChargeTypeCell: React.FC<{product: Product}> = ({product}) => (
  <div>
    <Link
      component="button"
      type="button"
      underline="hover"
      sx={{
        ...LINK_STYLES,
        display: 'block',
        '&:hover': {
          color: '#003d99'
        }
      }}
    >
      {product.chargeTypeCodeDesc}
    </Link>
    <Typography sx={CELL_TEXT_STYLES}>{product.chargeType}</Typography>
  </div>
);

/**
 * Product Group cell renderer with group and link
 */
const ProductGroupCell: React.FC<{product: Product}> = ({product}) => (
  <Box sx={{display: 'flex', flexDirection: 'column', gap: 0}}>
    <Typography sx={{...CELL_TEXT_STYLES, marginBottom: 0}}>{product.productGroup}</Typography>
    {product.productGroupLink && (
      <Link
        component="button"
        type="button"
        underline="hover"
        sx={{
          ...LINK_STYLES,
          marginTop: 0,
          '&:hover': {
            color: '#003d99'
          }
        }}
      >
        {product.productGroupLink}
      </Link>
    )}
  </Box>
);

/**
 * Status badge cell renderer
 */
const StatusCell: React.FC<{status?: Product['status']}> = ({status}) => {
  if (!status) return null;

  const config = STATUS_CONFIG[status];

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '15.6px',
        height: '24px',
        borderRadius: '4px',
        '& .MuiChip-label': {
          padding: '2px 8px'
        }
      }}
    />
  );
};

/**
 * No rows overlay
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
  >
    No products found
  </Box>
);

/**
 * Simple text cell renderer
 */
const TextCell: React.FC<{value: string | boolean}> = ({value}) => (
  <Typography sx={CELL_TEXT_STYLES}>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</Typography>
);

/**
 * ProductsTable component
 * Displays products in a customizable MUI DataGrid
 */
export const ProductsTable: React.FC<ProductsTableProps> = ({products, onEdit, onCopy, loading = false}) => {
  /**
   * Column definitions with memoization for performance
   */
  const columns = useMemo<GridColDef<Product>[]>(
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
        renderCell: (params: GridRenderCellParams<Product>) => (
          <ActionsCell product={params.row} onEdit={onEdit} onCopy={onCopy} />
        )
      },
      {
        field: 'product',
        headerName: 'Product',
        width: 225,
        sortable: false,
        renderHeader: renderHeader('Product'),
        renderCell: (params: GridRenderCellParams<Product>) => <ProductCell product={params.row} />
      },
      {
        field: 'productGroup',
        headerName: 'Product Group',
        width: 225,
        sortable: false,
        renderHeader: renderHeader('Product Group'),
        renderCell: (params: GridRenderCellParams<Product>) => <ProductGroupCell product={params.row} />
      },
      {
        field: 'productType',
        headerName: 'Product Type',
        width: 220,
        sortable: false,
        renderHeader: renderHeader('Product Type'),
        renderCell: (params: GridRenderCellParams<Product>) => <ProductTypeCell product={params.row} />
      },
      {
        field: 'chargeType',
        headerName: 'Charge Type',
        width: 200,
        sortable: false,
        renderHeader: renderHeader('Charge Type'),
        renderCell: (params: GridRenderCellParams<Product>) => <ChargeTypeCell product={params.row} />
      },
      {
        field: 'effectiveDate',
        headerName: 'Effective Date',
        width: 140,
        sortable: false,
        renderHeader: renderHeader('Effective Date'),
        renderCell: (params: GridRenderCellParams<Product>) => <TextCell value={params.row.effectiveDate} />
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        sortable: false,
        renderHeader: renderHeader('Status'),
        renderCell: (params: GridRenderCellParams<Product>) => <StatusCell status={params.row.status} />,
        align: 'left',
        headerAlign: 'left'
      }
    ],
    [onEdit, onCopy]
  );

  /**
   * Convert products to GridRowsProp format
   */
  const rows = useMemo(() => products, [products]);

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        paddingTop: '1px',
        '& .MuiDataGrid-root': {
          border: 'none'
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E5E6',
          minHeight: '54px !important',
          maxHeight: '54px !important'
        },
        '& .MuiDataGrid-columnHeader': {
          padding: '16px',
          '&:focus': {
            outline: 'none'
          },
          '&:focus-within': {
            outline: 'none'
          }
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 700,
          overflow: 'visible'
        },
        '& .MuiDataGrid-columnSeparator': {
          display: 'none'
        },
        '& .MuiDataGrid-row': {
          backgroundColor: '#FAFAFA',
          '&:hover': {
            backgroundColor: '#F5F5F5',
            cursor: 'pointer'
          },
          '&.Mui-selected': {
            backgroundColor: '#F5F5F5',
            '&:hover': {
              backgroundColor: '#EEEEEE'
            }
          }
        },
        '& .MuiDataGrid-cell': {
          padding: '16px',
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          '&:focus': {
            outline: 'none'
          },
          '&:focus-within': {
            outline: 'none'
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
    >
      <DataGrid<Product>
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooter
        autoHeight
        rowHeight={70}
        columnHeaderHeight={54}
        getRowId={(row) => row.id}
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
      />
    </Box>
  );
};
