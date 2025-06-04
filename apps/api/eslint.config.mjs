import createConfig from "@spawnd/eslint-config/create-config";
import drizzle from "eslint-plugin-drizzle";

export default createConfig({
  ignores: ["drizzle", "public/*"],
  plugins: { drizzle },
  rules: {
    ...drizzle.configs.recommended.rules
  }
});
