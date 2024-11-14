import validatePrettifyStringValue from "../rules/validate-prettify-string-value.mjs";

const plugin = {
    rules: { "validate-prettify-string-value": validatePrettifyStringValue },
};

export default plugin;
