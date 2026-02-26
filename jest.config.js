module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['tsx', 'ts', 'jsx', 'js', 'json', 'node'],
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '^.*\\.cy\\.test\\.tsx$'],
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^@optum-rx-core/orx-core-client-shared$': '<rootDir>/packages/orx-core-client-shared/src/index.ts',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js'
  },
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',
    '!packages/**/config/github.ts',
    '!packages/**/*.stories.{ts,tsx}',
    '!packages/**/*.stories.context.{ts,tsx}',
    '!packages/**/*.mock.{ts,tsx}',
    '!packages/**/src/index.ts',
    '!packages/**/vite.config.ts',
    '!packages/**/sizeLimitPlugin.ts',
    '!packages/**/schemas/default-values.ts',
    '!packages/**/schemas/*-schemas.ts',
    '!packages/**/steps/*-options.ts',
    '!packages/orx-core-client-management/**/*.{ts,tsx}',
    '!packages/orx-core-notification/**/*.{ts,tsx}',
    '!packages/orx-core-file-center/**/*.{ts,tsx}',
    '!packages/orx-core-admin-settings/**/*.{ts,tsx}',
    '!packages/orx-core-client-shared/**/*.{ts,tsx}'
  ],
  setupFiles: ['./test-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/node_modules/@testing-library/jest-dom'],
  coverageDirectory: 'coverage/jest',
  coverageThreshold: {
    global: {
      branches: 42,
      functions: 45,
      lines: 50,
      statements: -300
    }
  }
};
