/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
    return {
        verbose: true,
        globalSetup: './jestGlobalSetup.js'
    };
};