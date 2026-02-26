# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-01-17

### Changed
- **BREAKING**: Message parameter now accepts `React.ReactNode` instead of `string`
- Updated all notification methods to support React elements for rich text formatting
- Enhanced documentation with React.ReactNode examples

### Migration
```tsx
// Still works (backward compatible)
showSuccess('Simple message');

// Now also supports React elements
showSuccess(<><strong>Bold</strong> message</>);
```

## [1.0.0] - 2026-01-17

### Added
- Initial release of notification system
- MUI v5 Snackbar integration
- React Context and hooks-based architecture
- TypeScript support with comprehensive type definitions
- Multiple notification severities (success, error, warning, info)
- Configurable notification positioning (9 positions)
- Auto-hide duration configuration
- Persistent notification support
- Action button support with callbacks
- Custom icon support
- Close individual or all notifications
- Maximum notification limit (3 notifications)
- Comprehensive documentation and examples
- Unit tests with high coverage
- SOLID principles compliance
- Accessibility features (ARIA-compliant)

### Features
- `NotificationProvider` - Context provider component
- `useNotification` - Main hook for notification management
- `showSuccess()` - Display success notifications
- `showError()` - Display error notifications
- `showWarning()` - Display warning notifications
- `showInfo()` - Display info notifications
- `showNotification()` - Display custom notifications
- `closeNotification()` - Close specific notification
- `closeAll()` - Close all notifications
- Notification stacking with visual separation
- Smooth transitions and animations
- Responsive design

### Architecture
- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Factory pattern for notification creation
- Context pattern for state management
- Custom hooks for encapsulation
