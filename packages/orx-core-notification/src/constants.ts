/**
 * Notification system constants
 * Single Responsibility Principle (SRP) - Configuration management
 */

import {NotificationPosition} from './types';

export const DEFAULT_AUTO_HIDE_DURATION = 6000;

export const DEFAULT_POSITION: NotificationPosition = {
  vertical: 'top',
  horizontal: 'right'
};

export const MAX_NOTIFICATIONS = 3;

export const NOTIFICATION_TRANSITION_DURATION = 300;
