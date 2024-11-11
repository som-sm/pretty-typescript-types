const validatePrettifyStringValue = require("../rules/validate-prettify-string-value");

const plugin = {
    rules: { "validate-prettify-string-value": validatePrettifyStringValue },
};

module.exports = plugin;
