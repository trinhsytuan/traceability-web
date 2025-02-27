module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-syntax-dynamic-import",
    ["import", { libraryName: "antd", libraryDirectory: "lib" }, "ant"],
  ],
  env: {
    production: {
      only: ["src"],
      plugins: [
        "lodash",
        "transform-react-remove-prop-types",
        "@babel/plugin-transform-react-inline-elements",
        "@babel/plugin-transform-react-constant-elements",
      ],
    },
    test: {
      plugins: ["@babel/plugin-transform-modules-commonjs", "dynamic-import-node"],
    },
  },
};
