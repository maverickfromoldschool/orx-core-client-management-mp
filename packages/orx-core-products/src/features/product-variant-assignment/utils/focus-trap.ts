/**
 * Focus trap utility for dialogs and modals
 * Ensures keyboard focus stays within the dialog when open
 * Returns focus to the triggering element when closed
 */

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
};

/**
 * Handle keyboard navigation within a focus trap
 */
export const handleFocusTrap = (event: KeyboardEvent, container: HTMLElement) => {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Shift + Tab on first element: go to last
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  }
  // Tab on last element: go to first
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
};

/**
 * Store the element that triggered the dialog
 */
let previousActiveElement: HTMLElement | null = null;

/**
 * Save the currently focused element before opening a dialog
 */
export const saveFocusedElement = () => {
  previousActiveElement = document.activeElement as HTMLElement;
};

/**
 * Restore focus to the element that triggered the dialog
 */
export const restoreFocusedElement = () => {
  previousActiveElement?.focus?.();
  previousActiveElement = null;
};

/**
 * Focus the first focusable element in a container
 */
export const focusFirstElement = (container: HTMLElement) => {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  if (firstElement) {
    firstElement.focus();
  }
};
