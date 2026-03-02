import React, {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {useRouteEvent} from '../../events/useRouteEvent/use-route-event';
import {useAnalyticsEvent} from '../../events/useAnalyticsEvent/use-analytics-event';
import {useErrorEvent} from '../../events/useErrorEvent/use-error-event';
import {clientApiService} from '../../services/client-api.service';
import type {AddClientCombinedFormData} from '../../stepper/schemas';

import type {useViewClientPageReturn} from './use-view-client-page.types';

/**
 * Custom hook for View Client Page
 * Handles API calls, event dispatching, and business logic for viewing client details
 */
export function useViewClientPage(): useViewClientPageReturn {
  const {clientId} = useParams<{clientId: string}>();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const {showSuccess} = useNotification();

  const [clientData, setClientData] = useState<AddClientCombinedFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // State for duplicate dialog
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateClientName, setDuplicateClientName] = useState('');

  const {dispatchRouteEvent} = useRouteEvent({ref});
  const {dispatchAnalyticsEvent} = useAnalyticsEvent({ref});
  const {dispatchErrorEvent} = useErrorEvent({ref});

  // Fetch client data on mount or when clientId changes
  useEffect(() => {
    if (!clientId) return;

    setIsLoading(true);
    setError(null);

    clientApiService
      .getClientByClientId(clientId)
      .then((data: AddClientCombinedFormData | null) => {
        setClientData(data);
        setIsLoading(false);

        // Dispatch analytics event for page view
        dispatchAnalyticsEvent({
          category: 'client_management'
        });
      })
      .catch((err: unknown) => {
        setError(err as Error);
        setIsLoading(false);

        // Dispatch error event to host app
        dispatchErrorEvent({
          error: err as Error
        });
      });
  }, [clientId]);

  /**
   * Handle Edit button click
   * Navigates to edit mode with optional step index
   * @param stepIndex - Optional step index to jump to (0-3)
   */
  const handleEdit = (stepIndex?: number) => {
    if (!clientId) return;

    // let url = `/edit-client/${clientId}`;
    let url = `/edit-client?clientId=${clientId}`;
    if (stepIndex !== undefined) {
      url += `&step=${stepIndex}`;
    }

    // Dispatch analytics event
    dispatchAnalyticsEvent({
      category: 'client_management'
    });

    // Dispatch route event for host app
    dispatchRouteEvent({href: url});

    // Navigate internally
    navigate(url);
  };

  /**
   * Handle Duplicate button click
   * Opens the duplicate dialog with pre-filled client name
   */
  const handleDuplicate = () => {
    if (!clientData) return;

    // Pre-fill with current client name + " (Copy)"
    setDuplicateClientName(`${clientData.clientDetails.clientName} (Copy)`);
    setDuplicateDialogOpen(true);

    // Dispatch analytics event
    dispatchAnalyticsEvent({
      category: 'client_management'
    });
  };

  /**
   * Handle closing the duplicate dialog
   */
  const handleDuplicateDialogClose = () => {
    setDuplicateDialogOpen(false);
    setDuplicateClientName('');
  };

  /**
   * Handle saving the duplicate client
   * Creates a new client with the duplicated data
   */
  const handleDuplicateSave = async () => {
    if (!duplicateClientName.trim() || !clientData) {
      return;
    }

    try {
      // Prepare duplicated data
      const duplicatedData: AddClientCombinedFormData = {
        ...clientData,
        clientDetails: {
          ...clientData.clientDetails,
          clientId: '', // Clear client ID for new client
          clientName: duplicateClientName.trim()
        },
        draftId: undefined // Clear draft ID
      };

      // Close dialog
      setDuplicateDialogOpen(false);
      setDuplicateClientName('');

      // Call add client API (mode = 'save' to create new client)
      const response = (await clientApiService.submitClient(duplicatedData, 'save')) as {
        clientDetails?: {clientId?: string};
      };

      showSuccess(
        <>
          <strong>{duplicatedData.clientDetails.clientName}</strong> client has been successfully created.
        </>
      );

      // Navigate to edit page with new client ID
      if (response?.clientDetails?.clientId) {
        const url = `/edit-client/${response.clientDetails.clientId}`;
        dispatchRouteEvent({href: url});
        navigate(url);
      } else {
        // Fallback to client list if no ID returned
        const url = '/client-list';
        dispatchRouteEvent({href: url});
        navigate(url);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to duplicate client:', err);
      setDuplicateDialogOpen(false);
      setDuplicateClientName('');

      // Dispatch error event
      dispatchErrorEvent({
        error: err as Error
      });
    }
  };

  /**
   * Handle Back to Client List button click
   * Navigates back to client list page
   */
  const handleBack = () => {
    const url = '/client-list';

    // Dispatch route event for host app
    dispatchRouteEvent({href: url});

    // Navigate internally
    navigate(-1);
  };

  return {
    clientData,
    isLoading,
    error,
    handleEdit,
    handleDuplicate,
    handleBack,
    ref,
    duplicateDialogOpen,
    duplicateClientName,
    setDuplicateClientName,
    handleDuplicateDialogClose,
    handleDuplicateSave
  };
}

export default useViewClientPage;
