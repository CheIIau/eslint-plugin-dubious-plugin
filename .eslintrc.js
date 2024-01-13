"use strict";

module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:eslint-plugin/recommended",
        "plugin:node/recommended",
    ],
    env: {
        node: true,
        ecmaVersion: 2023,
    },
    overrides: [
        {
            files: ["tests/**/*.js"],
            env: { mocha: true },
        },
    ],
};
