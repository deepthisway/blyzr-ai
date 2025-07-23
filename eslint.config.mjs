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
    // Ignore generated files completely
    ignores: [
      "**/generated/**",
      "**/prisma/generated/**",
      "src/generated/**",
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
    ],
  },
  {
    // Fallback rules for any generated files that might slip through
    files: ["**/generated/**/*", "**/prisma/**/*"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
  {
    // Custom rules for your project files
    files: ["src/**/*.{ts,tsx}", "!src/generated/**/*"],
    rules: {
      // You can add custom rules here for your actual code
      // For example, if you want to allow 'any' in specific files:
      // "@typescript-eslint/no-explicit-any": "warn",
      
      // Temporarily disable if you need to build immediately
      // "react-hooks/rules-of-hooks": "warn", // Change from error to warning
    },
  },
];

export default eslintConfig;