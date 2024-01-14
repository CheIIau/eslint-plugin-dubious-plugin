/**
 * @fileoverview Prevent to import layer from underlying layer
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [
    {
        message: "You cannot import overlying layer from underlying one",
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

ruleTester.run("layer-imports", rule, {
    valid: [
        {
            filename: "C:\\dubious\\src\\features\\Article",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/shared/Button.tsx'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\features\\Article",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\app\\providers",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/widgets/Articl'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\widgets\\pages",
            code: "import { useLocation } from 'react-router-dom'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\app\\providers",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\index.tsx",
            code: "import { StoreProvider } from 'src/app/providers/StoreProvider';",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\entities\\Article.tsx",
            code: "import { StateSchema } from 'src/app/providers/StoreProvider'",
            errors: [],
            options: [
                {
                    alias: "src",
                    ignoreImportPatterns: ["**/StoreProvider"],
                },
            ],
        },
        {
            filename: "C:\\dubious\\src\\entities\\Article.tsx",
            code: "import { StateSchema } from 'src/app/providers/StoreProvider'",
            errors: [],
            options: [
                {
                    alias: "src",
                    ignoreImportPatterns: ["**/StoreProvider"],
                },
            ],
        },
    ],

    invalid: [
        {
            filename: "C:\\dubious\\src\\entities\\providers",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/features/Articl'",
            errors,
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\features\\providers",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/widgets/Articl'",
            errors,
            options: aliasOptions,
        },
        {
            filename: "C:\\dubious\\src\\entities\\providers",
            code: "import { addCommentFormActions, addCommentFormReducer } from 'src/widgets/Articl'",
            errors,
            options: aliasOptions,
        },
    ],
});
