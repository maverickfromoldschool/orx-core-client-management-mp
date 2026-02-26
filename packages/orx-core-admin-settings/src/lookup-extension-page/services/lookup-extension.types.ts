export interface ServiceLookupExtension {
  id: string;
  extensionId: string;
  displayName: string;
  lookupField: string;
  managedBy: string;
  fieldsCount?: number;
  entriesCount?: number;
}

export interface ServiceFetchParams {
  page: number;
  pageSize: number;
  query?: string;
}

export interface ServiceLookupExtensionsResponse {
  items: ServiceLookupExtension[];
  total: number;
  page: number;
  pageSize: number;
}
