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
  Link as MuiLink
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import type {Client, ClientStatus} from '../types';

import {StatusChip} from './status-chip';
import {EmptyState} from './empty-state';

/**
 * Props for the ClientTable component
 */
export interface ClientTableProps {
  /** Array of client data to display */
  clients: Client[];
  /** Currently selected client IDs */
  selectedIds: string[];
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when client name is clicked */
  onClientClick: (client: Client) => void;
  /** Callback when edit action is clicked */
  onEditClient: (clientId: string, status: ClientStatus, draftId?: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when upload client link is clicked */
  onUploadClient?: () => void;
  /** Callback when add client link is clicked */
  onAddClient?: () => void;
}

/** Table column definitions */
const columns = [
  {id: 'checkbox', label: '', width: 48},
  {id: 'actions', label: 'Actions', width: 80},
  {id: 'clientName', label: 'Client Name', width: 'auto'},
  // {id: 'clientId', label: 'Client ID', width: 120},
  {id: 'status', label: 'Status', width: 160},
  {id: 'clientReferenceId', label: 'Client ID', width: 160},
  {id: 'effectiveDate', label: 'Effective Date', width: 160},
  {id: 'operationalUnitsCount', label: 'No. of Operational Units', width: 160}
];

/**
 * ClientTable component displays client records in a data table
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */
export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  selectedIds,
  onSelectionChange,
  onClientClick,
  onEditClient,
  isLoading = false,
  onUploadClient,
  onAddClient
}) => {
  const isAllSelected = clients.length > 0 && selectedIds.length === clients.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < clients.length;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectionChange(clients.map((client) => client.clientId));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (clientId: string) => {
    if (selectedIds.includes(clientId)) {
      onSelectionChange(selectedIds.filter((id) => id !== clientId));
    } else {
      onSelectionChange([...selectedIds, clientId]);
    }
  };

  const handleClientClick = (client: Client) => (event: React.MouseEvent) => {
    event.preventDefault();
    onClientClick(client);
  };

  // Loading skeleton rows
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
            {Array.from({length: 5}, (_, index) => index).map((rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
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

  // No clients found
  if (clients.length === 0) {
    return <EmptyState onUploadClient={onUploadClient} onAddClient={onAddClient} />;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {/* Checkbox column header */}
            <TableCell
              sx={{
                width: columns[0]?.width ?? 48,
                borderBottom: '1px solid #CBCCCD',
                padding: '16px'
              }}
            >
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
                sx={{
                  color: '#CBCCCD',
                  '&.Mui-checked': {
                    color: '#002677'
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: '#002677'
                  }
                }}
              />
            </TableCell>
            {/* Other column headers */}
            {columns.slice(1).map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#323334',
                  borderBottom: '1px solid #CBCCCD',
                  width: column.width,
                  padding: '16px',
                  whiteSpace: 'nowrap'
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client, index) => {
            const isSelected = selectedIds.includes(client.clientId);
            const isAlternateRow = index % 2 === 1;

            return (
              <TableRow
                key={client.clientId}
                sx={{
                  backgroundColor: isAlternateRow ? '#FAFAFA' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#F5F5F5'
                  }
                }}
              >
                {/* Checkbox cell */}
                <TableCell sx={{padding: '16px', borderBottom: '1px solid #CBCCCD'}}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {
                      handleSelectOne(client.clientId);
                    }}
                    sx={{
                      color: '#CBCCCD',
                      '&.Mui-checked': {
                        color: '#002677'
                      }
                    }}
                  />
                </TableCell>

                {/* Actions cell */}
                <TableCell sx={{padding: '16px', borderBottom: '1px solid #CBCCCD'}}>
                  <IconButton
                    onClick={() => {
                      // console.log(client);
                      onEditClient(client.clientId, client.status, client.draftId);
                    }}
                    size="small"
                    aria-label={`Edit ${client.clientName}`}
                    sx={{
                      color: '#0C55B8',
                      '&:hover': {
                        color: '#002677'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>

                {/* Client Name cell - clickable only if Complete status */}
                <TableCell sx={{padding: '16px', borderBottom: '1px solid #CBCCCD'}}>
                  {client.status === 'Complete' ? (
                    <MuiLink
                      component="button"
                      onClick={handleClientClick(client)}
                      sx={{
                        color: '#0C55B8',
                        textDecoration: 'underline',
                        fontWeight: 400,
                        fontSize: '16px',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        font: 'inherit',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {client.clientName}
                    </MuiLink>
                  ) : (
                    <Tooltip title="Drafts cannot be viewed. Click Edit to continue editing." placement="top">
                      <Box
                        component="span"
                        sx={{
                          color: '#6D6E70',
                          fontWeight: 400,
                          fontSize: '16px',
                          cursor: 'not-allowed'
                        }}
                      >
                        {client.clientName}
                      </Box>
                    </Tooltip>
                  )}
                </TableCell>

                {/* Client ID cell */}
                {/* <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F',
                    maxWidth: '180px'
                  }}
                >
                  <Tooltip title={client.clientId} placement="top">
                    <Box
                      component="span"
                      sx={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {client.clientId}
                    </Box>
                  </Tooltip>
                </TableCell> */}

                {/* Status cell */}
                <TableCell sx={{padding: '16px', borderBottom: '1px solid #CBCCCD'}}>
                  <StatusChip status={client.status || 'Complete'} />
                </TableCell>

                {/* Client Reference ID cell */}
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F'
                  }}
                >
                  {client.clientReferenceId}
                </TableCell>

                {/* Effective Date cell */}
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F'
                  }}
                >
                  {client.effectiveDate}
                </TableCell>

                {/* Operational Units Count cell */}
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F'
                  }}
                >
                  {client.operationalUnitsCount}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Empty state */}
      {clients.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '48px',
            color: '#4B4D4F',
            fontSize: '16px'
          }}
        >
          No clients found
        </Box>
      )}
    </TableContainer>
  );
};
