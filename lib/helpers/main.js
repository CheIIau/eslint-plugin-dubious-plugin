const path = require("path");

/**
 * Check if given path is relative to current module
 * @param {string} path - Import path
 * @returns boolean
 */
function isPathRelative(path) {
    return path === "." || path.startsWith("./") || path.startsWith("../");
}

/**
 *
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {string}
 */
const getCurrentFileLayer = (context) => {
    const currentFilePath = context.filename;

    const normalizedPath = path.toNamespacedPath(currentFilePath);
    const projectPath = normalizedPath?.split("src")[1];
    const segments = projectPath?.split("\\");

    return segments?.[1];
};

/**
 *
 * @param {string} value
 * @param {string} alias
 * @returns {string}
 */
const getImportLayer = (value, alias) => {
    const importPath = alias ? value.replace(`${alias}/`, "") : value;
    const segments = importPath?.split("/");

    return segments?.[0];
};

module.exports = {
    isPathRelative,
    getCurrentFileLayer,
    getImportLayer
};
