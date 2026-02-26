import type {BillCycleScheduleItem} from '../services/bill-cycle-api.types';
import type {BillPeriodOption} from '../services';

/**
 * Bill Cycle data structure
 */
export interface BillCycleDialogData {
  /** Unique identifier */
  id?: string;
  /** Bill cycle code */
  billCycleCode: string;
  /** Billing period */
  billingPeriod: string;
  /** Description */
  description: string;
  /** Daily refresh/reprocess flag */
  dailyRefresh: boolean;
  /** Finals reprocess flag */
  finalsReprocess: boolean;
  /** Status of the bill cycle */
  status?: string;
  /** Schedules associated with this bill cycle */
  billCycleScheduleList?: BillCycleScheduleItem[];
}

/**
 * Props for the BillCycleDialog component
 */
export interface BillCycleDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when form is saved */
  onSave: (data: BillCycleDialogData) => void;
  /** Initial data for editing (undefined for new item) */
  initialData?: BillCycleDialogData;
  /** Whether the form is currently saving */
  isSaving?: boolean;
  /** Billing period options from API */
  billingPeriodOptions: BillPeriodOption[];
}
