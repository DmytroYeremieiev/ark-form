module.exports = {
  name: 'web-app',
  displayName: {
    name: 'web-app',
    color: 'blue',
  },
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '^@root(.*)$': '<rootDir>/$1',
    '^@component(.*)$': '<rootDir>/component$1',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  // setupFilesAfterEnv: ['@marko/testing-library/cleanup-after-each']
};
