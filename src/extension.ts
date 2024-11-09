import * as vscode from "vscode";
import { getPrettyQuickInfo } from "./utils/get-pretty-quick-info";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerHoverProvider("typescript", {
        async provideHover(document, position, token) {
            const prettyQuickInfo = await getPrettyQuickInfo(document, position);

            if (!prettyQuickInfo || token.isCancellationRequested) {
                return;
            }

            const title = "```ts\n// Pretty Type:  \n```\n";
            return new vscode.Hover(
                new vscode.MarkdownString(title + "```ts\n" + prettyQuickInfo + "\n```"),
            );
        },
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
