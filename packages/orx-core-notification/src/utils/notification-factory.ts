/* eslint-disable @typescript-eslint/no-extraneous-class */
/**
 * Notification Factory
 * Following Single Responsibility Principle (SRP) and Factory Pattern
 */

import {Notification, NotificationOptions} from '../types';
import {DEFAULT_AUTO_HIDE_DURATION, DEFAULT_POSITION} from '../constants';

export class NotificationFactory {
  /**
   * Generate a unique notification ID
   */
  private static generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Create a notification with default options
   */
  static create(message: React.ReactNode, options?: NotificationOptions): Notification {
    const id = this.generateId();
    const timestamp = Date.now();

    const defaultOptions: Required<Omit<NotificationOptions, 'action' | 'icon'>> = {
      severity: options?.severity ?? 'info',
      autoHideDuration: options?.persist ? 0 : (options?.autoHideDuration ?? DEFAULT_AUTO_HIDE_DURATION),
      position: options?.position ?? DEFAULT_POSITION,
      closeable: options?.closeable ?? true,
      persist: options?.persist ?? false
    };

    return {
      id,
      message,
      options: {
        ...defaultOptions,
        action: options?.action,
        icon: options?.icon
      },
      timestamp
    };
  }
}
