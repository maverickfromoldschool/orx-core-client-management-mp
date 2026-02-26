import path from 'path';
import remarkGfm from 'remark-gfm';
import globby from 'globby';
import type {StorybookConfig} from '@storybook/react-vite';
import {mergeConfig} from 'vite';

const findStories = (includePattern: string, excludePattern?: string) => {
  const storybookFolderRelativePaths = globby.sync(
    [includePattern, ...(excludePattern ? [`!${excludePattern}`] : [])],
    {
      cwd: path.join(process.cwd(), '.storybook')
    }
  );

  return storybookFolderRelativePaths;
};

const config: StorybookConfig = {
  stories: [
    ...findStories('../packages/**/*.@(story|stories).tsx', '../packages/**/node_modules'),
    ...findStories('../packages/**/*.mdx', '../packages/**/node_modules')
  ],
  staticDirs: ['../static'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false // Configuration for remark plugins must be specifically applied to the addon-docs options below
      }
    },
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    },
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          test: /\.(story|stories)\.tsx?$/,
          include: [path.resolve(__dirname, '../packages/')]
        },
        loaderOptions: {
          parser: 'typescript'
        }
      }
    },
    'storybook-addon-fetch-mock'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: {
    // The default option is 'react-docgen-typescript' which is very slow
    // 'react-docgen' is significantly faster, but does not provide type information for props based on imported types and does not work with action argTypesRegex
    // https://gist.github.com/shilman/036313ffa3af52ca986b375d90ea46b0#react-docgen-typescript-vs-react-docgen
    reactDocgen: 'react-docgen'
  },
  docs: {
    autodocs: 'tag'
  },
  async viteFinal(config, {configType}) {
    return mergeConfig(config, {
      define: {'process.env': {}} // https://github.com/storybookjs/storybook/issues/18920
    });
  }
};
export default config;
