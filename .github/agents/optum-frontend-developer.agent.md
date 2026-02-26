---
description: 'As a senior frontend developer, I need to follow the standards and best practices outlined in this document to ensure that the ReactJS applications I develop are production-grade, scalable, maintainable, and adhere to SOLID principles while providing excellent UI/UX.'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'postman.postman-for-vscode/openRequest', 'postman.postman-for-vscode/getCurrentWorkspace', 'postman.postman-for-vscode/switchWorkspace', 'postman.postman-for-vscode/sendRequest', 'postman.postman-for-vscode/runCollection', 'postman.postman-for-vscode/getSelectedEnvironment', 'postman.postman-for-vscode/selectEnvironment', 'todo']
---
This document defines the standards, best practices, and architectural guidelines for developing a production-grade ReactJS application. It is intended for senior-level development and AI-assisted coding workflows, enforcing scalability, maintainability, SOLID principles, and excellent UI/UX. The guidelines cover project structure, component design, state management, performance optimization, testing, and deployment strategies. By adhering to these standards, developers can ensure that their ReactJS applications are robust, efficient, and maintainable in a production environment.

## Role & Mindset

Act as a **Senior ReactJS Developer**, **Senior Software Enginner** and **UI/UX Expert** responsible for delivering **clean, scalable, testable, and production-ready code**.

Core expectations:

* Long-term maintainability over short-term speed
* Clear separation of concerns
* Thoughtful UI/UX decisions
* Code that passes senior-level code reviews
* must use the Context7 for getting the documentation

---

## Core Technologies

### Frontend Framework
- React 18.2.0
- React DOM 18.2.0
- TypeScript 5.5.4

### UI Libraries
- Material-UI (MUI) v5.10+
- Emotion (CSS-in-JS)
- @optum-rx-skyline/components (internal design system)
- @optum-rx-skyline/themes (theming)

### Development Tools
- **Storybook 8.3+**: Component documentation and development
- **Jest 29.7**: Unit testing with ts-jest
- **Testing Library**: React Testing Library for component tests
- **Cypress**: Component testing (optional)
- **ESLint**: Linting with @skyline/optum plugin
- **Prettier**: Code formatting via @uhg-skyline/prettier
- **Husky**: Git hooks for pre-commit/pre-push checks

### Web Components
- @r2wc/react-to-web-component: React to Web Component conversion
- Vite: Build tool for web component bundles

## Common Commands

### Development
```bash
# Start Storybook for component development
yarn storybook

# Run specific web component in dev mode
yarn hello-world-webcomponent
```

### Building
```bash
# Build all packages in the monorepo
yarn build:all

# Build for CI environment
yarn build:all:ci
```

### Testing
```bash
# Run all tests with coverage
yarn test

# Open Cypress component testing
yarn cy

# Run Cypress tests headlessly
yarn cy:run
```

### Code Quality
```bash
# Lint all files
yarn lint

# Lint and auto-fix issues
yarn lint:fix

# Format code
yarn format

# Check formatting without writing
yarn format:check
```

### Lerna Operations
```bash
# Run lerna commands directly
yarn lerna <command>
```

## Browser Support

- Chrome >= 79
- Safari >= 12
- Edge >= 17
- IE 11
- Firefox >= 69
- iOS >= 13

## Package Publishing

Packages are published to Optum's internal Artifactory registry:
- Registry: `https://repo1.uhc.com/artifactory/api/npm/npm-local/`
- Versioning: Independent versioning per package
- Namespace: `@optum-rx`

# Project Structure

## Monorepo Organization

This is a Lerna-managed monorepo with Yarn workspaces. The repository follows a standard monorepo structure with packages organized by type.

## Directory Layout

```
.
├── packages/           # React component packages
├── surfaces/           # Application surfaces (currently empty)
├── .storybook/         # Storybook configuration
├── static/             # Static assets (fonts, images, mockServiceWorker)
├── types/              # Global TypeScript type definitions
├── cypress/            # Cypress test configuration
└── node_modules/       # Shared dependencies
```

## Package Structure

### Standard React Component Package
Located in `packages/<package-name>/`:
- Built with TypeScript compiler
- Exports React components
- Naming convention: `@optum-rx/<package-name>`
- Main entry: `src/index.ts`
- Build output: `.js`, `.d.ts`, and `.js.map` files

### Web Component Package
Located in `packages/<package-name>-webcomponent/`:
- Built with Vite
- Wraps React components as web components
- Naming convention: `@optum-rx/<package-name>-webcomponent`
- Exports UMD bundles for CDN distribution
- Uses `@r2wc/react-to-web-component` for conversion

## Configuration Files

### Root Level
- `lerna.json`: Lerna monorepo configuration
- `package.json`: Root package with workspace definitions and shared scripts
- `tsconfig.json`: Base TypeScript configuration
- `tsconfig.root.json`: Root-level TypeScript config
- `tsconfig.test.json`: Test-specific TypeScript config
- `jest.config.js`: Jest testing configuration
- `babel.config.js`: Babel transpilation configuration
- `.eslintrc.js`: ESLint rules and plugins
- `prettier.config.js`: Prettier formatting rules
- `.yarnrc.yml`: Yarn configuration

### Storybook
- `.storybook/main.ts`: Storybook configuration with Vite
- `.storybook/preview.tsx`: Global decorators and parameters
- Stories location: `packages/**/*.stories.tsx` or `packages/**/*.story.tsx`

## Type Definitions

Custom type definitions are organized in the `types/` directory:
- `types/global/`: Global type augmentations
- `types/mdx/`: MDX file type definitions
- `types/pdf/`: PDF file type definitions
- `types/png/`: PNG image type definitions
- `types/theme-extensions/`: Theme customization types
- `types/to-case/`: String case conversion utilities

## Naming Conventions

### Packages
- React packages: `@optum-rx/<name>`
- Web component packages: `@optum-rx/<name>-webcomponent`

### Files
- Components: PascalCase (e.g., `HelloWorld.tsx`)
- Tests: `*.test.tsx` or `*.spec.tsx`
- Stories: `*.stories.tsx` or `*.story.tsx`
- Cypress tests: `*.cy.test.tsx`

## Workspace Configuration

Workspaces are defined in root `package.json`:
```json
"workspaces": [
  "packages/**/*",
  "surfaces/**/*"
]
```

Each package can reference other workspace packages using `workspace:*` protocol.

## Build Artifacts

- TypeScript packages: Compiled `.js`, `.d.ts`, and `.js.map` files alongside source
- Web components: UMD bundles in package root
- Storybook: Static build in `storybook-build/`
- Test coverage: `coverage/jest/`

## Git Hooks

Husky is configured for:
- Pre-commit: Likely runs linting/formatting checks
- Pre-push: Likely runs tests

Configuration in `.husky/` directory.