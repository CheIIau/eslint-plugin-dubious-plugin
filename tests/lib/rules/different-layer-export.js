/**
 * @fileoverview Prevents exporting a module from another layer
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/different-layer-export"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [
    {
        message: "You should not export from different layer",
    },
];

const aliasOptions = [
    {
        alias: "src",
    },
];

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2023, sourceType: "module" },
});

ruleTester.run("different-layer-export", rule, {
    valid: [
        {
            filename: "C:\\dubious\\src\\entities\\Article\\articleIndex.ts",
            code: "export { ArticleViewSelector } from '../../../entities/ArticleViewSelector/ui/ArticleViewSelector'",
            errors: [],
            options: aliasOptions,
        },
    ],

    invalid: [
        {
            filename: "C:\\dubious\\src\\entities\\Article\\articleIndex.ts",
            code: "export { ArticleViewSelector } from '../../../features/ArticleViewSelector/ui/ArticleViewSelector'",
            errors,
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\entities\\Article\\articleIndex.ts",
            code: "export { ArticleViewSelector } from 'src/features/ArticleViewSelector/ui/ArticleViewSelector'",
            errors,
            options: aliasOptions,
        },
    ],
});
