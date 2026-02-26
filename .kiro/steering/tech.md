# Technology Stack

## Build System & Package Management

- **Monorepo Tool**: Lerna 8.x with Yarn workspaces
- **Package Manager**: Yarn 3.x (Berry) with PnP
- **Node Version**: 18.x or higher
- **Versioning**: Independent versioning per package

## Core Technologies

- **Language**: TypeScript 5.5.4
- **UI Framework**: React 18.2.0
- **Component Library**: Material-UI (MUI) 5.10.0
- **Design System**: @optum-rx-skyline/components
- **Styling**: Emotion (@emotion/react, @emotion/styled)
- **Build Tool**: Vite 6.x (for webcomponents)
- **Bundler**: TypeScript compiler (tsc) for core packages

## Testing

- **Test Runner**: Jest 29.x with ts-jest
- **Test Environment**: jsdom
- **Testing Library**: @testing-library/react 16.x
- **E2E Testing**: Cypress (component testing)
- **Coverage Target**: 80%+ average

## Code Quality

- **Linter**: ESLint 8.x with @uhg-skyline/eslint-plugin-optum
- **Formatter**: Prettier 3.x with @uhg-skyline/prettier
- **Git Hooks**: Husky 8.x
- **TypeScript Config**: Extends @uhg-skyline/typescript

## Key Libraries

- **HTTP Client**: Axios 1.13.5
- **Form Handling**: react-hook-form 7.x
- **Validation**: Zod 3.24.1
- **Routing**: react-router-dom 6.x
- **Date Handling**: date-fns 4.1.0

## Common Commands

### Development
```bash
# Install dependencies
yarn install

# Run specific package in dev mode
yarn workspace @optum-rx-core/<package-name>-webcomponent dev

# Shortcuts for common packages
yarn cm:dev    # Client Management
yarn fc:dev    # File Center
yarn as:dev    # Admin Settings
yarn pr:dev    # Products

# Run Storybook
yarn storybook
```

### Building
```bash
# Build all packages
yarn build:all

# Build specific package
yarn workspace @optum-rx-core/<package-name> build
```

### Testing
```bash
# Run all tests with coverage
yarn test

# Run Cypress component tests
yarn cy              # Interactive mode
yarn cy:run          # Headless mode
yarn cy:run:ci       # CI mode
```

### Code Quality
```bash
# Lint code
yarn lint
yarn lint:fix

# Format code
yarn format
yarn format:check
```

### Release & Versioning
```bash
# Generate release JSON (for mixed releases)
yarn release

# Note: Version bumps are automated via GitHub Actions
# - Prereleases: Automatic on PR merge to main
# - Release Candidates: Use GitHub workflow (Major/Minor/Mixed Release)
# - Hotfixes: PR to release branch triggers patch bump
```

## CI/CD

- **Platform**: GitHub Actions
- **Branching**: Trunk-based (main branch)
- **Merge Strategy**: Squash merge only
- **Publishing**: Automated to Artifactory on release
- **Prerelease**: Automatic version bump with `-next.` tag on main branch merges
