/**
 * @fileoverview Fsd relative path checker
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2023, sourceType: "module" },
});
ruleTester.run("path-checker", rule, {
    valid: [
        {
            filename: "D:\\web\\dubious\\src\\entities\\Article",
            code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
            errors: [],
            options: [
                {
                    alias: "@",
                },
            ],
        },
    ],

    invalid: [
        {
            filename: "D:\\web\\dubious\\src\\entities\\Article",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/model/slices/addCommentFormSlice'",
            errors: [
                {
                    message: "All paths should be relative within one slice",
                },
            ],
        },
    ],
});
