# Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Your Application                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ wraps with
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NotificationProvider                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Context Value (NotificationContextValue)                 │  │
│  │  - showNotification()                                     │  │
│  │  - showSuccess(), showError(), showWarning(), showInfo() │  │
│  │  - closeNotification()                                    │  │
│  │  - closeAll()                                             │  │
│  │  - notifications: Notification[]                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐  ┌────────────────────────────┐
│   Component Tree          │  │  NotificationContainer     │
│   (Your Components)       │  │  ┌──────────────────────┐  │
│                           │  │  │  NotificationItem    │  │
│  uses useNotification()   │  │  │  - Auto-hide timer   │  │
│                           │  │  │  - Close button      │  │
│                           │  │  │  - Action button     │  │
│                           │  │  │  - Severity styling  │  │
│                           │  │  └──────────────────────┘  │
│                           │  │  ┌──────────────────────┐  │
│                           │  │  │  NotificationItem    │  │
│                           │  │  └──────────────────────┘  │
│                           │  │  ┌──────────────────────┐  │
│                           │  │  │  NotificationItem    │  │
│                           │  │  └──────────────────────┘  │
└───────────────────────────┘  └────────────────────────────┘
```

## Data Flow

```
┌─────────────────┐
│  User Action    │
│  (onClick, etc) │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│  useNotification hook        │
│  showSuccess('Message')      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  NotificationProvider        │
│  - Receives message          │
│  - Creates notification ID   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  NotificationFactory         │
│  - Generates unique ID       │
│  - Applies default options   │
│  - Returns Notification obj  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  useNotificationState        │
│  - Adds to notifications[]   │
│  - Enforces max limit (3)    │
│  - Triggers re-render        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  NotificationContainer       │
│  - Receives notifications[]  │
│  - Maps to NotificationItem  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  NotificationItem            │
│  - Renders MUI Alert         │
│  - Sets auto-hide timer      │
│  - Handles close action      │
└──────────────────────────────┘
         │
         │ (After duration)
         ▼
┌──────────────────────────────┐
│  Auto-hide or User Close     │
│  closeNotification(id)       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Remove from state           │
│  - Filter notifications[]    │
│  - Trigger re-render         │
└──────────────────────────────┘
```

## Module Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                         index.ts                             │
│                     (Public API)                             │
└────────────┬───────────────────────────────────────┬────────┘
             │                                       │
     ┌───────┴────────┐                     ┌───────┴────────┐
     │                │                     │                │
┌────▼─────┐  ┌──────▼────────┐  ┌────────▼──────┐  ┌──────▼──────┐
│  types   │  │   provider    │  │     hooks     │  │  constants  │
└──────────┘  │  (Provider)   │  │ (useNotif)    │  └─────────────┘
              └───────┬───────┘  └───────┬───────┘
                      │                  │
              ┌───────┴────────┐ ┌──────┴────────┐
              │                │ │               │
        ┌─────▼──────┐  ┌──────▼─▼────────┐  ┌──▼──────────┐
        │  context   │  │     hooks       │  │   utils     │
        │ (Context)  │  │ (useNotifState) │  │  (Factory)  │
        └────────────┘  └─────────────────┘  └─────────────┘
                                │
                        ┌───────┴────────┐
                        │                │
                  ┌─────▼──────┐  ┌──────▼─────────┐
                  │ components │  │   constants    │
                  │  (Item,    │  └────────────────┘
                  │ Container) │
                  └────────────┘
```

## SOLID Principles Mapping

```
┌─────────────────────────────────────────────────────────────┐
│        Single Responsibility Principle (SRP)                 │
├─────────────────────────────────────────────────────────────┤
│  NotificationFactory      → Create notifications            │
│  NotificationItem         → Render single notification      │
│  NotificationContainer    → Manage display layout           │
│  useNotificationState     → Manage state logic              │
│  NotificationProvider     → Provide context                 │
│  useNotification          → Public API                      │
│  constants                → Configuration                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         Open/Closed Principle (OCP)                          │
├─────────────────────────────────────────────────────────────┤
│  ✅ Open for extension                                      │
│     - Custom options (position, duration, etc)              │
│     - Custom icons                                          │
│     - Action buttons                                        │
│  ✅ Closed for modification                                 │
│     - Core logic is stable                                  │
│     - New features don't require changing existing code     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│      Liskov Substitution Principle (LSP)                     │
├─────────────────────────────────────────────────────────────┤
│  ✅ Context can be mocked for testing                       │
│  ✅ Components depend on interfaces                         │
│  ✅ Substitutable implementations                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│      Interface Segregation Principle (ISP)                   │
├─────────────────────────────────────────────────────────────┤
│  ✅ Focused methods (showSuccess, showError, etc)           │
│  ✅ Optional properties in NotificationOptions              │
│  ✅ Clients only use what they need                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│      Dependency Inversion Principle (DIP)                    │
├─────────────────────────────────────────────────────────────┤
│  ✅ Components depend on Context (abstraction)              │
│  ✅ useNotification hook (abstraction)                      │
│  ✅ No direct state access from components                  │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
<NotificationProvider>
  │
  ├── <YourApp />
  │   └── <YourComponents />
  │       └── useNotification() ← consumes context
  │
  └── <NotificationContainer>
      └── <Stack>
          ├── <NotificationItem notification={notifications[0]} />
          │   └── <Alert severity="success">
          │       ├── <AlertIcon />
          │       ├── Message
          │       └── Actions
          │           ├── <Button> (optional action)
          │           └── <IconButton> (close)
          │
          ├── <NotificationItem notification={notifications[1]} />
          └── <NotificationItem notification={notifications[2]} />
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Initial State                           │
│  notifications: []                                          │
└────────┬────────────────────────────────────────────────────┘
         │
         │ showSuccess('Message')
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Create Notification                        │
│  NotificationFactory.create('Message', options)             │
│  → { id: 'abc123', message: 'Message', options: {...} }    │
└────────┬────────────────────────────────────────────────────┘
         │
         │ addNotification()
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Update State                              │
│  setNotifications(prev => [...prev, notification])          │
│  → Apply max limit (3)                                      │
└────────┬────────────────────────────────────────────────────┘
         │
         │ Context update
         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Re-render Consumers                         │
│  NotificationContainer receives new notifications[]         │
│  → Maps to NotificationItem components                      │
└────────┬────────────────────────────────────────────────────┘
         │
         │ Auto-hide timer expires
         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Remove Notification                         │
│  removeNotification(id)                                     │
│  setNotifications(prev => prev.filter(n => n.id !== id))   │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Updated State                             │
│  notifications: [remaining notifications]                   │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────────┐
│                   useCallback                                │
├─────────────────────────────────────────────────────────────┤
│  ✅ showNotification                                        │
│  ✅ showSuccess, showError, showWarning, showInfo           │
│  ✅ closeNotification                                       │
│  ✅ closeAll                                                │
│  ✅ addNotification                                         │
│  ✅ removeNotification                                      │
│  ✅ clearAll                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     useMemo                                  │
├─────────────────────────────────────────────────────────────┤
│  ✅ Context value (prevents unnecessary re-renders)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 Other Optimizations                          │
├─────────────────────────────────────────────────────────────┤
│  ✅ Notification limit (max 3)                              │
│  ✅ Automatic timer cleanup                                 │
│  ✅ Efficient array filtering                               │
│  ✅ Functional state updates                                │
└─────────────────────────────────────────────────────────────┘
```

## Testing Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Unit Tests                              │
├─────────────────────────────────────────────────────────────┤
│  notification-factory.test.ts                               │
│  - Create with defaults                                     │
│  - Create with custom options                               │
│  - Generate unique IDs                                      │
│  - Handle persist option                                    │
│  - Include actions and icons                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Hook Tests                              │
├─────────────────────────────────────────────────────────────┤
│  useNotificationState.test.ts                               │
│  - Initialize empty                                         │
│  - Add notification                                         │
│  - Remove notification                                      │
│  - Clear all                                                │
│  - Enforce max limit                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Integration Tests                           │
├─────────────────────────────────────────────────────────────┤
│  NotificationProvider.test.tsx                              │
│  - Show all severity types                                  │
│  - Close specific notification                              │
│  - Close all notifications                                  │
│  - Track notification count                                 │
│  - Error when used outside provider                         │
└─────────────────────────────────────────────────────────────┘
```
