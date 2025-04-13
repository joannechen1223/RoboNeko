// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*"],
  rules: {
    "prettier/prettier": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./mobile/tsconfig.json",
      },
      alias: {
        "@": "./mobile",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "import/newline-after-import": "warn",
        "import/order": [
          "warn",
          {
            "newlines-between": "always",
            alphabetize: {
              order: "asc",
              caseInsensitive: false,
            },
            groups: ["builtin", "external", "internal", "sibling"],
            pathGroupsExcludedImportTypes: [],
          },
        ],
      },
    },
  ],
};
