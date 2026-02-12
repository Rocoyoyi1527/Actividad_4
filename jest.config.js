module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],
  setupFiles: ['<rootDir>/tests/setup.js']
};
