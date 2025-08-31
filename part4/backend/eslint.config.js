import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.sharedNode,
      },
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  globalIgnores(["node_modules", "dist", "build", "coverage", "public"]),
]);
