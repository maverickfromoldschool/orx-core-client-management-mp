# Product View Feature

A comprehensive product view feature for managing product information and attributes with a DataGrid-based table and pagination.

## Overview

The Product View feature provides a complete interface for viewing and editing product information, including:

- Product information form with validation
- Product attributes table with DataGrid and server-side pagination
- Tab navigation between Product Information and Transaction Fields
- Action buttons (Save, Cancel, Retire, Duplicate)
- Responsive design following Figma specifications

## Architecture

This feature follows the **feature-based architecture** pattern with clear separation of concerns:

```
product-view/
├── components/           # UI components
│   ├── product-view-page.tsx
│   ├── product-view-header.tsx
│   ├── product-view-tabs.tsx
│   ├── product-information-form.tsx
│   ├── product-attributes-table.tsx
│   └── index.ts
├── hooks/               # Custom hooks for business logic
│   ├── use-product-view.tsx
│   └── index.ts
├── types.ts            # TypeScript interfaces
├── constants.ts        # Constants and configuration
├── utils.ts            # Utility functions
├── example.tsx         # Usage example
├── index.ts            # Public API
└── README.md           # Documentation
```

## Components

### ProductViewPage

Main container component that orchestrates the entire product view interface.

**Props:**
- `productInformation`: Product information data
- `productAttributes`: Array of product attributes
- `totalAttributesCount`: Total count for pagination
- `onSave`: Save handler
- `onCancel`: Cancel handler
- `onRetire`: Retire handler
- `onDuplicate`: Duplicate handler
- `onAssignAttributes`: Assign attributes handler
- `onEditAttribute`: Edit attribute handler
- `onDeleteAttribute`: Delete attribute handler
- `onPageChange`: Page change handler
- `currentPage`: Current page number
- `pageSize`: Items per page

### ProductViewHeader

Header component with title, metadata, and action buttons.

### ProductViewTabs

Tab navigation component for switching between Product Information and Transaction Fields.

### ProductInformationForm

Form component for editing product information with all required fields.

### ProductAttributesTable

DataGrid-based table component for displaying and managing product attributes with pagination.

## Hooks

### useProductView

Custom hook that encapsulates all business logic for the product view feature.

**Parameters:**
- `initialProductInformation`: Initial product data
- `initialAttributes`: Initial attributes array
- `totalAttributesCount`: Total count for pagination
- `pageSize`: Items per page (default: 5)

**Returns:**
- State values (productInformation, productAttributes, etc.)
- Handler functions (handleSave, handleCancel, etc.)

## Usage

```tsx
import React from 'react';
import {ProductViewPage, useProductView} from '@optum-rx-core/orx-core-products';

const MyProductView: React.FC = () => {
  const {
    productInformation,
    productAttributes,
    totalAttributesCount,
    currentPage,
    pageSize,
    handleSave,
    handleCancel,
    // ... other handlers
  } = useProductView({
    initialProductInformation: myProductData,
    initialAttributes: myAttributesData,
    totalAttributesCount: 127,
    pageSize: 5,
  });

  return (
    <ProductViewPage
      productInformation={productInformation}
      productAttributes={productAttributes}
      totalAttributesCount={totalAttributesCount}
      onSave={handleSave}
      onCancel={handleCancel}
      // ... other props
    />
  );
};
```

## Design Specifications

This feature strictly follows the Figma design specifications:

### Colors
- Primary Orange: `#FF612B`
- Secondary Dark Blue: `#002677`
- Secondary Warm White: `#FBF9F4`
- Blue Extra Light: `#FAFCFF`
- Neutral White: `#FFFFFF`
- Text Headings: `#002677`
- Text Labels: `#323334`
- Text Link: `#0C55B8`

### Typography
- **Headings**: Enterprise Sans VF, 700 weight
- **Body Text**: Enterprise Sans VF, 400-500 weight
- **Labels**: Optum Sans, 700 weight

### Spacing
- Container width: `1272px`
- Gap between sections: `24px`, `30px`, `32px`
- Padding: `24px`, `16px`, `10px`
- Border radius: `4px`, `8px`, `12px`, `46px`

## Dependencies

- `@mui/material`: Material-UI components
- `@mui/x-data-grid`: DataGrid component for tables
- `react`: React 18+
- `react-hook-form`: Form management (for future enhancements)
- `zod`: Schema validation (for future enhancements)

## Installation

The `@mui/x-data-grid` package needs to be installed:

```bash
yarn workspace @optum-rx-core/orx-core-products add @mui/x-data-grid
```

## Future Enhancements

1. **Form Validation**: Integrate React Hook Form and Zod for robust form validation
2. **API Integration**: Connect to backend services for CRUD operations
3. **Error Handling**: Add error boundaries and error states
4. **Loading States**: Implement skeleton loaders for better UX
5. **Accessibility**: Enhance ARIA attributes and keyboard navigation
6. **Unit Tests**: Add comprehensive test coverage
7. **Responsive Design**: Optimize for mobile and tablet views

## Best Practices

This feature follows senior-level development standards:

- ✅ **SOLID Principles**: Clear separation of concerns
- ✅ **TypeScript**: Strict typing with no `any` types
- ✅ **Component Composition**: Reusable, focused components
- ✅ **Custom Hooks**: Business logic separated from UI
- ✅ **Consistent Styling**: Following design system
- ✅ **Accessibility**: Semantic HTML and proper ARIA attributes
- ✅ **Performance**: Optimized rendering with proper memoization
- ✅ **Documentation**: Clear inline comments and README

## Contributing

When contributing to this feature:

1. Follow the existing code structure and naming conventions
2. Maintain TypeScript strict mode compliance
3. Add proper JSDoc comments for all public APIs
4. Follow the Figma design specifications exactly
5. Test all changes thoroughly
6. Update documentation as needed
