
/** @type {import('jest').Config} */
const config = {
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,


  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

};

module.exports = config;

