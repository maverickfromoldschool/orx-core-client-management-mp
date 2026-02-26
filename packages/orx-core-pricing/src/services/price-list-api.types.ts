/** Eligibility Condition interface */
export interface EligibilityCondition {
  conditionDescription: string;
  ifConditionTrue: string;
  ifConditionFalse: string;
  conditionType: string;
}

/** Price Rule interface */
export interface PriceRule {
  ruleId?: string;
  ruleName: string;
  pricingScheme: string;
  valueType: string;
  unitOfMeasure?: string;
  timeOfUse?: string;
  rate: number;
  lineQuantityAttribute: string;
  accountingCode: string;
  decimalPosition: number;
  roundingPolicy: string;
  rateType?: string;
  eligibilityCondition?: EligibilityCondition;
}

/** Price List Entry Summary (for list view) */
export interface PriceListEntrySummary {
  priceListEntryId: string;
  serviceDescription: string;
  productCode: string;
  pricingCurrency: string;
  effectiveDate: string;
  expirationDate: string;
  ruleCount?: number;
  price?: string;
  status?: string;
}

/** Price List Entry Details API response */
export interface PriceListEntryDetailsApi {
  priceListEntry: {
    serviceDescription: string;
    productCode: string;
    pricingCurrency: string;
    effectiveDate: string;
    expirationDate: string;
  };
  priceRules: PriceRule[];
}

/** Price List Entry interface (for internal use) */
export interface PriceListEntry {
  entryId: string;
  serviceDescription: string;
  productCode: string;
  pricingCurrency: string;
  effectiveDate: string;
  expirationDate: string;
  ruleCount?: number;
  price?: string;
  status?: string;
  priceRules: PriceRule[];
}

/** Price List Details API response interface */
export interface PriceListDetailsApi {
  priceListCode: string;
  priceListName: string;
  businessSector: string;
  priceListType: string;
  effectiveDate: string;
  expirationDate: string;
  eligibilityConditions: EligibilityCondition[];
  priceListEntries?: PriceListEntry[];
}

/** Price List Summary for list view */
export interface PriceListSummary {
  id: string;
  priceListCode: string;
  priceListName: string;
  businessSector: string;
  priceListType: string;
  priceListEntries: number;
  effectiveDate: string;
  status: string;
}

/** Paginated Price Lists API response */
export interface PriceListsApiResponse {
  content: {
    priceListId: string;
    priceListCode: string;
    priceListName: string;
    businessSector: string;
    priceListType: string;
    priceListEntries: number;
    effectiveDate: string;
    status: string;
  }[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/** API error structure */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
