type ShowFn = (message: React.ReactNode, options?: {severity?: 'error' | 'warning' | 'info' | 'success'}) => string;

let showFn: ShowFn | null = null;

export const setNotifier = (fn: ShowFn) => {
  showFn = fn;
};

export const notifyBridge = (message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'error') => {
  if (showFn) {
    try {
      showFn(message, {severity});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Notification bridge error', e);
    }
  }
};

export default {setNotifier, notifyBridge};
