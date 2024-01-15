/**
 * @fileoverview You should use absolute path to import from another layer
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/different-layer-absolute-import"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [
    {
        message: "You should use absolute path to import from another layer",
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

ruleTester.run("different-layer-absolute-import", rule, {
    valid: [
        {
            filename: "C:\\dubious\\src\\features\\Article",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/shared/Button.tsx'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\features\\Article\\Article.test.ts",
            code: "import { addCommentFormActions, addCommentFormReducer } from '../../../shared/Button.tsx'",
            errors: [],
            options: [
                {
                    alias: "src",
                    ignoreFiles: ["**/*.test.*"],
                },
            ],
        },
    ],

    invalid: [
        {
            filename: "C:\\dubious\\src\\features\\Article\\File.tsx",
            code: "import { addCommentFormActions, addCommentFormReducer } from '../../../shared/Button.tsx'",
            errors,
            options: aliasOptions,
            output: "import { addCommentFormActions, addCommentFormReducer } from 'src/shared/Button.tsx'",
        },
    ],
});
