/**
 * @fileoverview You should use absolute path to import from another layer
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const { getCurrentFileLayer, availableLayers } = require("../helpers/main");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null,
        docs: {
            description:
                "You should use absolute path to import from another layer",
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
        ], // Add a schema if the rule has options,
        messages: {
            errorMessage:
                "You should use absolute path to import from another layer",
        },
    },

    create(context) {
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
                const currentFilePath = context.filename;

                if (!importPath.startsWith("../")) {
                    return;
                }

                const isFileToBeIgnored = ignoreFiles.some((filePart) =>
                    currentFilePath.includes(filePart)
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

                /** @type {string} */
                const importPathWithoutDotsAndSlashes = importPath.replace(
                    /\.\.\//g,
                    ""
                );

                /** @type {string} */
                const currentImportLayer =
                    importPathWithoutDotsAndSlashes.split("/")?.[0];

                if (!availableLayers[currentImportLayer]) {
                    return;
                }

                if (currentFileLayer === currentImportLayer) {
                    return;
                }

                context.report({
                    node: node,
                    messageId: "errorMessage",
                    fix: (fixer) => {
                        return fixer.replaceText(
                            node.source,
                            `'${alias}/${importPathWithoutDotsAndSlashes}'`
                        );
                    },
                });
            },
        };
    },
};
