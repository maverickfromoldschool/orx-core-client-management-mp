/**
 * Type definitions for Bill Cycle API
 */

/** Schedule item from API response */
export interface BillCycleScheduleItem {
  billCycleScheduleIdentifier: string;
  billCycleCode: string;
  scheduleDate: string;
  closeDate: string;
  startDate: string;
  endDate: string;
  accountingDate: string;
  finalize: string;
  isLinkedToBillCycleRun: string;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/** Bill Cycle interface matching API response structure */
export interface BillCycleApiResponse {
  billCycleCode: string;
  description: string;
  status: string;
  billingPeriod: string;
  nextScheduleDttm: string | null;
  finalsReprocess: string;
  rollingDate: string;
  dailyRefresh: string;
  billCycleScheduleList: BillCycleScheduleItem[];
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/** Request payload for creating a Bill Cycle */
export interface BillCycleCreateRequest {
  billCycleCode: string;
  description: string;
  billingPeriod: string;
  dailyRefresh: string;
  finalsReprocess: string;
  rollingDate: string;
  status?: string;
  billCycleScheduleList?: BillCycleScheduleItem[];
  createdBy?: string;
  modifiedBy?: string;
}

/** Request payload for updating a Bill Cycle */
export interface BillCycleUpdateRequest {
  billCycleCode: string;
  description: string;
  billingPeriod: string;
  dailyRefresh: string;
  finalsReprocess: string;
  rollingDate: string;
  nextScheduleDttm?: string | null;
  status?: string;
  billCycleScheduleList?: BillCycleScheduleItem[];
  createdBy?: string;
  modifiedBy?: string;
  version?: number;
}

/** API response structure for list of Bill Cycles */
export interface BillCyclesApiResponse {
  success: boolean;
  data: {
    totalPages: number;
    currentPage: number;
    totalRecord: number;
    data: BillCycleApiResponse[];
  };
  message: string;
}

/** Query parameters for getting Bill Cycles */
export interface GetBillCyclesParams {
  page?: number;
  size?: number;
  billCycleCode?: string;
  status?: string;
  billPeriodCode?: string;
  description?: string;
}
