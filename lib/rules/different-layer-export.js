/**
 * @fileoverview Prevents exporting a module from another layer
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
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "Prevents exporting a module from another layer",
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
                    ignoreExportPatterns: {
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
            errorMessage: "You should not export from different layer",
        },
    },

    create(context) {
        /** @type { {alias: string, ignoreExportPatterns: string[], ignoreFiles: string[]} } */
        const {
            alias = "",
            ignoreExportPatterns = [],
            ignoreFiles = [],
        } = context.options[0] ?? {};

        return {
            ExportNamedDeclaration(node) {
                if (!node.source?.value) {
                    return;
                }
                const exportPath = node.source.value;
                const currentFileLayer = getCurrentFileLayer(context);
                const currentFilePath = context.filename;

                const isFileToBeIgnored = ignoreFiles.some((pattern) =>
                    micromatch.isMatch(currentFilePath, pattern)
                );

                if (isFileToBeIgnored) {
                    return;
                }

                const isIgnored = ignoreExportPatterns.some((pattern) => {
                    return micromatch.isMatch(exportPath, pattern);
                });

                if (isIgnored) {
                    return;
                }

                let anotherLayerExport = false;

                if (exportPath.startsWith("../")) {
                    /** @type {string} */
                    const exportPathWithoutDotsAndSlashes = exportPath.replace(
                        /\.\.\//g,
                        ""
                    );

                    /** @type {string} */
                    const exportLayer =
                        exportPathWithoutDotsAndSlashes.split("/")?.[0];

                    if (
                        !availableLayers[exportLayer] ||
                        currentFileLayer === exportLayer
                    ) {
                        return;
                    } else {
                        anotherLayerExport = true;
                    }
                } else {
                    if (!alias || !exportPath.startsWith(alias)) {
                        return;
                    }

                    const segments = exportPath.split("/");

                    /** @type {string} */
                    const exportLayer = segments?.[1];

                    if (
                        !availableLayers[exportLayer] ||
                        currentFileLayer === exportLayer
                    ) {
                        return;
                    } else {
                        anotherLayerExport = true;
                    }
                }
                if (anotherLayerExport) {
                    context.report({
                        node,
                        messageId: "errorMessage",
                    });
                }
            },
        };
    },
};
