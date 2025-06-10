module.exports = {
  // Use ts-jest for TypeScript transformations
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node', // Test environment for Node.js
  // Where to find test files
  testMatch: [
    "<rootDir>/src/tests/*/.test.ts"
  ],
  // Module file extensions to consider
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};