import antfu from "@antfu/eslint-config";

export default function createConfig(options, ...userConfigs) {
  return antfu(
    {
      type: "app",
      typescript: true,
      formatters: true,
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
        braceStyle: "1tbs",
      },
      ...options,
    },
    {
      rules: {
        "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
        "ts/consistent-type-definitions": ["error", "type"],
        "no-console": ["warn"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": ["off"],
        "node/no-process-env": ["error"],
        "perfectionist/sort-imports": [
          "error",
          {
            tsconfigRootDir: ".",
          },
        ],
        "unicorn/filename-case": [
          "error",
          {
            case: "kebabCase",
            ignore: ["README.md"],
          },
        ],
      },
    },
    ...userConfigs,
  );
}
