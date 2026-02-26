'use client';

import React from 'react';
import axios from 'axios';

import {UseFileUploadDialogProps, UseFileUploadDialogReturn} from './use-file-upload-dialog.types';

export function useFileUploadDialog(props: UseFileUploadDialogProps): UseFileUploadDialogReturn {
  const {text, uploadType = 'client'} = props;
  const [value, setValue] = React.useState<string>(text ?? '');

  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);

  function onClick() {
    setValue('new value');
  }

  async function upload(files: File[]): Promise<{success: boolean; data?: any; error?: string}> {
    if (!files || files.length === 0) {
      return {success: false, error: 'No files provided'};
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    const API_BASE_URL = 'https://coreweb-dev-api.optum.com';
    const form = new FormData();
    files.forEach((f) => {
      form.append('file', f);
    });

    try {
      const params = uploadType === 'price' ? {templateType: 'PRICELIST'} : {templateType: 'Client'};

      // axios returns dynamic data; allow unsafe assignment for this network return
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const resp = await axios.post(`${API_BASE_URL}/api/client/bulkUpload`, form, {
        headers: {'Content-Type': 'multipart/form-data'},
        params
      });

      // return dynamic resp.data as-is (caller handles typing)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
      return {success: true, data: resp.data};
    } catch (err: unknown) {
      let message = 'Upload failed';

      // Extract backend error message from response
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          const responseData = err.response.data;
          // Try to extract message from various possible response formats
          if (typeof responseData === 'string') {
            // If response is a plain string, use it directly
            message = responseData;
          } else if (typeof responseData === 'object') {
            // Try multiple possible error message fields
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const errorMessage =
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              responseData?.message ||
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              responseData?.error ||
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              responseData?.errorMessage;

            if (errorMessage) {
              message = errorMessage;
            } else {
              // Fallback to axios error message
              message = err.message;
            }
          }
        } else {
          // No response data, use error message
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err);
      }

      setError(message);
      return {success: false, error: message};
    } finally {
      setIsUploading(false);
    }
  }

  const clearError = () => {
    setError(null);
  };

  return {
    value,
    onClick,
    upload,
    isUploading,
    progress,
    error,
    clearError
  };
}

export default useFileUploadDialog;
