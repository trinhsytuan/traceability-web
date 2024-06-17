module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/*/RbGenerated*/*.{js,jsx}",
    "!src/App.js",
    "!src/*/*/Loadable.{js,jsx}",
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
  },
  moduleDirectories: ["node_modules", "app"],
  moduleNameMapper: {
    ".*\\.(css|less|styl|scss|sass)$": "<rootDir>/internals/mocks/cssModule.js",
    ".*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/internals/mocks/image.js",
  },
  setupFilesAfterEnv: ["react-testing-library/cleanup-after-each"],
  setupFiles: ["raf/polyfill"],
  testRegex: "tests/.*\\.test\\.js$",
  snapshotSerializers: [],
};
