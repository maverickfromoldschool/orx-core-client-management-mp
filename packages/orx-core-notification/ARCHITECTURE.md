# Architecture Documentation

## Overview

The `@optum-rx-core/orx-core-notification` package is designed following SOLID principles and industry best practices. This document explains the architectural decisions and design patterns used.

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)

Each module has a single, well-defined responsibility:

- **NotificationFactory** - Creating notification objects
- **NotificationItem** - Rendering individual notifications
- **NotificationContainer** - Managing notification display
- **NotificationProvider** - Providing context to the application
- **useNotificationState** - Managing notification state
- **useNotification** - Public API for consumers
- **constants** - Configuration management

### Open/Closed Principle (OCP)

The system is open for extension but closed for modification:

- Notifications can be extended with custom options without modifying core logic
- New notification types can be added by extending interfaces
- Custom icons and actions can be provided without changing components
- Position and styling can be customized without altering the base implementation

### Liskov Substitution Principle (LSP)

Components can be substituted with minimal impact:

- The notification context can be replaced with a mock for testing
- Components depend on interfaces, not concrete implementations
- Hook implementations can be swapped without affecting consumers

### Interface Segregation Principle (ISP)

Interfaces are focused and clients aren't forced to depend on unused methods:

- `NotificationOptions` uses optional properties
- Different severity methods (`showSuccess`, `showError`) provide focused APIs
- Components receive only the props they need
- Test utilities provide specific helper functions

### Dependency Inversion Principle (DIP)

High-level modules depend on abstractions:

- Components depend on `NotificationContext` (abstraction), not concrete state
- The provider implements the context interface
- Consumers use the `useNotification` hook (abstraction) rather than accessing context directly

## Design Patterns

### Context Pattern

**Purpose:** Share notification state across the component tree without prop drilling

**Implementation:**
- `NotificationContext` provides the notification API
- `NotificationProvider` manages state and provides context value
- `useNotification` hook abstracts context consumption

### Factory Pattern

**Purpose:** Encapsulate notification object creation

**Implementation:**
- `NotificationFactory` creates notification objects with proper defaults
- Generates unique IDs for each notification
- Validates and normalizes options

### Observer Pattern (Implicit)

**Purpose:** Components react to notification state changes

**Implementation:**
- React's state management updates subscribers
- Components re-render when notifications array changes
- Auto-hide timers observe notification lifecycle

### Composition Pattern

**Purpose:** Build complex functionality from simple components

**Implementation:**
- `NotificationContainer` composes multiple `NotificationItem` components
- Each item is independent and self-managing
- Provider composes state management with UI rendering

## Module Structure

```
src/
├── index.ts                    # Public API exports
├── types.ts                    # Type definitions
├── constants.ts                # Configuration constants
├── components/                 # React components
│   ├── index.ts
│   ├── NotificationItem.tsx    # Individual notification
│   └── NotificationContainer.tsx # Container for all notifications
├── context/                    # React context
│   └── NotificationContext.tsx # Context definition and hook
├── hooks/                      # Custom hooks
│   ├── index.ts
│   ├── useNotification.ts      # Public API hook
│   └── useNotificationState.ts # State management hook
├── provider/                   # Context provider
│   └── NotificationProvider.tsx # Main provider component
└── utils/                      # Utilities
    ├── index.ts
    └── notification-factory.ts # Factory for creating notifications
```

## Data Flow

```
User Action
    ↓
useNotification hook
    ↓
NotificationProvider (state update)
    ↓
NotificationContext (broadcast change)
    ↓
NotificationContainer (re-render)
    ↓
NotificationItem[] (render notifications)
```

## State Management

### State Shape

```typescript
{
  notifications: Notification[] // Array of active notifications
}
```

### State Updates

1. **Add Notification**: `addNotification(message, options)`
   - Creates notification via factory
   - Adds to notifications array
   - Enforces max notification limit
   - Returns notification ID

2. **Remove Notification**: `removeNotification(id)`
   - Filters out notification by ID
   - Updates state

3. **Clear All**: `clearAll()`
   - Resets notifications to empty array

## Performance Optimizations

### React.memo

Not currently used but can be added to:
- `NotificationItem` - Prevent re-renders when other notifications change
- `NotificationContainer` - Prevent re-renders when props haven't changed

### useCallback

Used extensively to prevent unnecessary re-renders:
- All notification methods are wrapped in `useCallback`
- State setters use functional updates
- Event handlers are memoized

### useMemo

Used to create stable context value:
- Context value is memoized with all dependencies
- Prevents consumer re-renders when dependencies haven't changed

### Efficient Updates

- Uses array filtering instead of mutation
- Limits notifications to prevent performance issues
- Auto-hide timers are cleaned up properly

## Testing Strategy

### Unit Tests

- Test each module in isolation
- Mock dependencies
- Cover edge cases and error conditions

### Integration Tests

- Test provider with consumer components
- Test complete user workflows
- Verify context integration

### Test Utilities

- Custom render function with provider
- Mock notification options
- Helper functions for common test scenarios

## Extensibility

### Adding New Features

1. **New notification types:**
   - Extend `NotificationSeverity` type
   - Add icon mapping in `NotificationItem`
   - Create convenience method in provider

2. **Custom styling:**
   - Extend `NotificationOptions` with style props
   - Pass to MUI components
   - Document in README

3. **Animation customization:**
   - Add animation options to constants
   - Update transition props in container
   - Maintain backward compatibility

### Custom Implementations

The architecture allows for:
- Custom notification renderers
- Different storage mechanisms (localStorage, IndexedDB)
- Sound notifications
- Desktop notifications
- Analytics integration

## Type Safety

### Strict TypeScript

- Strict mode enabled
- No implicit any
- Comprehensive type definitions
- JSDoc comments for better IDE support

### Type Exports

All types are exported for consumer use:
- `NotificationSeverity`
- `NotificationPosition`
- `NotificationOptions`
- `Notification`
- `NotificationContextValue`

## Error Handling

### Provider Context Check

```typescript
if (!context) {
  throw new Error(
    'useNotificationContext must be used within a NotificationProvider.'
  );
}
```

### Graceful Degradation

- Invalid notification IDs are silently ignored
- Missing options use sensible defaults
- Auto-hide duration of 0 means persist

## Accessibility

### ARIA Support

- Uses MUI's accessible Alert component
- Proper role attributes
- Screen reader announcements
- Keyboard navigation support

### Focus Management

- Close buttons are keyboard accessible
- Action buttons maintain focus order
- Notifications don't trap focus

## Future Enhancements

Potential additions while maintaining SOLID principles:

1. **Notification Queue** - Advanced queuing strategies
2. **Sound Support** - Audio notifications
3. **Desktop Notifications** - Browser notification API
4. **Analytics** - Track notification interactions
5. **Theming** - Custom themes per notification
6. **Animations** - More transition options
7. **Grouping** - Group similar notifications
8. **History** - Store dismissed notifications

Each enhancement would be:
- **Single Responsibility** - Separate module
- **Open/Closed** - Extend without modifying core
- **Interface Segregation** - Optional features
- **Dependency Inversion** - Plugin architecture
