/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coveragePathIgnorePatterns: [
    'domain/exception',
    'infrastructure/config',
    'infrastructure/service/fake-geocoding.service.ts',
    'interface/decorator',
    'testing/domain/index.ts',
    'main.ts',
    'tokens.ts',
    'app.module.ts',
  ],
};
