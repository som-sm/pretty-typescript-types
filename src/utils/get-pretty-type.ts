import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getQuickInfo } from "./get-quick-info";
import { extractQuickInfoParts } from "./extract-quick-info-parts";

export async function getPrettyType(type: string, document: vscode.TextDocument) {
    const randomId = `PrettyTypeScriptTypes_${crypto.randomUUID().replace(/-/g, "_")}`;
    const code =
        document.getText() +
        `
type ${randomId}_Prettify<T> = T extends Function | string | number ? T: {[P in keyof T]: ${randomId}_Prettify<T[P]>};
type ${randomId}_Result = ${randomId}_Prettify<${type}>;
    `;

    const tempFilePath = path.join(
        path.dirname(document.fileName),
        `${randomId}_Temp${path.extname(document.fileName)}`,
    );

    // Create a temporary file at the same location as the current file
    fs.writeFileSync(tempFilePath, code);

    const tempDocument = await vscode.workspace.openTextDocument(tempFilePath);
    const documentLastLineIndex = document.lineCount - 1;
    const characterOffset = "type ".length; // Index where the `Result` type starts

    const quickInfo = await getQuickInfo(
        tempDocument,
        new vscode.Position(documentLastLineIndex + 2, characterOffset),
    );

    // Delete the temporary file after getting the quick info
    fs.unlinkSync(tempFilePath);

    if (!quickInfo) {
        return;
    }

    return extractQuickInfoParts(quickInfo.displayString, quickInfo.kind)?.type;
}
