export interface AttributeRowData {
  attribute: string;
  attributeVal: string;
  startDate: string;
  endDate: string;
}

export interface EditingState {
  rowId: string;
  values: AttributeRowData;
}

export interface DatePickerState {
  startDateOpen: boolean;
  endDateOpen: boolean;
}
