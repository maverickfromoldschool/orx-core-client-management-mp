import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import type {Client, ClientStatus} from '../types';

import {ActionBar, type BulkAction} from './action-bar';
import {ClientTable} from './client-table';
import {ClientPagination} from './client-pagination';

/**
 * Props for the ClientsOverviewCard component
 */
export interface ClientsOverviewCardProps {
  /** Array of client data to display */
  clients: Client[];
  /** Total number of clients (for display in ActionBar) */
  totalClients: number;
  /** Currently selected client IDs */
  selectedIds: string[];
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when client name is clicked */
  onClientClick: (client: Client) => void;
  /** Callback when edit action is clicked */
  onEditClient: (clientId: string, status: ClientStatus, draftId?: string) => void;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when Add Client button is clicked */
  onAddClient: () => void;
  /** Callback when Show Details button is clicked */
  onShowDetails: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
  /** Callback when bulk action is applied */
  onBulkAction: (action: BulkAction) => void;
}

/**
 * ClientsOverviewCard component displays the client table within a card container
 * with action bar and pagination controls.
 * Requirements: 8.1, 8.2, 8.3
 */
export const ClientsOverviewCard: React.FC<ClientsOverviewCardProps> = ({
  clients,
  totalClients,
  selectedIds,
  currentPage,
  totalPages,
  isLoading = false,
  onSelectionChange,
  onClientClick,
  onEditClient,
  onPageChange,
  onAddClient,
  onShowDetails,
  onFiltersClick,
  onBulkAction
}) => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: '1px solid #CBCCCD',
        boxShadow: 'none',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Card Header with Title - Requirements: 8.2 */}
      <Box sx={{px: 3, pt: 3}}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#002677',
            fontFamily: '"Enterprise Sans VF", sans-serif'
          }}
        >
          Clients Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <ActionBar
          totalClients={totalClients}
          onAddClient={onAddClient}
          onShowDetails={onShowDetails}
          onFiltersClick={onFiltersClick}
          onBulkAction={onBulkAction}
        />
      </Box>

      {/* Client Table */}
      <Box sx={{px: 3}}>
        <ClientTable
          clients={clients}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onClientClick={onClientClick}
          onEditClient={onEditClient}
          isLoading={isLoading}
          onAddClient={onAddClient}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <ClientPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </Card>
  );
};

export default ClientsOverviewCard;
