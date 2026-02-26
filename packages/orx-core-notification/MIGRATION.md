# Migration Guide

## Migrating from other notification systems

This guide helps you migrate from common notification libraries to `@optum-rx-core/orx-core-notification`.

## From react-toastify

### Before (react-toastify)

```tsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <YourComponent />
    </>
  );
}

function YourComponent() {
  const notify = () => toast.success("Success!");
  return <button onClick={notify}>Notify</button>;
}
```

### After (orx-core-notification)

```tsx
import { NotificationProvider, useNotification } from '@optum-rx-core/orx-core-notification';

function App() {
  return (
    <NotificationProvider>
      <YourComponent />
    </NotificationProvider>
  );
}

function YourComponent() {
  const { showSuccess } = useNotification();
  const notify = () => showSuccess("Success!");
  return <button onClick={notify}>Notify</button>;
}
```

## From notistack

### Before (notistack)

```tsx
import { SnackbarProvider, useSnackbar } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <YourComponent />
    </SnackbarProvider>
  );
}

function YourComponent() {
  const { enqueueSnackbar } = useSnackbar();
  
  const handleClick = () => {
    enqueueSnackbar('Success!', { variant: 'success' });
  };
  
  return <button onClick={handleClick}>Show</button>;
}
```

### After (orx-core-notification)

```tsx
import { NotificationProvider, useNotification } from '@optum-rx-core/orx-core-notification';

function App() {
  return (
    <NotificationProvider>
      <YourComponent />
    </NotificationProvider>
  );
}

function YourComponent() {
  const { showSuccess } = useNotification();
  
  const handleClick = () => {
    showSuccess('Success!');
  };
  
  return <button onClick={handleClick}>Show</button>;
}
```

## Comparison Table

| Feature | react-toastify | notistack | orx-core-notification |
|---------|---------------|-----------|----------------------|
| TypeScript | ✅ Partial | ✅ Full | ✅ Full |
| MUI Integration | ❌ | ✅ | ✅ |
| SOLID Principles | ❌ | ⚠️ Partial | ✅ Full |
| Custom Actions | ✅ | ✅ | ✅ |
| Persistent | ✅ | ✅ | ✅ |
| Positioning | ✅ Limited | ✅ | ✅ Full (9 positions) |
| Stacking | ✅ | ✅ | ✅ (Max 3) |
| Bundle Size | ~30KB | ~15KB | ~10KB |
| Dependencies | Own CSS | MUI v4/v5 | MUI v5 |

## API Mapping

### react-toastify → orx-core-notification

| react-toastify | orx-core-notification |
|----------------|----------------------|
| `toast.success()` | `showSuccess()` |
| `toast.error()` | `showError()` |
| `toast.warning()` | `showWarning()` |
| `toast.info()` | `showInfo()` |
| `toast.dismiss(id)` | `closeNotification(id)` |
| `toast.dismiss()` | `closeAll()` |
| `autoClose` | `autoHideDuration` |
| `position` | `position` |
| `closeButton: false` | `closeable: false` |

### notistack → orx-core-notification

| notistack | orx-core-notification |
|-----------|----------------------|
| `enqueueSnackbar(msg, { variant: 'success' })` | `showSuccess(msg)` |
| `enqueueSnackbar(msg, { variant: 'error' })` | `showError(msg)` |
| `enqueueSnackbar(msg, { variant: 'warning' })` | `showWarning(msg)` |
| `enqueueSnackbar(msg, { variant: 'info' })` | `showInfo(msg)` |
| `closeSnackbar(key)` | `closeNotification(id)` |
| `closeSnackbar()` | `closeAll()` |
| `persist: true` | `persist: true` |
| `anchorOrigin` | `position` |
| `action` | `action` |

## Migration Steps

1. **Install the package**
   ```bash
   npm uninstall react-toastify # or notistack
   # orx-core-notification is already in your workspace
   ```

2. **Update imports**
   - Replace old provider imports with `NotificationProvider`
   - Replace old hook imports with `useNotification`

3. **Replace Provider**
   - Wrap your app with `NotificationProvider`
   - Remove old provider components

4. **Update method calls**
   - Use the comparison table above to map methods
   - Update option names (e.g., `autoClose` → `autoHideDuration`)

5. **Remove CSS imports**
   - No CSS imports needed with orx-core-notification
   - Styling comes from MUI

6. **Test your application**
   - Verify all notifications appear correctly
   - Check positioning and timing
   - Test action buttons and custom options

## Common Issues

### TypeScript Errors

**Issue:** Type errors with notification options

**Solution:** Ensure you're using the correct option names:
```tsx
// ❌ Wrong
showSuccess('Message', { autoClose: 3000 });

// ✅ Correct
showSuccess('Message', { autoHideDuration: 3000 });
```

### Multiple Providers

**Issue:** Notifications not showing

**Solution:** Ensure only one `NotificationProvider` wraps your app:
```tsx
// ❌ Wrong - multiple providers
<NotificationProvider>
  <NotificationProvider>
    <App />
  </NotificationProvider>
</NotificationProvider>

// ✅ Correct - single provider at root
<NotificationProvider>
  <App />
</NotificationProvider>
```

### MUI Version Mismatch

**Issue:** Styling issues or component errors

**Solution:** Ensure you're using MUI v5:
```bash
npm install @mui/material@^5.10.0
```

## Benefits of Migration

1. **Better TypeScript Support** - Full type safety with comprehensive types
2. **SOLID Architecture** - Maintainable and extensible codebase
3. **Smaller Bundle** - Optimized size with tree-shaking
4. **MUI Integration** - Native MUI v5 components
5. **Consistent Design** - Matches your MUI theme automatically
6. **Better Testing** - Comprehensive test utilities included
7. **Active Maintenance** - Part of your organization's packages
