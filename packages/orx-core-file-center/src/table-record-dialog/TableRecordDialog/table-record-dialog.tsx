'use client';

import React, {useState, useCallback} from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Pagination
} from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import CloseIcon from '@mui/icons-material/Close';

import {useTableRecordDialog} from '../useTableRecordDialog/use-table-record-dialog';

import {TableRecordDialogProps} from './table-record-dialog.types';

/**
 * TableRecordDialog
 * - title: header title
 * - rows: array of objects (each may include `id` and `description`)
 * - fields: list of keys to display as columns
 *
 * The component renders a table and provides a per-row "More Details" / "Less Details"
 * toggle which shows the row's `description` value inline.
 */
export function TableRecordDialog(props: TableRecordDialogProps) {
  const {title, fields = [], onClose, text} = props;
  const [expandedIds, setExpandedIds] = React.useState<Set<string | number>>(() => new Set());

  const {rows: rowsState, loading, error, refresh: refreshRows, totalCount} = useTableRecordDialog(props);

  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});

  const effectiveFields = Array.isArray(fields) ? fields : [];
  const rows = Array.isArray(rowsState) ? rowsState : [];

  const toggleDetails = (id?: string | number) => {
    if (id === undefined) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePaginationChange = useCallback(
    (event: React.ChangeEvent<unknown>, newValue: number) => {
      const newPage = newValue - 1;
      setPaginationModel((prev) => ({...prev, page: newPage}));
      refreshRows(newPage, paginationModel.pageSize).catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch table-record page:', err);
      });
    },
    [refreshRows, paginationModel.pageSize]
  );

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
        <Typography sx={{fontWeight: 700, fontSize: '28px', color: '#002677'}}>{title ?? text}</Typography>
        {onClose && (
          <IconButton onClick={onClose} aria-label="close" sx={{color: '#6E7072'}}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {!loading && error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <Table size="small">
          <TableHead>
            <TableRow>
              {effectiveFields.map((f) => (
                <TableCell key={f.value} sx={{fontWeight: 700, color: '#000000', fontSize: '14px'}}>
                  {f.label}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => {
              const id = row.id ?? idx;
              const isExpanded = expandedIds.has(id);
              return (
                <React.Fragment key={String(id)}>
                  <TableRow
                    sx={{
                      '& .MuiTableCell-root': {
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#4B4D4F'
                      }
                    }}
                  >
                    {effectiveFields.map((f) => (
                      <TableCell key={f.value}>{String(row[f.value] ?? '')}</TableCell>
                    ))}
                    <TableCell>
                      <Button
                        size="small"
                        variant="text"
                        sx={{color: '#0C55B8', fontWeight: 400, fontSize: '16px', textDecoration: 'underline'}}
                        onClick={() => {
                          toggleDetails(id);
                        }}
                      >
                        {isExpanded ? 'Less Details' : 'More Details'}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={fields.length + 1} sx={{p: 0}}>
                        <Box
                          sx={{
                            border: '1px solid #B1B2B4', // use shorthand so border appears
                            borderRadius: '12px',
                            p: 2, // inner spacing
                            bgcolor: '#FAFCFF'
                          }}
                        >
                          <Typography sx={{fontWeight: 700, color: '#323334', fontSize: '14px', mb: 1}}>
                            Error Message
                          </Typography>
                          <Typography sx={{color: '#4B4D4F', backgroundColor: 'white', whiteSpace: 'pre-wrap'}}>
                            {row.description ?? 'No details provided.'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          pt: 1,
          borderTop: '1px solid #CBCCCD'
        }}
      >
        {onClose ? (
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: '46px',
              border: '1px solid #002677',
              backgroundColor: '#FBF9F4',
              color: '#002677',
              fontWeight: 700,
              fontSize: '16px'
            }}
          >
            Close
          </Button>
        ) : (
          <div />
        )}

        <div>
          <Pagination
            count={Math.max(1, Math.ceil((totalCount || 0) / paginationModel.pageSize))}
            page={paginationModel.page + 1}
            onChange={(event, value) => {
              handlePaginationChange(event, value);
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
        </div>
      </Box>
    </Box>
  );
}

export default TableRecordDialog;
