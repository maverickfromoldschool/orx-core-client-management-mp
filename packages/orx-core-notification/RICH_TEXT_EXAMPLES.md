# Rich Text / Formatted Messages Examples

The notification system supports `React.ReactNode` for messages, allowing you to use JSX elements, components, and rich formatting.

## Basic Examples

### Bold Text

```tsx
showSuccess(
  <>
    <strong>John Doe</strong> has been added successfully.
  </>
);
```

### Italic Text

```tsx
showInfo(
  <>
    <em>Note:</em> This is an important message.
  </>
);
```

### Combined Formatting

```tsx
showWarning(
  <>
    <strong>Warning:</strong> <em>Duplicate client detected</em>
  </>
);
```

## MUI Typography Examples

### Bold with Typography

```tsx
import { Typography } from '@mui/material';

showSuccess(
  <>
    <Typography component="span" fontWeight="bold">
      {clientName}
    </Typography>
    {' has been created successfully.'}
  </>
);
```

### Different Font Sizes

```tsx
showInfo(
  <>
    <Typography variant="subtitle2" component="span">
      Important Update
    </Typography>
    <Typography variant="body2" component="div">
      Your subscription will expire in 7 days.
    </Typography>
  </>
);
```

### Colored Text

```tsx
showError(
  <>
    <Typography component="span" color="error.main">
      Error:
    </Typography>
    {' Failed to process request.'}
  </>
);
```

## MUI Box Examples

### Inline Styling

```tsx
import { Box } from '@mui/material';

showSuccess(
  <>
    <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
      {userName}
    </Box>
    {' logged in successfully.'}
  </>
);
```

### Background Highlight

```tsx
showInfo(
  <>
    Code: 
    <Box 
      component="span" 
      sx={{ 
        px: 1, 
        py: 0.5, 
        bgcolor: 'grey.200', 
        borderRadius: 1,
        fontFamily: 'monospace'
      }}
    >
      ABC123
    </Box>
  </>
);
```

## Multi-line Messages

### Simple Line Breaks

```tsx
showWarning(
  <>
    <strong>Warning!</strong>
    <br />
    Your session will expire in 5 minutes.
  </>
);
```

### Structured Content

```tsx
showError(
  <>
    <Typography variant="subtitle2" component="div" gutterBottom>
      Validation Failed
    </Typography>
    <Typography variant="body2" component="div">
      • Email is required
    </Typography>
    <Typography variant="body2" component="div">
      • Password must be at least 8 characters
    </Typography>
  </>
);
```

## With Icons

### Inline Icons

```tsx
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

showSuccess(
  <>
    <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 16 }} />
    <strong>{itemName}</strong> saved successfully!
  </>
);
```

### Icon with Text

```tsx
import InfoIcon from '@mui/icons-material/Info';
import { Box } from '@mui/material';

showInfo(
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <InfoIcon fontSize="small" />
    <span>New features available in the help menu</span>
  </Box>
);
```

## With Links

### Clickable Link

```tsx
showInfo(
  <>
    Update available. <a href="/updates" style={{ color: 'inherit', textDecoration: 'underline' }}>View details</a>
  </>
);
```

### MUI Link Component

```tsx
import { Link } from '@mui/material';

showSuccess(
  <>
    Profile updated. <Link href="/profile" color="inherit">View profile</Link>
  </>
);
```

## Real-World Examples

### User Registration

```tsx
const handleRegister = (userData) => {
  showSuccess(
    <>
      Welcome, <strong>{userData.firstName}</strong>! Your account has been created.
    </>
  );
};
```

### File Upload

```tsx
const handleFileUpload = (fileName, fileSize) => {
  showSuccess(
    <>
      <strong>{fileName}</strong> ({(fileSize / 1024).toFixed(2)} KB) uploaded successfully.
    </>
  );
};
```

### Bulk Operations

```tsx
const handleBulkDelete = (count, itemType) => {
  showWarning(
    <>
      <strong>{count}</strong> {itemType}(s) will be permanently deleted.
      <br />
      This action cannot be undone.
    </>,
    {
      action: {
        label: 'Confirm',
        onClick: performDelete
      }
    }
  );
};
```

### API Error with Details

```tsx
const handleApiError = (error) => {
  showError(
    <>
      <Typography variant="subtitle2" component="div">
        Request Failed
      </Typography>
      <Typography variant="body2" component="div" color="text.secondary">
        {error.message}
      </Typography>
      <Typography variant="caption" component="div" color="text.disabled">
        Error Code: {error.code}
      </Typography>
    </>,
    { autoHideDuration: 10000 }
  );
};
```

### Progress Update

```tsx
const showProgressUpdate = (current, total) => {
  showInfo(
    <>
      Processing: <strong>{current}</strong> of <strong>{total}</strong> items
      <br />
      <Box sx={{ width: '100%', mt: 1 }}>
        <LinearProgress variant="determinate" value={(current / total) * 100} />
      </Box>
    </>,
    { persist: true }
  );
};
```

### Validation Summary

```tsx
const showValidationErrors = (errors) => {
  showError(
    <>
      <Typography variant="subtitle2" gutterBottom>
        Please fix the following errors:
      </Typography>
      {errors.map((error, index) => (
        <Typography key={index} variant="body2" component="div">
          • {error}
        </Typography>
      ))}
    </>,
    { autoHideDuration: 10000 }
  );
};
```

## Best Practices

### ✅ DO

```tsx
// Use semantic HTML
showSuccess(<><strong>Important</strong> message</>);

// Keep it concise
showInfo(<>User <strong>{name}</strong> logged in</>);

// Use proper React elements
showError(<><em>Note:</em> Action required</>);
```

### ❌ DON'T

```tsx
// Don't use HTML strings (won't work)
showSuccess("<strong>Text</strong>"); // ❌

// Don't overcomplicate
showInfo(
  <div>
    <div>
      <div>
        <span>Too nested</span>
      </div>
    </div>
  </div>
); // ❌

// Don't make it too long
showWarning("Very long message that goes on and on..."); // ❌ Keep it brief
```

## TypeScript Tips

```tsx
// Type-safe component usage
const FormattedMessage: React.FC<{ name: string }> = ({ name }) => (
  <>
    <strong>{name}</strong> has been added.
  </>
);

showSuccess(<FormattedMessage name={clientName} />);

// With proper typing
const createMessage = (name: string): React.ReactNode => (
  <>
    <strong>{name}</strong> updated successfully.
  </>
);

showSuccess(createMessage(userName));
```

## Accessibility Considerations

```tsx
// Good: Use semantic HTML
showSuccess(<><strong>Success!</strong> Operation complete.</>);

// Better: Include ARIA labels when needed
showError(
  <span role="alert">
    <strong>Error:</strong> Failed to save changes.
  </span>
);
```

## Styling Tips

```tsx
// Consistent with theme
import { useTheme } from '@mui/material';

const theme = useTheme();
showInfo(
  <Box sx={{ color: theme.palette.primary.main }}>
    <strong>Tip:</strong> Use keyboard shortcuts
  </Box>
);

// Responsive font sizes
showSuccess(
  <Typography 
    component="span" 
    sx={{ 
      fontSize: { xs: '0.875rem', sm: '1rem' } 
    }}
  >
    <strong>Success!</strong> Item saved.
  </Typography>
);
```
