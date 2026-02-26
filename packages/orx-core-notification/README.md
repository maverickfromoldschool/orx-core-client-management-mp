# @optum-rx-core/orx-core-notification

A robust, type-safe notification system built with MUI v5 Snackbar, React Context, and hooks. Designed following SOLID principles and industry best practices.

## Features

✅ **Type-Safe** - Full TypeScript support with comprehensive type definitions  
✅ **Flexible** - Multiple severity levels (success, error, warning, info)  
✅ **Customizable** - Configurable position, duration, and styling  
✅ **Accessible** - Built on MUI's accessible Alert component  
✅ **Performance** - Optimized with React.memo and useCallback  
✅ **SOLID Principles** - Clean architecture with separation of concerns  
✅ **Multiple Notifications** - Support for stacking up to 3 notifications  
✅ **Action Buttons** - Optional action buttons with callbacks  
✅ **Auto-dismiss** - Configurable auto-hide duration  
✅ **Persistent Notifications** - Option to disable auto-hide  

## Installation

This package has peer dependencies that need to be installed:

```bash
npm install @mui/material @mui/icons-material react react-dom
```

## Basic Usage

### 1. Wrap your app with NotificationProvider

```tsx
import { NotificationProvider } from '@optum-rx-core/orx-core-notification';

function App() {
  return (
    <NotificationProvider>
      <YourComponents />
    </NotificationProvider>
  );
}
```

### 2. Use the useNotification hook

```tsx
import { useNotification } from '@optum-rx-core/orx-core-notification';

function YourComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleError = () => {
    showError('An error occurred!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### Rich Text / Formatted Messages

The notification system supports React elements for rich formatting:

```tsx
import { useNotification } from '@optum-rx-core/orx-core-notification';
import { Typography, Box } from '@mui/material';

function YourComponent() {
  const { showSuccess } = useNotification();

  const handleSubmit = (clientName: string) => {
    // Option 1: Using JSX elements
    showSuccess(
      <>
        <strong>{clientName}</strong> client has been successfully added.
      </>
    );

    // Option 2: Using MUI Typography
    showSuccess(
      <>
        <Typography component="span" fontWeight="bold">
          {clientName}
        </Typography>
        {' client has been successfully added.'}
      </>
    );

    // Option 3: Multiple lines
    showSuccess(
      <>
        <strong>Success!</strong>
        <br />
        Client {clientName} was created.
      </>
    );
  };

  return <button onClick={() => handleSubmit('Acme Corp')}>Submit</button>;
}
```

**Note:** The message parameter accepts `React.ReactNode`, so you can pass strings, JSX elements, or any valid React content. See [RICH_TEXT_EXAMPLES.md](./RICH_TEXT_EXAMPLES.md) for more examples.

## Advanced Usage

### Custom Duration and Position

```tsx
const { showNotification } = useNotification();

showNotification('Custom notification', {
  severity: 'info',
  autoHideDuration: 3000, // 3 seconds
  position: {
    vertical: 'bottom',
    horizontal: 'left',
  },
});
```

### Persistent Notifications

```tsx
const { showWarning } = useNotification();

showWarning('This notification will not auto-hide', {
  persist: true,
});
```

### Notifications with Actions

```tsx
const { showInfo } = useNotification();

showInfo('New update available', {
  action: {
    label: 'Update Now',
    onClick: () => {
      console.log('Updating...');
      // Perform update action
    },
  },
});
```

### Custom Icons

```tsx
import CustomIcon from '@mui/icons-material/Star';
const { showNotification } = useNotification();

showNotification('You earned a badge!', {
  severity: 'success',
  icon: <CustomIcon />,
});
```

### Managing Notifications

```tsx
const { closeNotification, closeAll, notifications } = useNotification();

// Close a specific notification
const notificationId = showSuccess('Test');
setTimeout(() => closeNotification(notificationId), 2000);

// Close all notifications
closeAll();

// Access all active notifications
console.log(notifications);
```

### Non-closeable Notifications

```tsx
const { showError } = useNotification();

showError('Critical error - cannot be dismissed', {
  closeable: false,
  autoHideDuration: 10000, // Will auto-hide after 10 seconds
});
```

## API Reference

### NotificationProvider

The provider component that wraps your application.

**Props:**
- `children: React.ReactNode` - Your application components

### useNotification Hook

Returns an object with the following methods:

#### Methods

##### `showNotification(message: string, options?: NotificationOptions): string`
Shows a notification with custom options. Returns the notification ID.

##### `showSuccess(message: string, options?: Omit<NotificationOptions, 'severity'>): string`
Shows a success notification. Returns the notification ID.

##### `showError(message: string, options?: Omit<NotificationOptions, 'severity'>): string`
Shows an error notification. Returns the notification ID.

##### `showWarning(message: string, options?: Omit<NotificationOptions, 'severity'>): string`
Shows a warning notification. Returns the notification ID.

##### `showInfo(message: string, options?: Omit<NotificationOptions, 'severity'>): string`
Shows an info notification. Returns the notification ID.

##### `closeNotification(id: string): void`
Closes a specific notification by ID.

##### `closeAll(): void`
Closes all active notifications.

#### Properties

##### `notifications: Notification[]`
Array of all active notifications.

### NotificationOptions

Configuration options for notifications:

```typescript
interface NotificationOptions {
  severity?: 'success' | 'error' | 'warning' | 'info';
  autoHideDuration?: number; // milliseconds
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  closeable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  persist?: boolean;
}
```

**Defaults:**
- `severity`: `'info'`
- `autoHideDuration`: `6000` (6 seconds)
- `position`: `{ vertical: 'top', horizontal: 'right' }`
- `closeable`: `true`
- `persist`: `false`

## Architecture & Design Principles

This notification system follows SOLID principles:

### Single Responsibility Principle (SRP)
- Each module has one reason to change
- `NotificationFactory` - creates notifications
- `NotificationItem` - renders individual notifications
- `NotificationContainer` - manages display of notifications
- `useNotificationState` - manages state logic

### Open/Closed Principle (OCP)
- Open for extension (custom options, icons, actions)
- Closed for modification (core logic is stable)

### Liskov Substitution Principle (LSP)
- Components can be replaced without breaking functionality

### Interface Segregation Principle (ISP)
- Interfaces are focused and specific
- Options are optional and don't force unused dependencies

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions (Context)
- Components depend on interfaces, not concrete implementations

## Best Practices

1. **Always wrap with Provider** - Ensure `NotificationProvider` wraps your app
2. **Limit notifications** - Maximum of 3 notifications displayed at once
3. **Use appropriate severity** - Choose the right notification type for context
4. **Set appropriate durations** - Errors may need longer display times
5. **Make actions clear** - Action button labels should be descriptive
6. **Consider accessibility** - Notifications use ARIA-compliant MUI components

## Examples

### Form Validation

```tsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    showSuccess('Form submitted successfully!');
  } catch (error) {
    showError(`Validation failed: ${error.message}`, {
      autoHideDuration: 8000,
    });
  }
};
```

### Undo Action

```tsx
const handleDelete = (itemId) => {
  showWarning('Item deleted', {
    action: {
      label: 'Undo',
      onClick: () => restoreItem(itemId),
    },
    autoHideDuration: 5000,
  });
};
```

### Loading States

```tsx
const handleDownload = async () => {
  const id = showInfo('Downloading...', { persist: true });
  
  try {
    await downloadFile();
    closeNotification(id);
    showSuccess('Download completed!');
  } catch (error) {
    closeNotification(id);
    showError('Download failed!');
  }
};
```

## License

UNLICENSED
