import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  // transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  moduleNameMapper: {
    // https://github.com/uuidjs/uuid/issues/692
    // // `uuid` export as ESM - `esm-*` that interpreted as CJS, so
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
  },

  clearMocks: true, // Clear mock between tests
  restoreMocks: true,
  testTimeout: 10000,

  extensionsToTreatAsEsm: ['.ts'],
};

export default config;
