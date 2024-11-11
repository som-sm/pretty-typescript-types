const fs = require("fs");
const path = require("path");

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description:
                "Validate value of PRETTIFY_STRING against contents of prettify.ts",
        },
        fixable: "code",
        schema: [],
    },
    create(context) {
        return {
            VariableDeclarator(node) {
                if (node.id.type === "Identifier" && node.id.name === "PRETTIFY_STRING") {
                    try {
                        const prettifyTsPath = path.join(
                            path.dirname(context.filename),
                            "prettify.ts",
                        );
                        const prettifyTsContent = fs.readFileSync(prettifyTsPath, "utf8");
                        const nodeValue = node.init.quasis?.[0].value.raw;

                        if (nodeValue !== prettifyTsContent) {
                            context.report({
                                node,
                                message:
                                    "Value of PRETTIFY_STRING does not match contents of prettify.ts",
                                fix(fixer) {
                                    return fixer.replaceText(
                                        node.init,
                                        `\`${prettifyTsContent}\``,
                                    );
                                },
                            });
                        }
                    } catch (error) {
                        return context.report({
                            node,
                            message: error.message,
                        });
                    }
                }
            },
        };
    },
};
