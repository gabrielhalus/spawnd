import createConfig from "@spawnd/eslint-config/create-config";
import drizzle from "eslint-plugin-drizzle";

export default createConfig({
  ignores: ["src/db/migrations/*", "public/*"],
  plugins: { drizzle },
  rules: {
    ...drizzle.configs.recommended.rules,
  },
  overrides: [
    {
      files: ["src/routes/**/*.ts"],
      rules: {
        "drizzle/enforce-delete-with-where": "off",
      },
    },
  ],
});
