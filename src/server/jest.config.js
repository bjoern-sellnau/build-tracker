module.exports = {
  displayName: 'server',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};