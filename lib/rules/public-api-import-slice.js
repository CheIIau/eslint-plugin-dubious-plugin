/**
 * @fileoverview Check if a module was imported using a public API
 * @author CheIIau
 */
"use strict";
const { isPathRelative } = require("../helpers/main");
const path = require("path");
const micromatch = require("micromatch");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const layers = {
    entities: "entities",
    features: "features",
    pages: "pages",
    widgets: "widgets",
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "Check if a module was imported using a public API",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: "code", // Or `code` or `whitespace`
        schema: [
            {
                type: "object",
                properties: {
                    alias: {
                        type: "string",
                    },
                    ignoreImportPatterns: {
                        type: "array",
                        items: { type: "string" },
                    },
                    ignoreFiles: {
                        type: "array",
                        items: { type: "string" },
                    },
                },
            },
        ],
        messages: {
            errorMessage:
                "Absolute imports is allowed only from public API (index files)",
        },
    },

    create(context) {

        const {
            alias = "",
            ignoreImportPatterns = [],
            ignoreFiles = [],
        } = context.options[0] ?? {};

        return {
            ImportDeclaration(node) {
                /** @type {string} */
                const importPath = node.source.value;
                const importTo = alias ? importPath.replace(`${alias}/`, "") : importPath;
                const currentFilePath = context.filename;

                if (isPathRelative(importTo)) {
                    return;
                }

                const isFileToBeIgnored = ignoreFiles.some((pattern) =>
                    micromatch.isMatch(currentFilePath, pattern)
                );

                if (isFileToBeIgnored) {
                    return;
                }

                const isIgnored = ignoreImportPatterns.some((pattern) => {
                    return micromatch.isMatch(importPath, pattern);
                });

                if (isIgnored) {
                    return;
                }

                // [entities, article, model, types]
                const segments = importTo.split("/");
                const layer = segments[0];
                const slice = segments[1];

                if (!layers[layer]) {
                    return;
                }
                const isImportNotFromPublicApi =
                    segments.length > 3 &&
                    !segments.at(-1).toLowerCase().includes("index");

                if (isImportNotFromPublicApi) {
                    context.report({
                        node: node,
                        messageId: "errorMessage",
                        fix: (fixer) => {
                            return fixer.replaceText(
                                node.source,
                                `'${alias}/${layer}/${slice}/${
                                    slice[0].toLowerCase() + slice.slice(1)
                                }Index'`
                            );
                        },
                    });
                }
            },
        };
    },
};
