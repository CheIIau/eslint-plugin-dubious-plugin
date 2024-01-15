/**
 * @fileoverview Check if a module was imported using an absolute path
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-imports"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2023, sourceType: "module" },
});

const aliasOptions = [
    {
        alias: "@",
    },
];

const errors = [
    {
        message:
            "Absolute imports is allowed only from public API (index files)",
    },
];

ruleTester.run("public-imports", rule, {
    valid: [
        {
            code: "import { addCommentFormActions } from '../../model/slices/addCommentForm'",
            errors: [],
        },
        {
            code: "import { addCommentFormActions } from '@/entities/Article'",
            errors: [],
            options: aliasOptions,
        },
        {
            code: `import {
                getScrollPositionByPath,
                scrollPositionSavingActions,
            } from 'src/features/scrollPositionSaving/scrollPositionSavingIndex'`,
            errors,
            options: [
                {
                    alias: "src",
                    ignoreFiles: ["test"],
                },
            ],
        },
        {
            filename: "D:\\web\\dubious\\src\\test\\__tests__\\foo.test.ts",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/model/file.ts'",
            errors: [],
            options: [
                {
                    alias: "src",
                    ignoreFiles: ["test"],
                },
            ],
        },
    ],

    invalid: [
        {
            code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
            errors,
            options: aliasOptions,
            output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/articleIndex'"
        },
        {
            filename: "D:\\web\\dubious\\src\\api\\index.ts",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/model/file.ts'",
            errors,
            options: [
                {
                    alias: "src",
                    ignoreFiles: ["test"],
                },
            ],
            output: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/articleIndex'"
        },
        {
            filename: "D:\\web\\dubious\\src\\test\\__tests__\\foo.test.ts",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/model/file.ts'",
            errors,
            options: [
                {
                    alias: "src",
                    ignoreFiles: [],
                },
            ],
            output: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/articleIndex'"
        },
        {
            filename: "D:\\web\\dubious\\src\\test\\__tests__\\foo.test.ts",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/ArticleList/model/file.ts'",
            errors,
            options: [
                {
                    alias: "src",
                    ignoreFiles: [],
                },
            ],
            output: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/ArticleList/articleListIndex'"
        },
    ],
});
