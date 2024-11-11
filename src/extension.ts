import * as vscode from "vscode";
import { getPrettyQuickInfo } from "./utils/get-pretty-quick-info";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerHoverProvider("typescript", {
        async provideHover(document, position, token) {
            const prettyQuickInfo = await getPrettyQuickInfo(document, position);

            if (!prettyQuickInfo || token.isCancellationRequested) {
                return;
            }

            return new vscode.Hover(
                new vscode.MarkdownString()
                    .appendCodeblock("// Pretty Type:".padEnd(20), "typescript")
                    .appendCodeblock(prettyQuickInfo, "typescript"),
            );
        },
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
