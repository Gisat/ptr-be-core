import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      '**/dev/*',
      '**/dist/*',
      '**/tests/*',
      'tsconfig.json',
    ]
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@stylistic": stylistic,
    },
    extends: [
      "@typescript-eslint/recommended",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@stylistic/lines-around-comment": [
        "error",
        {
          beforeLineComment: true,
          allowBlockStart: true,
        },
      ],
      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: ["if", "for", "while", "do", "const", "let", "return"],
        },
      ],
    },
  },
]);
