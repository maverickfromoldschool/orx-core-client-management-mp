/**
 * @optum-rx-core/orx-core-notification
 *
 * A robust notification system built with MUI v5 Snackbar, React Context, and hooks.
 * Follows SOLID principles and industry best practices.
 *
 * @example
 * ```tsx
 * import { NotificationProvider, useNotification } from '@optum-rx-core/orx-core-notification';
 *
 * function App() {
 *   return (
 *     <NotificationProvider>
 *       <YourComponent />
 *     </NotificationProvider>
 *   );
 * }
 *
 * function YourComponent() {
 *   const { showSuccess, showError } = useNotification();
 *
 *   const handleClick = () => {
 *     showSuccess('Operation completed successfully!');
 *   };
 *
 *   return <button onClick={handleClick}>Show Notification</button>;
 * }
 * ```
 */

// Provider
export {NotificationProvider} from './provider/NotificationProvider';
export type {NotificationProviderProps} from './provider/NotificationProvider';

// Hooks
export {useNotification} from './hooks/useNotification';

// Types
export type {
  NotificationSeverity,
  NotificationPosition,
  NotificationOptions,
  Notification,
  NotificationContextValue
} from './types';

// Constants (for advanced customization)
export {DEFAULT_AUTO_HIDE_DURATION, DEFAULT_POSITION, MAX_NOTIFICATIONS} from './constants';
