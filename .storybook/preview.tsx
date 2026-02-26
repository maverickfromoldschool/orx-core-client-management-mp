import React from 'react';
import {withThemeFromJSXProvider} from '@storybook/addon-themes';
import {Preview} from '@storybook/react';
import {
  OptumDefault,
  MuiDefault,
  UhcDefault,
  BCBSAZTheme,
  ServeYouTheme,
  BCBSMTheme,
  BCBSSCTheme,
  AHATheme,
  PAITheme,
  PHPTheme
} from '@optum-rx-skyline/themes';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {initialize, mswLoader} from 'msw-storybook-addon';

// Initialize MSW
initialize();

const themes = {
  Optum: OptumDefault,
  UHC: UhcDefault,
  ['MUI Default']: MuiDefault,
  BCBSAZ: BCBSAZTheme,
  ServeYou: ServeYouTheme,
  BCBSM: BCBSMTheme,
  BCBSSC: BCBSSCTheme,
  AHA: AHATheme,
  PAI: PAITheme,
  PHP: PHPTheme
};
const themeNames = Object.keys(themes);

// https://storybook.js.org/docs/react/essentials/toolbars-and-globals
export const globalTypes: Preview['globalTypes'] = {
  theme: {
    description: 'MUI Theme Switcher',
    defaultValue: themeNames[0],
    toolbar: {
      title: 'Theme',
      icon: 'paintbrush', // https://github.com/storybookjs/storybook/blob/master/lib/components/src/icon/icons.tsx
      items: themeNames,
      dynamicTitle: true
    }
  }
};

const customViewports = {
  iphone13: {
    name: 'iPhone 13',
    styles: {
      width: '390px',
      height: '844px'
    }
  },
  samsungS22: {
    name: 'Samsung Galaxy S22',
    styles: {
      width: '360px',
      height: '780px'
    }
  }
};

export const parameters = {
  options: {
    /**
     * display the top-level grouping as a "root" in the sidebar
     * @type {Boolean}
     */
    showRoots: true,
    storySort: {
      order: ['Deprecated']
    }
  },
  knobs: {
    escapeHTML: false
  },
  actions: {
    argTypesRegex: '^on.*' // does not currently work because 'react-docgen' is being used (see main.ts)
  },
  viewport: {
    viewports: {...INITIAL_VIEWPORTS, ...customViewports}
  },
  controls: {
    hideNoControlsWarning: true,
    expanded: true
  },
  layout: 'fullscreen',
  backgrounds: {
    grid: {
      cellSize: 16,
      opacity: 0.4,
      cellAmount: 8
    }
  },
  docs: {
    source: {
      excludeDecorators: true
    }
  }
};

export const loaders = [mswLoader];

export const decorators = [
  withThemeFromJSXProvider({
    themes,
    defaultTheme: 'Optum',
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline
  })
];
