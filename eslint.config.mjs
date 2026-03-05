import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const nextConfig = [...nextCoreWebVitals, ...nextTypeScript];

const localRuleOverrides = {
  rules: {
    "@next/next/no-img-element": "off",
    "react-hooks/set-state-in-effect": "off",
    "react/no-unescaped-entities": "off",
  },
};

const config = [...nextConfig, localRuleOverrides];

export default config;
