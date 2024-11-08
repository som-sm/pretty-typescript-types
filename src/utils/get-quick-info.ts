import * as vscode from "vscode";
import type { server } from "typescript";

export async function getQuickInfo(
    document: vscode.TextDocument,
    position: vscode.Position,
): Promise<server.protocol.QuickInfoResponseBody | undefined> {
    const quickInfoResponse =
        await vscode.commands.executeCommand<server.protocol.QuickInfoResponse>(
            "typescript.tsserverRequest",
            "quickinfo",
            {
                file: document.fileName,
                line: position.line + 1,
                offset: position.character + 1,
            } satisfies server.protocol.QuickInfoRequest["arguments"],
        );

    return quickInfoResponse.body;
}
