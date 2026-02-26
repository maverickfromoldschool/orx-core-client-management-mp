'use client';

import React, {useState, useCallback, useEffect} from 'react';
import {
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import {useBreadcrumbs} from '@optum-rx-core/orx-core-client-shared';

import FilterPanel, {type FilterField} from '../../components/filter-panel';
import {useFileCenterListPage} from '../useFileCenterListPage/use-file-center-list-page';
import {TableRecordDialog} from '../../table-record-dialog/TableRecordDialog/table-record-dialog';
import {EmptyState} from '../../components/empty-state';

import {FileCenterListPageProps, FileRecord, type UploadType} from './file-center-list-page.types';

const formatUploadDate = (isoString: string): string => {
  const date = new Date(isoString);
  return `${date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })} ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })}`;
};

/**
 * Custom Pagination Component with page numbers
 */
interface CustomPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

function CustomPagination(props: CustomPaginationProps) {
  const {page, pageCount, onPageChange} = props;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '64px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '16px',
        marginTop: '14px',
        borderTop: '1px solid #CBCCCD !important',
        opacity: 1,
        transform: 'rotate(0deg)',
        boxSizing: 'border-box'
      }}
    >
      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => {
          onPageChange(event, value - 1);
        }}
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root': {
            width: '44px',
            height: '44px',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
            fontSize: '14px',
            color: '#323334',
            borderRadius: '8px',
            padding: '10px 16px',
            opacity: 1,
            transform: 'rotate(0deg)',
            minWidth: '44px'
          },
          '& .Mui-selected': {
            backgroundColor: '#002677 !important',
            color: '#FFFFFF'
          }
        }}
      />
    </Box>
  );
}

/**
 * Custom NoRowsOverlay component for DataGrid
 */
function NoRowsOverlay() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '48px'
      }}
    >
      <EmptyState />
    </Box>
  );
}

export function FileCenterListPage(props: FileCenterListPageProps) {
  const {setBreadcrumbs} = useBreadcrumbs();
  const {openUploadDialog, fileTypeFilter = 'all', searchQuery: externalSearchQuery = ''} = props;
  const hookData = useFileCenterListPage();

  // Use files from API hook only
  const {files, loading, error, totalCount, fetchFiles, refreshFiles} = hookData;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openTableRecord, setOpenTableRecord] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<FileRecord | null>(null);
  const [selectedUploadType, setSelectedUploadType] = useState<'client' | 'price'>('client');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});
  const open = Boolean(anchorEl);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  });

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      label: 'File Name',
      fieldKey: 'fileName',
      fieldType: 'text'
    },
    {
      label: 'Status',
      fieldKey: 'uploadStatus',
      fieldType: 'dropdown',
      values: [
        {label: 'Completed', value: 'Completed'},
        {label: 'In Progress', value: 'In Progress'},
        {label: 'In Queue', value: 'In Queue'}
      ]
    },
    {
      label: 'File Type',
      fieldKey: 'fileType',
      fieldType: 'dropdown',
      values: [
        {label: 'Client', value: 'client'},
        {label: 'Price', value: 'pricelist'}
      ]
    }
  ];

  const handlePaginationChange = useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      setPaginationModel((prev) => ({...prev, page: newPage}));
      const combinedFilters: Record<string, string | null> = {...activeFilters};
      if (externalSearchQuery) combinedFilters['fileName'] = externalSearchQuery;
      if (fileTypeFilter !== 'all') {
        combinedFilters['fileType'] = fileTypeFilter;
      }
      fetchFiles(newPage, paginationModel.pageSize, combinedFilters).catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch files:', err);
      });
    },
    [fetchFiles, paginationModel.pageSize, activeFilters, externalSearchQuery, fileTypeFilter]
  );

  const PaginationComponent = useCallback(
    () => (
      <CustomPagination
        page={paginationModel.page}
        pageCount={Math.ceil((totalCount || 0) / paginationModel.pageSize)}
        onPageChange={handlePaginationChange}
      />
    ),
    [paginationModel.page, totalCount, paginationModel.pageSize, handlePaginationChange]
  );

  const handleUploadClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (uploadType: UploadType) => {
    // Add your upload logic here
    openUploadDialog(uploadType);
    handleClose();
  };

  const handleFailedRecordsClick = (rowData: FileRecord) => {
    setSelectedRowData(rowData);
    // Determine upload type from fileType field ("Client" or "Pricing")
    setSelectedUploadType(rowData.fileType?.toLowerCase() === 'pricing' ? 'price' : 'client');
    setOpenTableRecord(true);
  };

  const handleCloseTableRecord = () => {
    setOpenTableRecord(false);
    setSelectedRowData(null);
  };

  const handleFilterPanelOpen = () => {
    setFilterPanelOpen(true);
  };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
  };

  const handleFilterApply = async (filters: Record<string, string | number | null>) => {
    const stringFilters: Record<string, string | null> = {};
    Object.keys(filters).forEach((key) => {
      stringFilters[key] = filters[key] !== null ? String(filters[key]) : null;
    });
    setActiveFilters(stringFilters);
    setPaginationModel((prev) => ({...prev, page: 0}));
    const combinedFilters: Record<string, string | null> = {...stringFilters};
    if (externalSearchQuery) combinedFilters['fileName'] = externalSearchQuery;
    if (fileTypeFilter !== 'all') {
      combinedFilters['fileType'] = fileTypeFilter;
    }
    await fetchFiles(0, paginationModel.pageSize, combinedFilters);
    setFilterPanelOpen(false);
  };

  // Fetch files when fileTypeFilter or searchQuery changes from parent
  useEffect(() => {
    const combinedFilters: Record<string, string | null> = {...activeFilters};
    if (externalSearchQuery) combinedFilters['fileName'] = externalSearchQuery;
    if (fileTypeFilter !== 'all') {
      combinedFilters['fileType'] = fileTypeFilter;
    }
    fetchFiles(paginationModel.page, paginationModel.pageSize, combinedFilters).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch files:', err);
    });
  }, [fileTypeFilter, externalSearchQuery, activeFilters, fetchFiles, paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    setBreadcrumbs([
      {name: 'Home', link: '/'},
      {name: 'File Center', link: '/file-center'}
    ]);
  }, [setBreadcrumbs]);

  const columns: GridColDef[] = [
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 100,
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <IconButton
    //       onClick={() => {
    //         if (props.onDelete) {
    //           props.onDelete(params.row as FileRecord);
    //         }
    //       }}
    //       sx={{
    //         color: '#0C55B8',
    //         '&:hover': {
    //           backgroundColor: 'rgba(12, 85, 184, 0.04)'
    //         }
    //       }}
    //       aria-label="delete"
    //     >
    //       <DeleteIcon
    //         sx={{
    //           width: '16px',
    //           height: '18px',
    //           opacity: 1
    //         }}
    //       />
    //     </IconButton>
    //   )
    // },
    {
      field: 'fileName',
      headerName: 'File Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#4B4D4F',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
            }}
            title={params.value as string}
          >
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'uploadStatus',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value as string;
        let backgroundColor = '#F5F5F5';
        let borderColor = '#9E9E9E';
        let textColor = '#616161';

        if (status === 'Completed') {
          backgroundColor = '#E8F5E9';
          borderColor = '#4CAF50';
          textColor = '#2E7D32';
        } else if (status === 'In Progress') {
          backgroundColor = '#E3F2FD';
          borderColor = '#2196F3';
          textColor = '#1565C0';
        } else if (status === 'In Queue') {
          backgroundColor = '#F5F5F5';
          borderColor = '#9E9E9E';
          textColor = '#616161';
        }

        return (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '24px',
              padding: '4px 16px',
              gap: '4px',
              borderRadius: '4px',
              backgroundColor,
              border: `1px solid ${borderColor}`,
              fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: textColor,
              whiteSpace: 'nowrap',
              opacity: 1,
              transform: 'rotate(0deg)',
              boxSizing: 'border-box'
            }}
          >
            {status}
          </Box>
        );
      }
    },
    {
      field: 'fileType',
      headerName: 'File Type',
      flex: 1,
      minWidth: 100,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          }}
        >
          {params.value}
        </Typography>
      )
    },

    {
      field: 'uploadedBy',
      headerName: 'Uploaded By',
      flex: 1,
      minWidth: 130,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'uploadedAt',
      headerName: 'Uploaded On',
      flex: 1.5,
      minWidth: 180,
      type: 'dateTime',
      sortable: true,
      filterable: true,
      valueGetter: (value: string) => new Date(value),
      renderCell: (params: GridRenderCellParams<FileRecord>) => (
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          }}
        >
          {formatUploadDate(params.row.uploadedAt)}
        </Typography>
      )
    },
    {
      field: 'totalRecords',
      headerName: 'Total Records',
      flex: 1,
      minWidth: 110,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          }}
        >
          {params.value || '-'}
        </Typography>
      )
    },
    {
      field: 'processedRecords',
      headerName: 'Processed',
      flex: 1,
      minWidth: 110,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          }}
        >
          {params.value || '-'}
        </Typography>
      )
    },
    {
      field: 'pendingRecords',
      headerName: 'Pending',
      flex: 1,
      minWidth: 100,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          }}
        >
          {params.value || '-'}
        </Typography>
      )
    },
    {
      field: 'failedRecords',
      headerName: 'Failed',
      flex: 1,
      minWidth: 100,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams<FileRecord>) => {
        const failedCount = params.value as number;

        if (failedCount > 0) {
          return (
            <Typography
              variant="body1"
              onClick={() => {
                handleFailedRecordsClick(params.row);
              }}
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#0C55B8',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
                '&:hover': {
                  color: '#003399'
                }
              }}
            >
              {failedCount}
            </Typography>
          );
        }

        return (
          <Typography
            variant="body1"
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#4B4D4F',
              fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
            }}
          >
            {failedCount || 0}
          </Typography>
        );
      }
    }
  ];

  return (
    <Box
      sx={{
        opacity: 1,
        borderRadius: '12px',
        border: '1px solid #CBCCCD',
        backgroundColor: '#FFFFFF',
        transform: 'rotate(0deg)',
        padding: '30px 30px 0px 30px'
      }}
    >
      {/* File History Title */}
      <Typography
        sx={{
          fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
          fontSize: '20px',
          fontWeight: 600,
          color: '#002677',
          marginBottom: '24px'
        }}
      >
        File History
      </Typography>

      {/* Button Row with File Count */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        {/* Number of Files Text */}
        <Typography
          sx={{
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '140%',
            letterSpacing: '0px',
            color: '#323334'
          }}
        >
          <Box component="span" sx={{fontWeight: 700}}>
            Number of Files:
          </Box>{' '}
          {totalCount || 0}
        </Typography>

        {/* Buttons Container */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box
            onClick={handleUploadClick}
            sx={{
              width: '143px',
              height: '38px',
              backgroundColor: '#002677',
              color: '#FFFFFF',
              fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '46px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
              '&:hover': {
                backgroundColor: '#003399'
              },
              '&:active': {
                backgroundColor: '#001a4d'
              }
            }}
          >
            <CloudUploadIcon sx={{fontSize: '20px'}} />
            <span>Upload</span>
            <ArrowDropDownIcon sx={{fontSize: '20px'}} />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            sx={{
              marginTop: '8px',
              '& .MuiPaper-root': {
                minWidth: '143px',
                width: 'auto',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBCCCD',
                opacity: 1,
                transform: 'rotate(0deg)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
              },
              '& .MuiMenuItem-root': {
                backgroundColor: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#F5F5F5'
                }
              }
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuItemClick('client');
              }}
            >
              Client
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuItemClick('price');
              }}
            >
              Price
            </MenuItem>
          </Menu>

          <Button
            variant="outlined"
            endIcon={<FilterListIcon />}
            disableRipple
            disableElevation
            onClick={handleFilterPanelOpen}
            sx={{
              width: '125px',
              height: '40px',
              backgroundColor: '#FFFFFF',
              color: '#323334',
              textTransform: 'none',
              fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '46px',
              padding: '8px 16px 8px 24px',
              gap: '12px',
              opacity: 1,
              border: '1px solid #323334',
              transform: 'rotate(0deg)',
              marginLeft: '12px',
              '& .MuiButton-endIcon': {
                marginLeft: '0px'
              },
              '&:hover': {
                backgroundColor: '#F5F5F5',
                border: '1px solid #323334'
              }
            }}
          >
            Filters
          </Button>

          <IconButton
            disableRipple
            onClick={refreshFiles}
            sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#FFFFFF',
              color: '#323334',
              borderRadius: '46px',
              padding: '8px',
              opacity: 1,
              border: '1px solid #323334',
              transform: 'rotate(0deg)',
              marginLeft: '12px',
              '&:hover': {
                backgroundColor: '#F5F5F5',
                border: '1px solid #323334'
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          minHeight: '520px',
          height: '600px',
          overflowX: 'visible',
          overflowY: 'visible',
          boxSizing: 'border-box',
          padding: 0,
          margin: 0,
          '& .MuiDataGrid-root': {
            border: 'none',
            borderRadius: '0px',
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'visible',
            overflowY: 'visible',
            boxSizing: 'border-box',
            '& .MuiDataGrid-main': {
              overflowX: 'visible',
              overflowY: 'visible'
            },
            '& .MuiDataGrid-withBorderColor': {
              borderColor: 'transparent !important'
            }
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#FAFAFA',
            borderBottom: '1px solid #CBCCCD',
            minHeight: '54px !important',
            maxHeight: '54px !important',
            '& .MuiDataGrid-columnHeader': {
              fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
              fontWeight: '700 !important',
              fontSize: '14px',
              lineHeight: '140%',
              letterSpacing: '0px',
              color: '#323334',
              borderRight: 'none'
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif',
              fontWeight: '700 !important',
              fontSize: '14px',
              lineHeight: '140%',
              letterSpacing: '0px',
              color: '#323334'
            }
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none !important'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none !important',
            borderRight: 'none !important',
            borderTop: 'none !important',
            borderLeft: 'none !important',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: '0%',
            color: '#4B4D4F'
          },
          '& .MuiDataGrid-row': {
            border: 'none !important',
            borderTop: 'none !important',
            borderBottom: 'none !important',
            '&:nth-of-type(even)': {
              backgroundColor: '#FAFAFA'
            },
            '&:hover': {
              backgroundColor: '#F5F5F5'
            },
            '&:last-child': {
              borderBottom: 'none !important',
              '& .MuiDataGrid-cell': {
                borderBottom: 'none !important'
              }
            }
          },
          '& .MuiDataGrid-filler': {
            display: 'none !important'
          },
          '& .MuiDataGrid-scrollbar': {
            borderTop: 'none !important'
          },
          '& .MuiDataGrid-scrollbarFiller': {
            borderTop: 'none !important'
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none !important',
            borderBottom: 'none !important',
            backgroundColor: '#FFFFFF',
            marginTop: '0px !important',
            paddingTop: '0px !important'
          },
          '& .MuiTablePagination-root': {
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          },
          '& .MuiDataGrid-selectedRowCount': {
            fontFamily: '"Enterprise Sans VF", "Optum Sans", sans-serif'
          }
        }}
      >
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px'
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Box sx={{padding: '20px'}}>
            <Alert
              severity="error"
              onClose={() => {
                /* Error will be cleared on retry */
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {!loading && !error && (
          <DataGrid
            rows={files}
            columns={columns}
            getRowId={(row: FileRecord) => row.uploadHistoryId}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode="server"
            rowCount={totalCount}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            autoHeight={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
            disableDensitySelector={false}
            slots={{
              pagination: PaginationComponent,
              noRowsOverlay: NoRowsOverlay
            }}
            getRowHeight={() => 80}
            sx={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              border: 'none',
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                py: 1,
                borderBottom: 'none !important'
              },
              '& .MuiDataGrid-row': {
                borderBottom: 'none !important',
                marginBottom: '0 !important',
                paddingBottom: '0 !important'
              },
              '& .MuiDataGrid-virtualScroller': {
                overflowX: 'auto',
                overflowY: 'auto',
                paddingBottom: '0px !important',
                marginBottom: '0px !important',
                borderBottom: 'none !important',
                gap: '0px !important',
                '& > div': {
                  marginBottom: '0 !important',
                  paddingBottom: '0 !important'
                },
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  marginLeft: '56px',
                  marginRight: '56px',
                  marginBottom: '0px',
                  marginTop: '0px',
                  border: '1px solid #CBCCCD'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#CBCCCD',
                  borderRadius: '4px',
                  border: '1px solid #E0E0E0',
                  opacity: 1
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#B0B0B0'
                }
              },
              '& .MuiDataGrid-virtualScrollerContent': {
                paddingBottom: '0px !important',
                marginBottom: '0px !important',
                gap: '0px !important',
                height: 'auto !important'
              },
              '& .MuiDataGrid-virtualScrollerRenderZone': {
                paddingBottom: '0px !important',
                marginBottom: '0px !important',
                gap: '0px !important',
                position: 'relative !important'
              },
              '& .MuiDataGrid-main': {
                overflow: 'hidden'
              },
              '& .MuiDataGrid-columnHeaders': {
                overflow: 'visible'
              }
            }}
          />
        )}
      </Box>

      {/* Table Record Dialog for Failed Records */}
      {openTableRecord && selectedRowData && (
        <Dialog open={openTableRecord} onClose={handleCloseTableRecord} maxWidth="md" fullWidth>
          <DialogContent>
            <TableRecordDialog
              title={selectedUploadType === 'price' ? 'Failed Price Records' : 'Failed Client Records'}
              fields={
                selectedUploadType === 'price'
                  ? [
                      {label: 'Entity ID', value: 'entityId'},
                      {label: 'Entity Type', value: 'entityType'}
                    ]
                  : [
                      {label: 'Client Name', value: 'clientName'},
                      {label: 'Entity Name', value: 'entityType'},
                      {label: 'Entity ID', value: 'entityId'}
                    ]
              }
              fileRecord={selectedRowData}
              onClose={handleCloseTableRecord}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Filter Panel */}
      <FilterPanel
        open={filterPanelOpen}
        onClose={handleFilterPanelClose}
        fields={filterFields}
        currentFilters={activeFilters}
        onApply={handleFilterApply}
      />
    </Box>
  );
}

export default FileCenterListPage;
