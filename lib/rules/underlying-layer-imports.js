/**
 * @fileoverview Prevent to import overlying layer from underlying one
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const {
    getImportLayer,
    getCurrentFileLayer,
    isPathRelative,
    availableLayers,
} = require("../helpers/main");

const micromatch = require("micromatch");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "Prevent to import layer from underlying layer",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
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
        ], // Add a schema if the rule has options,
        messages: {
            errorMessage:
                "You cannot import overlying layer from underlying one",
        },
    },

    create(context) {
        const layers = {
            app: ["pages", "widgets", "features", "shared", "entities"],
            pages: ["widgets", "features", "shared", "entities"],
            widgets: ["features", "shared", "entities"],
            features: ["shared", "entities"],
            entities: ["shared", "entities"],
            shared: ["shared"],
        };

        /** @type { {alias: string, ignoreImportPatterns: string[]} } */
        const {
            alias = "",
            ignoreImportPatterns = [],
            ignoreFiles = [],
        } = context.options[0] ?? {};

        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                const currentFileLayer = getCurrentFileLayer(context);
                const importLayer = getImportLayer(importPath, alias);
                const currentFilePath = context.filename;

                const isFileToBeIgnored = ignoreFiles.some((pattern) =>
                    micromatch.isMatch(currentFilePath, pattern)
                );

                if (isFileToBeIgnored) {
                    return;
                }

                if (isPathRelative(importPath)) {
                    return;
                }

                if (
                    !availableLayers[importLayer] ||
                    !availableLayers[currentFileLayer]
                ) {
                    return;
                }

                const isIgnored = ignoreImportPatterns.some((pattern) => {
                    return micromatch.isMatch(importPath, pattern);
                });

                if (isIgnored) {
                    return;
                }

                if (!layers[currentFileLayer]?.includes(importLayer)) {
                    context.report({
                        node,
                        messageId: "errorMessage",
                    });
                }
            },
        };
    },
};
