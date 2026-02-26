import axios from 'axios';

import {notifyBridge} from '../notification/bridge';

// attach a response interceptor to the default axios instance
// so any component using axios will trigger global notifications on errors
axios.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    let message = 'An error occurred';
    try {
      // narrow the error shape safely without relying on `any` property access
      const errObj = error as {response?: {data?: {message?: unknown} | string}; message?: unknown} | undefined;

      // Check if response data is a string (backend error message)
      if (typeof errObj?.response?.data === 'string' && errObj.response.data.length > 0) {
        message = errObj.response.data;
      } else {
        // Check if message is in data object
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const maybeMsg = (errObj?.response?.data as any)?.message ?? errObj?.message;
        if (typeof maybeMsg === 'string' && maybeMsg.length > 0) {
          message = maybeMsg;
        } else {
          message = 'An error occurred. Please refresh and try again.';
        }
      }
      try {
        // axios attaches the original config to the error; mark it once we've notified
        const cfg = (error && (error as {config?: Record<string, unknown>}).config) as
          | Record<string, unknown>
          | undefined;
        if (!cfg || (cfg && cfg['__notified'] !== true)) {
          notifyBridge(message, 'error');
          if (cfg) {
            // mark so retries or multiple interceptors don't duplicate notifications
            // use string-index access to avoid lint complaining about custom field
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - adding a non-standard flag to axios config for dedupe
            cfg['__notified'] = true;
          }
        }
      } catch (notifyErr) {
        // eslint-disable-next-line no-console
        console.error('Failed to send notification via bridge', notifyErr);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in axios interceptor', e);
    }

    const errToReject = error instanceof Error ? error : new Error(message);
    return Promise.reject(errToReject);
  }
);

export default axios;
