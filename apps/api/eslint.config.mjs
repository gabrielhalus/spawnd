import createConfig from "@spawnd/eslint-config/create-config";
import drizzle from "eslint-plugin-drizzle";

export default createConfig({
  ignores: ["src/drizzle/migrations/*", "public/*"],
  plugins: { drizzle },
  rules: {
    ...drizzle.configs.recommended.rules,
  },
});
