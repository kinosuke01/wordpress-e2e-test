import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import playwright from "eslint-plugin-playwright";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

// オフィシャルな推奨項目を適用
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        // tsconfig.json を自動探索
        projectService: true,
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
      },
    },
    // prettier の デフォルト 設定 "trailingComma": "es5" を適用する
    // eslintPluginPrettierRecommended では、適用されなかったため個別設定する
    rules: {
      "comma-dangle": ["error", "es5"],
      "@typescript-eslint/comma-dangle": ["error", "es5"],
    },
  },

  {
    files: ["tests/**/*.ts", "**/*.{spec,test}.ts"],
    ...playwright.configs["flat/recommended"],
  },

  eslintPluginPrettierRecommended,

  // Prettierとの競合を避けるため、フォーマット関連のルールを無効化
  eslintConfigPrettier,

  {
    ignores: ["node_modules/**", "eslint.config.mjs"],
  }
);
