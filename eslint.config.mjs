import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...nextCoreWebVitals],

    rules: {
        "react/no-unescaped-entities": "warn",
        "react/jsx-no-comment-textnodes": "warn",
        "react-hooks/rules-of-hooks": "warn",
        // New React Compiler rules in eslint-plugin-react-hooks 7: surfaced as
        // warnings until the existing components are refactored.
        "react-hooks/set-state-in-effect": "warn",
        "react-hooks/error-boundaries": "warn",
        "react-hooks/immutability": "warn",
        "react-hooks/purity": "warn",
        "react-hooks/preserve-manual-memoization": "warn",
        "react-hooks/use-memo": "warn",
    },
}]);