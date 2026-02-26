/**
 * Notification types and interfaces
 * Following Interface Segregation Principle (ISP)
 */

export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationPosition {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface NotificationOptions {
  /**
   * The severity/type of the notification
   * @default 'info'
   */
  severity?: NotificationSeverity;

  /**
   * Auto-hide duration in milliseconds
   * @default 6000
   */
  autoHideDuration?: number;

  /**
   * Position of the notification
   * @default { vertical: 'top', horizontal: 'right' }
   */
  position?: NotificationPosition;

  /**
   * Whether to show a close button
   * @default true
   */
  closeable?: boolean;

  /**
   * Action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;

  /**
   * Whether to persist the notification (no auto-hide)
   * @default false
   */
  persist?: boolean;
}

export interface Notification {
  id: string;
  message: React.ReactNode;
  options: Required<Omit<NotificationOptions, 'action' | 'icon'>> & {
    action?: NotificationOptions['action'];
    icon?: NotificationOptions['icon'];
  };
  timestamp: number;
}

export interface NotificationContextValue {
  /**
   * Show a notification with the given message and options
   */
  showNotification: (message: React.ReactNode, options?: NotificationOptions) => string;

  /**
   * Show a success notification
   */
  showSuccess: (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>) => string;

  /**
   * Show an error notification
   */
  showError: (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>) => string;

  /**
   * Show a warning notification
   */
  showWarning: (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>) => string;

  /**
   * Show an info notification
   */
  showInfo: (message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>) => string;

  /**
   * Close a specific notification by ID
   */
  closeNotification: (id: string) => void;

  /**
   * Close all notifications
   */
  closeAll: () => void;

  /**
   * Get all active notifications
   */
  notifications: Notification[];
}
