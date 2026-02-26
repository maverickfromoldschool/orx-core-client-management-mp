# API Reference

Complete API documentation for `@optum-rx-core/orx-core-notification`.

## Table of Contents

- [Components](#components)
  - [NotificationProvider](#notificationprovider)
- [Hooks](#hooks)
  - [useNotification](#usenotification)
- [Types](#types)
- [Constants](#constants)

---

## Components

### NotificationProvider

The root provider component that must wrap your application to enable notifications.

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | `React.ReactNode` | Yes | - | Your application components |

#### Example

```tsx
import { NotificationProvider } from '@optum-rx-core/orx-core-notification';

function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}
```

---

## Hooks

### useNotification

The main hook for interacting with the notification system. Must be used within a `NotificationProvider`.

#### Returns

Returns an object with the following properties and methods:

##### Methods

###### `showNotification`

```tsx
showNotification(message: React.ReactNode, options?: NotificationOptions): string
```

Shows a notification with custom options.

**Parameters:**
- `message` (React.ReactNode) - The notification message (string, JSX, or React element)
- `options` (NotificationOptions, optional) - Configuration options

**Returns:** Notification ID (string)

**Examples:**
```tsx
// String message
const id = showNotification('Custom notification', {
  severity: 'info',
  autoHideDuration: 3000,
  position: { vertical: 'bottom', horizontal: 'left' },
});

// React element message
showNotification(
  <>
    <strong>Important:</strong> This is a formatted message
  </>,
  { severity: 'warning' }
);
```

---

###### `showSuccess`

```tsx
showSuccess(message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string
```

Shows a success notification.

**Parameters:**
- `message` (React.ReactNode) - The notification message (string, JSX, or React element)
- `options` (Omit<NotificationOptions, 'severity'>, optional) - Configuration options (severity is preset to 'success')

**Returns:** Notification ID (string)

**Examples:**
```tsx
// Simple string
showSuccess('Operation completed successfully!');

// With options
showSuccess('Saved!', { autoHideDuration: 3000 });

// With formatting
showSuccess(
  <>
    <strong>John Doe</strong> has been added successfully.
  </>
);
```

---

###### `showError`

```tsx
showError(message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string
```

Shows an error notification.

**Parameters:**
- `message` (React.ReactNode) - The notification message (string, JSX, or React element)
- `options` (Omit<NotificationOptions, 'severity'>, optional) - Configuration options (severity is preset to 'error')

**Returns:** Notification ID (string)

**Examples:**
```tsx
showError('An error occurred!');
showError('Failed to save', { autoHideDuration: 8000 });

// With formatting
showError(
  <>
    Failed to delete <strong>{itemName}</strong>
  </>
);
```

---

###### `showWarning`

```tsx
showWarning(message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string
```

Shows a warning notification.

**Parameters:**
- `message` (React.ReactNode) - The notification message (string, JSX, or React element)
- `options` (Omit<NotificationOptions, 'severity'>, optional) - Configuration options (severity is preset to 'warning')

**Returns:** Notification ID (string)

**Examples:**
```tsx
showWarning('Please review your input');
showWarning('Unsaved changes', { persist: true });

// With formatting
showWarning(
  <>
    Duplicate found: <strong>{duplicateName}</strong>
  </>
);
```

---

###### `showInfo`

```tsx
showInfo(message: React.ReactNode, options?: Omit<NotificationOptions, 'severity'>): string
```

Shows an info notification.

**Parameters:**
- `message` (React.ReactNode) - The notification message (string, JSX, or React element)
- `options` (Omit<NotificationOptions, 'severity'>, optional) - Configuration options (severity is preset to 'info')

**Returns:** Notification ID (string)

**Examples:**
```tsx
showInfo('New feature available');
showInfo('Tip: Use keyboard shortcuts', { autoHideDuration: 10000 });

// With formatting
showInfo(
  <>
    Version <strong>2.0</strong> is now available!
  </>
);
```

---

###### `closeNotification`

```tsx
closeNotification(id: string): void
```

Closes a specific notification by ID.

**Parameters:**
- `id` (string) - The notification ID returned from show methods

**Returns:** void

**Example:**
```tsx
const id = showInfo('Loading...');
// ... later
closeNotification(id);
```

---

###### `closeAll`

```tsx
closeAll(): void
```

Closes all active notifications.

**Parameters:** None

**Returns:** void

**Example:**
```tsx
closeAll(); // Removes all notifications
```

---

##### Properties

###### `notifications`

```tsx
notifications: Notification[]
```

Array of all currently active notifications.

**Type:** `Notification[]`

**Example:**
```tsx
const { notifications } = useNotification();
console.log(`Active notifications: ${notifications.length}`);
```

---

## Types

### NotificationSeverity

```typescript
type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';
```

Defines the visual style and semantic meaning of the notification.

---

### NotificationPosition

```typescript
type NotificationPosition = {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
};
```

Defines where the notification appears on screen.

**Supported Positions:**
- Top-left, top-center, top-right
- Bottom-left, bottom-center, bottom-right

---

### NotificationOptions

```typescript
interface NotificationOptions {
  severity?: NotificationSeverity;
  autoHideDuration?: number;
  position?: NotificationPosition;
  closeable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  persist?: boolean;
}
```

Configuration options for notifications.

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| severity | `NotificationSeverity` | No | `'info'` | The notification type/severity |
| autoHideDuration | `number` | No | `6000` | Time in milliseconds before auto-hide (0 for no auto-hide) |
| position | `NotificationPosition` | No | `{ vertical: 'top', horizontal: 'right' }` | Screen position |
| closeable | `boolean` | No | `true` | Whether to show a close button |
| action | `{ label: string; onClick: () => void }` | No | - | Optional action button |
| icon | `React.ReactNode` | No | - | Custom icon to display |
| persist | `boolean` | No | `false` | If true, notification won't auto-hide |

#### Examples

**Basic Options:**
```tsx
{
  severity: 'success',
  autoHideDuration: 3000,
}
```

**With Position:**
```tsx
{
  severity: 'error',
  position: {
    vertical: 'bottom',
    horizontal: 'left',
  },
}
```

**With Action:**
```tsx
{
  severity: 'warning',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
}
```

**Persistent:**
```tsx
{
  persist: true,
  closeable: false, // User can't close it
}
```

**Custom Icon:**
```tsx
import StarIcon from '@mui/icons-material/Star';

{
  icon: <StarIcon />,
  severity: 'info',
}
```

---

### Notification

```typescript
interface Notification {
  id: string;
  message: string;
  options: Required<Omit<NotificationOptions, 'action' | 'icon'>> & {
    action?: NotificationOptions['action'];
    icon?: NotificationOptions['icon'];
  };
  timestamp: number;
}
```

Internal representation of a notification. You typically don't need to create this directly.

---

### NotificationContextValue

```typescript
interface NotificationContextValue {
  showNotification: (message: string, options?: NotificationOptions) => string;
  showSuccess: (message: string, options?: Omit<NotificationOptions, 'severity'>) => string;
  showError: (message: string, options?: Omit<NotificationOptions, 'severity'>) => string;
  showWarning: (message: string, options?: Omit<NotificationOptions, 'severity'>) => string;
  showInfo: (message: string, options?: Omit<NotificationOptions, 'severity'>) => string;
  closeNotification: (id: string) => void;
  closeAll: () => void;
  notifications: Notification[];
}
```

The shape of the context value provided by `NotificationProvider` and returned by `useNotification`.

---

## Constants

### DEFAULT_AUTO_HIDE_DURATION

```typescript
const DEFAULT_AUTO_HIDE_DURATION = 6000;
```

Default time in milliseconds before a notification auto-hides.

**Value:** `6000` (6 seconds)

---

### DEFAULT_POSITION

```typescript
const DEFAULT_POSITION: NotificationPosition = {
  vertical: 'top',
  horizontal: 'right',
};
```

Default screen position for notifications.

**Value:** Top-right corner

---

### MAX_NOTIFICATIONS

```typescript
const MAX_NOTIFICATIONS = 3;
```

Maximum number of notifications displayed simultaneously. When exceeded, oldest notifications are removed.

**Value:** `3`

---

## Error Handling

### Provider Not Found Error

If you use `useNotification` outside of a `NotificationProvider`, you'll get this error:

```
Error: useNotificationContext must be used within a NotificationProvider. 
Make sure your component is wrapped with <NotificationProvider>.
```

**Solution:** Wrap your app with `NotificationProvider`:

```tsx
<NotificationProvider>
  <App />
</NotificationProvider>
```

---

## Best Practices

1. **Use Severity Helpers**
   ```tsx
   // ✅ Good - Clear and concise
   showSuccess('Saved!');
   
   // ❌ Avoid - More verbose
   showNotification('Saved!', { severity: 'success' });
   ```

2. **Set Appropriate Durations**
   ```tsx
   // Success - shorter duration
   showSuccess('Saved!', { autoHideDuration: 3000 });
   
   // Error - longer duration for user to read
   showError('Failed to save', { autoHideDuration: 8000 });
   ```

3. **Use Action Buttons Wisely**
   ```tsx
   // ✅ Good - Clear action
   showWarning('Item deleted', {
     action: {
       label: 'Undo',
       onClick: restore,
     },
   });
   
   // ❌ Avoid - Vague action
   showInfo('Something happened', {
     action: {
       label: 'Click here',
       onClick: doSomething,
     },
   });
   ```

4. **Persistent for Important Messages**
   ```tsx
   showError('Critical system error', {
     persist: true,
     closeable: false, // Force user to address it
   });
   ```

5. **Clean Up Loading States**
   ```tsx
   const id = showInfo('Loading...', { persist: true });
   try {
     await load();
     closeNotification(id); // Always close loading notification
     showSuccess('Loaded!');
   } catch (error) {
     closeNotification(id); // Clean up even on error
     showError('Failed');
   }
   ```

---

## TypeScript Tips

### Strict Typing

```tsx
import type { 
  NotificationSeverity,
  NotificationOptions,
  NotificationPosition 
} from '@optum-rx-core/orx-core-notification';

const severity: NotificationSeverity = 'success';
const position: NotificationPosition = {
  vertical: 'top',
  horizontal: 'right',
};
const options: NotificationOptions = {
  severity,
  position,
  autoHideDuration: 3000,
};
```

### Type Guards

```tsx
function isSeverity(value: string): value is NotificationSeverity {
  return ['success', 'error', 'warning', 'info'].includes(value);
}

const userInput = 'success';
if (isSeverity(userInput)) {
  showNotification('Message', { severity: userInput });
}
```

---

## Performance Considerations

1. **Memoization:** All notification methods are memoized with `useCallback`
2. **Notification Limit:** Maximum 3 notifications prevents performance issues
3. **Auto Cleanup:** Timers are properly cleaned up on unmount
4. **Stable References:** Context value is memoized to prevent unnecessary re-renders

---

## Accessibility

- **ARIA Roles:** Uses MUI's accessible Alert component with proper roles
- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Screen Readers:** Announcements for new notifications
- **Focus Management:** Proper focus order maintained
- **Color Contrast:** Uses MUI theme colors for accessibility

---

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

UNLICENSED
