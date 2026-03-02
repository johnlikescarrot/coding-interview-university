import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disabled to allow parsing of complex Markdown AST nodes without deep type casting
      "@typescript-eslint/no-explicit-any": "off",
      // Disabled to support raw Markdown content containing entities that are otherwise escaped in JSX
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
