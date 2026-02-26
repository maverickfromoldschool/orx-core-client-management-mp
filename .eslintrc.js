module.exports = {
  extends: ['plugin:@uhg-skyline/optum/recommended-typescript', 'plugin:storybook/recommended'],
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  rules: {
    'dot-notation': 'off',
    '@typescript-eslint/dot-notation': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/icons-material',
            message: 'Please import default from @mui/icons-material/<IconName>'
          }
        ],
        patterns: ['!@mui/icons-material/*']
      }
    ]
  },
  overrides: [
    {
      files: ['packages/**/*', 'surfaces/**/*'],
      rules: {
        'react/function-component-definition': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@uhg-skyline/optum/no-long-files': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off'
      }
    },
    {
      files: ['**/*.test.tsx', '**/*.story.tsx', '**/*.stories.tsx'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    },
    {
      files: ['documentation/**/*.story.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off'
      }
    },
    {
      files: ['tools/**/*.js'],
      rules: {
        'import/extensions': 'off'
      }
    },
    {
      files: [
        'packages/orx-core-file-center/src/file-center-list-page/FileCenterListPage/file-center-list-page.tsx',
        'packages/orx-core-file-center/src/file-center-list-page/FileCenterListPage/file-center-list-page.test.tsx',
        'packages/orx-core-client-management/src/add-client-page/AddClientPage/add-client-page.tsx'
      ],
      rules: {
        '@uhg-skyline/optum/no-long-files': 'off'
      }
    }
  ]
};
