/**
 * @fileoverview fsd relative path checker
 * @author CheIIau
 */
"use strict";

const path = require("path");
const { isPathRelative } = require("../helpers/main");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "problem", // `problem`, `suggestion`, or `layout`
        docs: {
            description: "fsd relative path checker",
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
                },
            },
        ], // Add a schema if the rule has options,
        messages: {
            errorMessage: "All paths should be relative within one slice",
        },
    },

    create(context) {
        const alias = context?.options?.[0]?.alias || "";

        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                // e.g. src/features/sendNudes

                // let importTo;
                // if (alias === "@") {
                //     importTo = value.replace(`${alias}/`, "src");
                // } else if (alias === "~") {
                // const rootDir = require.main.paths[0].split('node_modules')[0].slice(0, -1) project folder name
                //     importTo = value.replace(`${alias}/`, "/");
                // } else {
                //     importTo = value;
                // }
                const importTo = alias
                    ? value.replace(`${alias}`, "src")
                    : value;

                //e.g. D:/web/project/src/features/sendDunes
                const fromFileName = context.filename;

                if (shouldBeRelative(fromFileName, importTo)) {
                    context.report({
                        node: node,
                        messageId: "errorMessage",
                        fix: (fixer) => {
                            const normalizedPath = getNormalizedCurrentFilePath(
                                fromFileName
                            )
                                .split("/")
                                .slice(0, -1)
                                .join("/");
                            const importPathWithoutAlias = importTo.replace(
                                "src/",
                                ""
                            );

                            let relativePath = path
                                .relative(`/${normalizedPath}`, `/${importPathWithoutAlias}`)
                                .split("\\")
                                .join("/");

                            if (!relativePath.startsWith(".")) {
                                relativePath = "./" + relativePath;
                            }
                            relativePath = `'${relativePath}'`
                            return fixer.replaceText(node.source, relativePath);
                        },
                    });
                }
            },
        };
    },
};

const layers = {
    entities: "entities",
    features: "features",
    shared: "shared",
    pages: "pages",
    widgets: "widgets",
};

/**
 * Returns normalized file path
 * @param {string} currentFilePath - File path
 * @returns {string}
 */
function getNormalizedCurrentFilePath(currentFilePath) {
    const normalizedPath = path.toNamespacedPath(currentFilePath);
    const projectFrom = normalizedPath.split("src\\")[1];
    return projectFrom.split("\\").join("/");
}

/**
 * Check if a path should be relative
 * @param {string} from - Current file path
 * @param {string} to - Imported file path
 * @returns {boolean}
 */
function shouldBeRelative(from, to) {
    if (!from || !to || isPathRelative(to)) {
        return false;
    }

    const toArray = to.split("/");
    const toLayer = toArray[1]; //layer folder
    const toSlice = toArray[2]; //slice folder
    const toNextFolder = toArray[3]; //next to folder   (specially for shared layer)

    if (!toLayer || !toSlice || !layers[toLayer]) {
        return false;
    }
    const projectFrom = getNormalizedCurrentFilePath(from);

    if (!projectFrom) {
        return false;
    }
    const fromArray = projectFrom.split("/");

    const fromLayer = fromArray[0];
    const fromSlice = fromArray[1];
    const fromNextFolder = fromArray[2]; //next from folder (specially for shared layer)

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }

    if (layers[toLayer] === "shared") {
        return (
            fromSlice === toSlice &&
            toLayer === fromLayer &&
            fromNextFolder === toNextFolder
        );
    }

    return fromSlice === toSlice && toLayer === fromLayer;
}
