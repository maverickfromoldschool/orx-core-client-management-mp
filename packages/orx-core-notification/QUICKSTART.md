# Quick Start Guide

Get up and running with `@optum-rx-core/orx-core-notification` in under 5 minutes!

## Installation

The package is already in your workspace at:
```
packages/orx-core-notification/
```

## Step 1: Install Peer Dependencies (if not already installed)

```bash
npm install @mui/material @mui/icons-material react react-dom
```

## Step 2: Wrap Your App

Open your main app file and add the provider:

```tsx
// src/App.tsx
import { NotificationProvider } from '@optum-rx-core/orx-core-notification';

function App() {
  return (
    <NotificationProvider>
      {/* Your existing app components */}
      <YourAppComponents />
    </NotificationProvider>
  );
}

export default App;
```

## Step 3: Use in Components

```tsx
// src/components/MyComponent.tsx
import { useNotification } from '@optum-rx-core/orx-core-notification';

function MyComponent() {
  const { showSuccess, showError } = useNotification();

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleError = () => {
    showError('Something went wrong!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </div>
  );
}
```

## That's it! 🎉

You now have a fully functional notification system.

## Next Steps

### Try Different Severity Levels

```tsx
const { showSuccess, showError, showWarning, showInfo } = useNotification();

showSuccess('Success message!');
showError('Error message!');
showWarning('Warning message!');
showInfo('Info message!');
```

### Use Rich Text Formatting

```tsx
const { showSuccess } = useNotification();

// With bold text
showSuccess(
  <>
    <strong>John Doe</strong> has been added successfully.
  </>
);

// With MUI Typography
import { Typography } from '@mui/material';

showSuccess(
  <>
    <Typography component="span" fontWeight="bold">
      Important:
    </Typography>
    {' Operation completed.'}
  </>
);

// Multiple lines
showSuccess(
  <>
    <strong>Success!</strong>
    <br />
    Your changes have been saved.
  </>
);
```

### Customize Position

```tsx
showSuccess('Bottom left notification', {
  position: {
    vertical: 'bottom',
    horizontal: 'left',
  },
});
```

### Add Action Buttons

```tsx
showWarning('Item deleted', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked'),
  },
});
```

### Make It Persistent

```tsx
showInfo('Important: Read this carefully', {
  persist: true, // Won't auto-hide
});
```

## Common Recipes

### Form Submission

```tsx
const handleSubmit = async (data) => {
  try {
    await saveData(data);
    showSuccess('Saved successfully!');
  } catch (error) {
    showError(`Failed to save: ${error.message}`);
  }
};
```

### Loading State

```tsx
const handleLoad = async () => {
  const id = showInfo('Loading...', { persist: true });
  
  try {
    await fetchData();
    closeNotification(id);
    showSuccess('Loaded!');
  } catch (error) {
    closeNotification(id);
    showError('Failed to load');
  }
};
```

### Confirmation

```tsx
const handleDelete = () => {
  showWarning('Are you sure?', {
    action: {
      label: 'Yes, delete',
      onClick: () => performDelete(),
    },
    autoHideDuration: 10000,
  });
};
```

## TypeScript Support

Full TypeScript support is included:

```tsx
import type { NotificationOptions } from '@optum-rx-core/orx-core-notification';

const options: NotificationOptions = {
  severity: 'success',
  autoHideDuration: 3000,
  position: {
    vertical: 'top',
    horizontal: 'right',
  },
};

showNotification('Message', options);
```

## Testing

Use the provided test utilities:

```tsx
import { renderWithNotificationProvider } from '@optum-rx-core/orx-core-notification/test-utils';

test('shows notification', async () => {
  const { getByText } = renderWithNotificationProvider(<MyComponent />);
  // Your test code
});
```

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🔄 [Migration Guide](./MIGRATION.md)
- 📝 [Examples](./src/examples.tsx)
- 🧪 [Tests](./src/__tests__/)

## Pro Tips

1. **Limit Notifications** - Only 3 shown at once (automatically managed)
2. **Use Appropriate Severity** - Choose the right level for context
3. **Be Concise** - Keep messages short and actionable
4. **Set Timing** - Errors may need longer display times
5. **Test Early** - Use in development to catch issues

Happy coding! 🚀
