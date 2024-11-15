import * as fs from "node:fs";
import * as path from "node:path";
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

export default ESLintUtils.RuleCreator.withoutDocs({
    meta: {
        type: "problem",
        docs: {
            description:
                "Validate value of PRETTIFY_STRING against contents of prettify.ts",
        },
        fixable: "code",
        schema: [],
        messages: {
            mismatchedPrettifyStringValue:
                "Value of PRETTIFY_STRING does not match contents of prettify.ts",
            otherError: "{{message}}",
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            VariableDeclarator(node) {
                if (
                    node.id.type === AST_NODE_TYPES.Identifier &&
                    node.id.name === "PRETTIFY_STRING"
                ) {
                    try {
                        const prettifyTsPath = path.join(
                            context.cwd,
                            "src/types/prettify.ts",
                        );
                        const prettifyTsContent = fs.readFileSync(prettifyTsPath, "utf8");

                        if (node.init?.type === AST_NODE_TYPES.TemplateLiteral) {
                            const nodeValue = node.init.quasis[0]?.value.raw;

                            if (nodeValue !== prettifyTsContent) {
                                context.report({
                                    node,
                                    messageId: "mismatchedPrettifyStringValue",
                                    fix(fixer) {
                                        if (
                                            node.init?.type ===
                                            AST_NODE_TYPES.TemplateLiteral
                                        ) {
                                            return fixer.replaceText(
                                                node.init,
                                                `\`${prettifyTsContent}\``,
                                            );
                                        }

                                        return null;
                                    },
                                });
                            }
                        }
                    } catch (error) {
                        const message =
                            error instanceof Error
                                ? error.message
                                : "Failed to validate PRETTIFY_STRING value";
                        context.report({
                            node,
                            messageId: "otherError",
                            data: { message },
                        });
                    }
                }
            },
        };
    },
});
