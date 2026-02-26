'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,no-nested-ternary,no-useless-catch */

import React from 'react';
import axios from 'axios';

import {UseTableRecordDialogProps, UseTableRecordDialogReturn} from './use-table-record-dialog.types';

export function useTableRecordDialog(props: UseTableRecordDialogProps): UseTableRecordDialogReturn {
  const {rows: propRows, fileRecord} = props;

  const [rows, setRows] = React.useState(propRows ?? []);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // fetch validation messages from backend
  // fetch validation messages from backend using axios to match other components

  const API_BASE_URL = 'https://coreweb-dev-api.optum.com';

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fetchValidationRows = async (uploadHistoryId?: string, page = 0, size = 10) => {
    if (!uploadHistoryId) return {items: [] as any[], total: 0};
    try {
      const resp = await axios.get(`${API_BASE_URL}/api/client/bulkUpload/validationSummaryById`, {
        params: {uploadHistoryId, page, size}
      });
      const {data} = resp;

      // data may be a paged response or an array
      // support multiple possible backend shapes, including the uploadValidationSummaryResponses shape
      const items = Array.isArray(data)
        ? data
        : (data?.content ?? data?.items ?? data?.data ?? data?.uploadValidationSummaryResponses ?? []);
      // try to extract total count from common fields
      const total =
        typeof data?.totalElements === 'number'
          ? data.totalElements
          : typeof data?.total === 'number'
            ? data.total
            : typeof data?.count === 'number'
              ? data.count
              : Array.isArray(items)
                ? items.length
                : 0;
      return {items: items as any[], total};
    } catch (err: unknown) {
      throw err;
    }
  };

  const load = async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      // if consumer provided rows, those are used; otherwise, attempt to load by uploadHistoryId
      const uploadHistoryId = fileRecord?.uploadHistoryId as string | undefined;
      const {items, total} = await fetchValidationRows(uploadHistoryId, page, size);
      // map items to TableRowItem-compatible shape
      const mapped = items.map((it: any, idx: number) => ({
        // prefer common id fields used by backend
        id: it.id ?? it.validationSummaryId ?? it.uploadHistoryId ?? idx,
        description: it.validationMsg ?? it.errorMessage ?? it.description ?? JSON.stringify(it),
        ...it
      }));
      setRows(mapped);
      setTotalCount(total);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let mounted = true;
    if (!propRows || propRows.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        if (!mounted) return;
        await load(0, 10);
      })();
    } else {
      setRows(propRows);
    }
    return () => {
      mounted = false;
    };
  }, [propRows]);

  return {
    rows,
    loading,
    error,
    refresh: load,
    totalCount
  };
}

export default useTableRecordDialog;
