import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["dist/"],
  },
  { files: ["src/**/*.{js,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
];
