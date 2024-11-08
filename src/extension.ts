import * as vscode from "vscode";
import { getPrettifiedQuickInfo } from "./utils/get-prettified-quick-info";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerHoverProvider("typescript", {
        async provideHover(document, position) {
            const prettifiedType = await getPrettifiedQuickInfo(document, position);

            if (prettifiedType) {
                const title = "```ts\n// Pretty Type:  \n```\n";

                return new vscode.Hover(
                    new vscode.MarkdownString(
                        title + "```ts\n" + prettifiedType + "\n```",
                    ),
                );
            }
        },
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
