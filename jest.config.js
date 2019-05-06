module.exports = require('@0devs/package/config/jest.config');

module.exports.testEnvironment = 'node';

module.exports.collectCoverage = true;

module.exports.collectCoverageFrom = ['src/**/*.ts'];

module.exports.moduleFileExtensions = [
  'ts',
  'tsx',
  'js',
];

module.exports.globals = {
  'ts-jest': {
    tsConfig: 'tsconfig.json',
    diagnostics: false,
  },
};

module.exports.testMatch = [
  '**/**/*.spec.ts',
  '**/**/*.spec.js',
];

module.exports.transform = {
  '^.+\\.(ts|tsx)$': 'ts-jest',
  '^.+\\.(js)$': 'ts-jest',
};

module.exports.transformIgnorePatterns = ['node_modules'];
