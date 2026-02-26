# Product Overview

This is an OptumRx micro-product monorepo containing multiple React-based packages for healthcare administration and management features.

## Core Packages

The repository contains several domain-specific packages:

- **orx-core-admin-settings**: Administrative settings and configuration management (accounting codes, attributes, bill cycles)
- **orx-core-client-management**: Client management functionality
- **orx-core-file-center**: File management and document handling
- **orx-core-products**: Product catalog and management
- **orx-core-pricing**: Pricing configuration and management
- **orx-core-notification**: Notification system
- **orx-core-client-shared**: Shared utilities and components
- **orx-core-axios**: HTTP client wrapper

## Package Structure

Each feature typically has two packages:
1. Core package (e.g., `orx-core-admin-settings`): Business logic and components
2. Webcomponent package (e.g., `orx-core-admin-settings-webcomponent`): Standalone web component wrapper with Vite build

## Target Environment

- Browser support: Chrome 79+, Safari 12+, Edge 17+, IE 11, Firefox 69+, iOS 13+
- Node.js: 18.x or higher
- Internal OptumRx platform with Artifactory registry
