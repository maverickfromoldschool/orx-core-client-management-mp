// eslint-disable-next-line import/no-extraneous-dependencies
import {defineConfig, loadEnv} from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {visualizer} from 'rollup-plugin-visualizer';

import sizeLimitPlugin from './sizeLimitPlugin';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    mode: 'production',
    build: {
      target: ['es2015'],
      lib: {
        entry: 'src/index.tsx',
        name: 'orx-core-file-center-webcomponent',
        formats: ['umd'],
        fileName: (format) => `orx-core-file-center-webcomponent.${format}.js`
      },
      outDir: '../../dist/packages/orx-core-file-center-webcomponent',
      emptyOutDir: true
    },
    plugins: [
      react({jsxRuntime: 'classic'}),

      // options for Visualizer are available here: https://github.com/btd/rollup-plugin-visualizer?tab=readme-ov-file#options
      visualizer({
        filename: 'bundle-analysis.html',
        template: 'treemap'
      }),
      sizeLimitPlugin({
        maxSizeInKB: 1000,
        customSizeLimits: [{fileName: 'orx-core-file-center-webcomponent.umd.js', maxSize: 2000}],
        messageType: 'error'
      })
    ],
    define: {
      __APP_ENV__: JSON.stringify(env['APP_ENV']),
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
    },
    resolve: {
      // packages that are being duplicated in the bundle can be
      // deduped by specifying them here.  This is especially useful
      // for packages that deal with singletons like React Context.
      // If you are using a provider from two different packages
      // that both rely on the same singleton, you can dedupe them
      // here.
      dedupe: ['react', 'react-dom']
    }
  };
});
