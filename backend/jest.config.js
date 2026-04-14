// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup/globalSetup.js'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 15000,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
};

