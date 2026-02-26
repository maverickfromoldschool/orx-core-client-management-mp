# Accounting Code Component — orx-core-admin-settings

## Purpose
The Accounting Code component provides a UI and API integration for managing accounting codes and their GL account entries (create, read, update, delete, list with pagination and filtering).

## Location
- Source: packages/orx-core-admin-settings/src
- Main page component: packages/orx-core-admin-settings/src/accounting-code-page/AccountingCodePage/accounting-code-page.tsx
- Hook / page logic: packages/orx-core-admin-settings/src/accounting-code-page/useAccountingCodePage/use-accounting-code-page.tsx
- API service: packages/orx-core-admin-settings/src/services/accounting-code-api.service.ts
- Types: packages/orx-core-admin-settings/src/types/accounting-code-api.types.ts
- API endpoints config types: packages/orx-core-admin-settings/src/types/api-accounting-code-config.types.ts
- Validation schemas: packages/orx-core-admin-settings/src/schemas/accounting-code-api.schemas.ts

## Overview of responsibilities
- Display paginated list of accounting codes with search and filters
- Create new accounting codes via a dialog with one-or-more GL account entries
- Edit existing accounting codes via details + dialog
- Delete accounting codes with confirmation
- Fetch dropdown data for GL account types, groups and key plugins
- Validate request/response payloads using Zod schemas on the client-service layer

## Key APIs (service surface)
Provided by `AccountingCodeApiService` (see service file above). Primary methods:
- `getAccountingCodes(params)` — legacy/list endpoint returning rows for list UI
- `createAccountingCode(data)` — legacy POST to create (non-v1)
- `updateAccountingCode(id, data)` — legacy PUT (non-v1)
- `deleteAccountingCode(id)` — legacy DELETE

v1 API wrappers (validate payloads + responses):
- `createAccountingCodeV1(data: CreateAccountingCodeRequest): Promise<CreatedAccountingCode>`
- `getAccountingCodeV1(accountingCode: string): Promise<CreatedAccountingCode>`
- `updateAccountingCodeV1(accountingCode: string, data: UpdateAccountingCodeRequest): Promise<UpdatedAccountingCode>`
- `getAccountingCodesListV1(params?): Promise<GetAccountingCodesListResponse>`

Utility endpoints (must be configured in `ApiConfig.endpoints`):
- `getGlAccountTypes` (optional)
- `getGlAccountGroups` (optional)
- `getGlAccountingKeyPlugins` (optional)

## API endpoints configuration
The `ApiConfig` interface (packages/orx-core-admin-settings/src/types/api-accounting-code-config.types.ts) defines endpoints expected by the service. Example shape:

```ts
{
  baseUrl: 'https://api.example.com',
  endpoints: {
    getAccountingCodes: '/api/accounting-codes',
    createAccountingCode: '/api/accounting-codes',
    updateAccountingCode: '/api/accounting-codes/:id',
    deleteAccountingCode: '/api/accounting-codes/:id',
    // v1 endpoints
    createAccountingCodeV1: '/v1/accounting-code',
    updateAccountingCodeV1: '/v1/accounting-code/:accountingCode',
    getAccountingCodesListV1: '/v1/accounting-code',
    getAccountingCodeV1: '/v1/accounting-code/:accountingCode',
    // optional dropdown endpoints
    getGlAccountTypes: '/api/gl-account-types',
    getGlAccountGroups: '/api/gl-account-groups',
    getGlAccountingKeyPlugins: '/api/gl-accounting-key-plugins'
  }
}
```

## Data models (summary)
See `packages/orx-core-admin-settings/src/types/accounting-code-api.types.ts` for full definitions. Key models:
- `AccountingCodeListItem` — list view item (no entries)
- `AccountingCodeEntry` — single GL account entry with `effectiveDate`, `expiryDate`, `glAccountNumber`
- `CreateAccountingCodeRequest` / `UpdateAccountingCodeRequest` — payloads for create/update
- `CreatedAccountingCode` / `UpdatedAccountingCode` — server-returned full objects
- `GetAccountingCodesListResponse` — paginated response wrapper

Important fields:
- `accountingCode` (string): unique identifier
- `description` (string)
- `glAccountType`, `glAccountName`, `glAccountNumber` (strings)
- `accountingCodeEntries` (array): each entry carries effective/expiry dates and a GL account number

## Validation rules (zod schemas)
Validation is performed in the service using Zod schemas in `src/schemas/accounting-code-api.schemas.ts`. Highlights:
- `accountingCode`: required, 1–30 chars
- `description`: required, max 254 chars
- `accountingCodeEntries`: array, min 1 entry; each entry requires `accountingCode`, `effectiveDate`, `glAccountNumber`; `expiryDate` may be null
- `displaySequence`: string matching /^
\d+$/ (numeric string)
- `glAccountGroup`: max 3 characters

The service parses and validates both request payloads and API responses and normalizes errors for UI consumption.

## UI components and hooks
- `AccountingCodePage` — page component assembling list, dialogs, and delete confirmation. It consumes the hook outputs and passes dropdown options.
- `useAccountingCodePage` — encapsulates page state, data fetching, dialog flows, and event handlers. Exposes:
  - Data: `data`, `loading`, `totalCount`, `page`, `pageSize`
  - Dialog states: `dialogOpen`, `editDialogOpen`, `deleteDialogOpen`, etc.
  - Dropdown options: `glAccountTypes`, `glAccountGroups`, `glAccountingKeyPlugins`
  - Handlers: `handleCreateNew`, `handleDialogSubmit`, `handleEdit`, `handleEditDialogSubmit`, `handleDeleteConfirm`, filtering, paging, and search handlers

Supporting components (under `components/accounting-codes`):
- `AccountingCodeList` — table/list UI with paging, search, filter, and action buttons
- `AddAccountingCodeDialog` — create dialog that collects `AddAccountingCodeFormData` and calls `handleDialogSubmit`
- `EditAccountingCodeDialog` — edit dialog that uses `EditAccountingCodeFormData`
- `FilterDialog` — advanced filters applied to the list

## Typical flows
- List load: `useAccountingCodePage` calls `apiService.getAccountingCodesListV1(...)`, maps API items to `AccountingCodeRow` for the table.
- Create: Dialog builds `CreateAccountingCodeRequest` (formats local dates), calls `createAccountingCodeV1`, inserts returned row into list and shows success notification.
- Edit: Fetches full code via `getAccountingCodeV1`, maps to edit form, submits `updateAccountingCodeV1`, updates list.
- Delete: Calls legacy `deleteAccountingCode(id)` and removes the row from the list.

## Example usage (wiring the ApiService)
Pass an instance of `AccountingCodeApiService` configured with `ApiConfig` into the application's API context (example simplified):

```ts
import {AccountingCodeApiService} from '@optum-rx/orx-core-admin-settings/src/services/accounting-code-api.service';

const apiService = new AccountingCodeApiService({
  baseUrl: 'https://api.example.com',
  endpoints: { /* see endpoints above */ }
});

// Provide `apiService` via the app's `ApiContext` so `useApiService()` returns it
```

## Files to review
- [packages/orx-core-admin-settings/src/services/accounting-code-api.service.ts](packages/orx-core-admin-settings/src/services/accounting-code-api.service.ts)
- [packages/orx-core-admin-settings/src/types/accounting-code-api.types.ts](packages/orx-core-admin-settings/src/types/accounting-code-api.types.ts)
- [packages/orx-core-admin-settings/src/schemas/accounting-code-api.schemas.ts](packages/orx-core-admin-settings/src/schemas/accounting-code-api.schemas.ts)
- [packages/orx-core-admin-settings/src/accounting-code-page/useAccountingCodePage/use-accounting-code-page.tsx](packages/orx-core-admin-settings/src/accounting-code-page/useAccountingCodePage/use-accounting-code-page.tsx)
- [packages/orx-core-admin-settings/src/accounting-code-page/AccountingCodePage/accounting-code-page.tsx](packages/orx-core-admin-settings/src/accounting-code-page/AccountingCodePage/accounting-code-page.tsx)

## Notes and recommendations
- The service validates payloads with Zod before sending (v1) and validates responses — keep schemas in sync with backend contract.
- Dropdown endpoints are optional and fall back to defaults in the hook — configure them in `ApiConfig` when available.
- Tests: see tests next to hook and page implementations for usage examples and edge cases.

-----
Generated on: 2026-02-10
