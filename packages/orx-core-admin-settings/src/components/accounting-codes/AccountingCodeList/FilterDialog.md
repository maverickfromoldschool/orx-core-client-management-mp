# FilterDialog Component

A drawer component for filtering accounting code data with multiple filter fields. The filter panel slides in from the right side of the screen.

## Features

- **Side Panel Design**: Uses MUI Drawer for a non-intrusive filtering experience
- **Multiple Filter Fields**: Supports filtering by:
  - Accounting Code
  - Description
  - GL Account Type
  - GL Account Name
  - GL Account Number
  - GL Account Group

- **User-Friendly Interface**: Clean, drawer-based design with clear labels and placeholders
- **Scrollable Content**: Long filter lists scroll independently while keeping header and footer visible
- **Action Buttons**: Filter and Clear buttons for applying or resetting filters
- **Persistent State**: Maintains filter values until explicitly cleared
- **Responsive Design**: Full width on mobile, fixed 400px width on larger screens

## Usage

```tsx
import {FilterDialog, FilterValues} from '@optum-rx/accounting-code';

function MyComponent() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    accountingCode: '',
    description: '',
    glAccountType: '',
    glAccountName: '',
    glAccountNumber: '',
    glAccountGroup: ''
  });

  const handleFilterApply = (newFilters: FilterValues) => {
    setFilters(newFilters);
    // Apply filters to your data
    console.log('Filters applied:', newFilters);
  };

  const handleFilterClear = () => {
    setFilters({
      accountingCode: '',
      description: '',
      glAccountType: '',
      glAccountName: '',
      glAccountNumber: '',
      glAccountGroup: ''
    });
    // Clear filters from your data
  };

  return (
    <>
      <Button onClick={() => setFilterOpen(true)}>
        Open Filters
      </Button>
      
      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        initialValues={filters}
      />
    </>
  );
}
```

## Props

### FilterDialogProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Controls the visibility of the dialog |
| `onClose` | `() => void` | Yes | Callback when the dialog should close |
| `onApply` | `(filters: FilterValues) => void` | Yes | Callback when filters are applied |
| `onClear` | `() => void` | Yes | Callback when filters are cleared |
| `initialValues` | `Partial<FilterValues>` | No | Initial filter values to populate the form |

### FilterValues

```typescript
interface FilterValues {
  accountingCode: string;
  description: string;
  glAccountType: string;
  glAccountName: string;
  glAccountNumber: string;
  glAccountGroup: string;
}
```

## Integration with AccountingCodeList

The FilterDialog is automatically integrated with the AccountingCodeList component:

```tsx
import {AccountingCodeList} from '@optum-rx/accounting-code';

function MyPage() {
  const handleFilterApply = (filters: FilterValues) => {
    // Filter your data based on the applied filters
    const filteredData = data.filter(item => {
      if (filters.accountingCode && !item.accountingCode.includes(filters.accountingCode)) {
        return false;
      }
      if (filters.description && !item.description.includes(filters.description)) {
        return false;
      }
      // Add more filter logic as needed
      return true;
    });
    
    setData(filteredData);
  };

  return (
    <AccountingCodeList
      data={data}
      onFilterApply={handleFilterApply}
      // ... other props
    />
  );
}
```

## Styling

The FilterDialog follows the Optum Rx Skyline design system:
- Uses Material-UI Drawer component for side panel behavior
- Slides in from the right side of the screen
- Consistent spacing and typography
- Branded colors (#002677 for headers, #003087 for primary actions)
- Scrollable content area with fixed header and footer
- Subtle shadows and dividers
- Accessible focus states
- Responsive width (100% on mobile, 400px on desktop)

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management when opening/closing
- Clear visual feedback for interactive elements
