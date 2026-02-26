/* eslint-disable import/no-extraneous-dependencies */
import {Palette as MaterialPalette, PaletteOptions as MaterialPaletteOptions} from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  export interface TypeText {
    hint: string;
  }
  export interface Palette extends MaterialPalette {
    affirmative: MaterialPalette['primary'];
    accent: MaterialPalette['primary'];
    tint?: {
      error: string;
      info: string;
      alert: string;
      success: string;
      info2: string;
      info3: string;
    };
  }
  export interface PaletteOptions extends MaterialPaletteOptions {
    affirmative?: MaterialPaletteOptions['primary'];
    accent?: MaterialPaletteOptions['primary'];
    tint?: {
      error: string;
      info: string;
      alert: string;
      success: string;
      info2: string;
      info3: string;
    };
  }
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    secondary: string;
    gray: string;
    accent: string;
  }
}

declare module '@mui/system/createTheme/shape' {
  interface ShapeSizeOptions {
    xsmall: number | string;
    small: number | string;
    medium: number | string;
    large: number | string;
    xlarge: number | string;
  }
  interface ShapeOptions {
    corner: {
      desktop: ShapeSizeOptions;
      mobile: ShapeSizeOptions;
    };
  }
  interface Shape {
    corner: {
      desktop: ShapeSizeOptions;
      mobile: ShapeSizeOptions;
    };
  }
}

declare module '@mui/material/styles/createTheme' {
  export interface Theme {
    themeName?: string;
  }
  // allow configuration using `createTheme`
  export interface ThemeOptions {
    themeName?: string;
  }
}
