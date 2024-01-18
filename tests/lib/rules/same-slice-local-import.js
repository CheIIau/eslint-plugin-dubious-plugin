/**
 * @fileoverview Fsd relative path checker
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/same-slice-local-import"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2023, sourceType: "module" },
});
ruleTester.run("same-slice-local-import", rule, {
    valid: [
        {
            filename: "D:\\web\\dubious\\src\\entities\\Article\\ui\\file.tsx",
            code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice/addCommentFormSliceIndex.ts'",
            errors: [],
            options: [
                {
                    alias: "src",
                },
            ],
        },
    ],

    invalid: [
        {
            filename: "D:\\web\\dubious\\src\\entities\\Article\\ui\\file.tsx",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/model/slices/addCommentFormSlice'",
            errors: [
                {
                    message: "All paths should be relative within one slice",
                },
            ],
            options: [
                {
                    alias: "src",
                },
            ],
            output: "import { addCommentFormActions, addCommentFormReducer } from '../model/slices/addCommentFormSlice'"
        },
    ],
});
