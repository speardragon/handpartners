import nextConfig from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";

export default [
  ...nextConfig,
  prettierConfig,
  {
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },
];
