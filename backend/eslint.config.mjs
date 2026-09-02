import js from "@eslint/js";
import n from "eslint-plugin-n";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["eslint.config.mjs"],
    plugins: {
      js,
      n
    },
    extends: ["js/recommended"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node
    },
    rules: {
      "no-unused-vars": ["error", {
        argsIgnorePattern: "^_"
      }],
      "n/no-missing-require": "error"
    }
  }
]);