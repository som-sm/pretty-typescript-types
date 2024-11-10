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
type ${randomId}_UglyType = ${type};
type ${randomId}_Prettify<T> = T extends Function | string | number ? T: {[P in keyof T]: ${randomId}_Prettify<T[P]>};
type ${randomId}_PrettyType = ${randomId}_Prettify<${randomId}_UglyType>;`;

    const tempFilePath = path.join(
        path.dirname(document.fileName),
        `${randomId}_Temp${path.extname(document.fileName)}`,
    );

    // Create a temporary file at the same location as the current file
    fs.writeFileSync(tempFilePath, code);

    const tempDocument = await vscode.workspace.openTextDocument(tempFilePath);
    const characterOffset = "type ".length; // Index where `PrettyType` type starts

    const quickInfo = await getQuickInfo(
        tempDocument,
        new vscode.Position(tempDocument.lineCount - 1, characterOffset),
    );

    // Delete the temporary file after getting the quick info
    fs.unlinkSync(tempFilePath);

    if (!quickInfo) {
        return;
    }

    const prettyType = extractQuickInfoParts(
        quickInfo.displayString,
        quickInfo.kind,
    )?.type;

    if (prettyType === "any" || prettyType?.includes(`${randomId}_Prettify`)) {
        return;
    }

    return prettyType;
}
