import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettifyValidator from "./src/eslint/plugins/prettify-validator.mjs";

export default tseslint.config(
    {
        ignores: ["**/dist/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            "prettify-validator": prettifyValidator,
        },
        rules: {
            "prettify-validator/validate-prettify-string-value": "error",
        },
    },
);
