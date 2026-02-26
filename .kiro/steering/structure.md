# Project Structure

## Repository Layout

```
.
├── packages/              # Core business logic packages
├── surfaces/              # Surface-level applications (if any)
├── .storybook/           # Storybook configuration
├── .github/              # GitHub Actions workflows
├── .husky/               # Git hooks
├── .kiro/                # Kiro AI assistant configuration
├── doc/                  # Documentation
├── dist/                 # Build output
└── node_modules/         # Dependencies
```

## Package Organization

### Naming Convention

Packages follow the pattern: `@optum-rx-core/orx-core-<feature-name>`

### Package Types

1. **Core Packages** (`packages/orx-core-<feature>/`)
   - Business logic, hooks, and React components
   - Built with TypeScript compiler (tsc)
   - Published to Artifactory
   - Example: `packages/orx-core-admin-settings/`

2. **Webcomponent Packages** (`packages/orx-core-<feature>-webcomponent/`)
   - Standalone web component wrappers
   - Built with Vite
   - Includes dev server and bundle analysis
   - Example: `packages/orx-core-admin-settings-webcomponent/`

3. **Shared Packages**
   - `orx-core-client-shared`: Common utilities and components
   - `orx-core-axios`: HTTP client wrapper
   - `orx-core-notification`: Notification system

### Standard Package Structure

```
packages/orx-core-<feature>/
├── src/
│   ├── components/       # React components
│   ├── <feature>-page/   # Page-level components
│   │   ├── <Feature>Page/
│   │   │   ├── <feature>-page.tsx
│   │   │   ├── <feature>-page.test.tsx
│   │   │   └── <feature>-page.stories.tsx
│   │   └── use<Feature>Page/
│   │       ├── use-<feature>-page.ts
│   │       └── use-<feature>-page.test.ts
│   ├── assets/           # Static assets (SVG, images)
│   └── index.ts          # Public API exports
├── package.json
├── tsconfig.json
├── CHANGELOG.md
└── README.md
```

### Webcomponent Package Structure

```
packages/orx-core-<feature>-webcomponent/
├── src/
│   ├── main.tsx          # Entry point
│   └── <feature>-app.tsx # App wrapper
├── index.html            # Dev server HTML
├── vite.config.ts        # Vite configuration
├── sizeLimitPlugin.ts    # Bundle size analysis
├── package.json
└── tsconfig.json
```

## File Naming Conventions

- **Components**: PascalCase for folders and files
  - `ComponentName/component-name.tsx`
  - `ComponentName/component-name.test.tsx`
  - `ComponentName/component-name.stories.tsx`

- **Hooks**: camelCase with `use` prefix
  - `useFeatureName/use-feature-name.ts`
  - `useFeatureName/use-feature-name.test.ts`

- **Types**: kebab-case with `.types.ts` suffix
  - `component-name.types.ts`

- **Test Files**: Same name as source with `.test.tsx` or `.test.ts`
- **Story Files**: Same name as source with `.stories.tsx` or `.story.tsx`

## Workspace Dependencies

Use `workspace:*` protocol for internal package dependencies:

```json
{
  "dependencies": {
    "@optum-rx-core/orx-core-client-shared": "workspace:*"
  }
}
```

## Import Patterns

- **MUI Icons**: Import individually to reduce bundle size
  ```typescript
  // ✅ Correct
  import DeleteIcon from '@mui/icons-material/Delete';
  
  // ❌ Incorrect
  import { Delete } from '@mui/icons-material';
  ```

- **Internal Packages**: Use package name, not relative paths
  ```typescript
  // ✅ Correct
  import { utility } from '@optum-rx-core/orx-core-client-shared';
  
  // ❌ Incorrect (across packages)
  import { utility } from '../../orx-core-client-shared/src/utility';
  ```

## Configuration Files

- **Root Level**: Shared configuration for all packages
  - `.eslintrc.js`: ESLint rules
  - `babel.config.js`: Babel transpilation
  - `jest.config.js`: Jest testing
  - `tsconfig.json`: Base TypeScript config
  - `lerna.json`: Lerna monorepo config

- **Package Level**: Package-specific overrides
  - `tsconfig.json`: Extends root config
  - `vite.config.ts`: Webcomponent build config (webcomponent packages only)

## Ignored Packages

Some packages are excluded from certain Lerna operations:
- `@optum-rx-core/orx-core-notification`
- `@optum-rx-core/orx-core-client-shared`
- `@optum-rx-core/orx-core-axios`

Check `lerna.json` for current ignore list.
