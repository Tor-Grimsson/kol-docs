import js from "@eslint/js"

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        URL: "readonly",
        fetch: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        performance: "readonly",
        getComputedStyle: "readonly",
        FontFace: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off"
    }
  }
]
