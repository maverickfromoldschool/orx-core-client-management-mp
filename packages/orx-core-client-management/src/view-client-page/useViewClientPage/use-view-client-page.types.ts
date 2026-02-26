import type {AddClientCombinedFormData} from '../../stepper/schemas';

export interface useViewClientPageProps {
  /** Optional client ID (can also come from URL params) */
  clientId?: string;
}

export interface useViewClientPageReturn {
  /** Client data from API */
  clientData: AddClientCombinedFormData | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Handle edit - navigate to edit mode with optional step index */
  handleEdit: (stepIndex?: number) => void;
  /** Handle duplicate - opens duplicate dialog */
  handleDuplicate: () => void;
  /** Handle back to client list */
  handleBack: () => void;
  /** Ref for event dispatching */
  ref: React.RefObject<HTMLDivElement>;
  /** Duplicate dialog open state */
  duplicateDialogOpen: boolean;
  /** Duplicate client name input value */
  duplicateClientName: string;
  /** Setter for duplicate client name */
  setDuplicateClientName: (name: string) => void;
  /** Handle closing duplicate dialog */
  handleDuplicateDialogClose: () => void;
  /** Handle saving duplicate client */
  handleDuplicateSave: () => Promise<void>;
}
