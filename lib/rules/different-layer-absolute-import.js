/**
 * @fileoverview You should use absolute path to import from different layer
 * @author CheIIau
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const { getCurrentFileLayer, availableLayers } = require("../helpers/main");
const micromatch = require("micromatch");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null,
        docs: {
            description:
                "You should use absolute path to import from different layer",
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
                "You should use absolute path to import from different layer",
        },
    },

    create(context) {
        /** @type { {alias: string, ignoreImportPatterns: string[], ignoreFiles: string[]} } */
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

                /** @type {string} */
                const importPathWithoutDotsAndSlashes = importPath.replace(
                    /\.\.\//g,
                    ""
                );

                /** @type {string} */
                const currentImportLayer =
                    importPathWithoutDotsAndSlashes.split("/")?.[0];

                if (
                    !availableLayers[currentImportLayer] ||
                    currentFileLayer === currentImportLayer
                ) {
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
