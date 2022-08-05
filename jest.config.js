module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: [`/node_modules/(?!(sip\.js))`], // Keep `sip.js` to get transpiled as well
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js"
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    globals: {
      "ts-jest": {
        "tsConfigFile": "tsconfig.json"
      }
    },
    testMatch: [
      "**/__tests__/*.+(ts|tsx|js)"
    ]
  };