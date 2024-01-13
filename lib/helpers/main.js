
/**
 * Check if given path is relative to current module
 * @param {string} path - Import path
 * @returns boolean
 */
function isPathRelative(path) {
    return path === "." || path.startsWith("./") || path.startsWith("../");
}

module.exports = {
    isPathRelative,
};
