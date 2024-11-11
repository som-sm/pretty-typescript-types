import * as vscode from "vscode";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { getQuickInfo } from "./get-quick-info";
import { extractQuickInfoParts } from "./extract-quick-info-parts";
import { PRETTIFY_STRING } from "./constants";

function getCodeForPrettifying(type: string, randomId: string) {
    return `${PRETTIFY_STRING.replace(/Prettify/g, `${randomId}_Prettify`)}

export {};
type ${randomId}_UglyType = ${type};
type ${randomId}_PrettyType = ${randomId}_Prettify<${randomId}_UglyType>;`;
}

export async function getPrettyType(type: string, document: vscode.TextDocument) {
    const randomId = `PrettyTypeScriptTypes_${crypto.randomUUID().replace(/-/g, "_")}`;
    const code = `${document.getText()}\n${getCodeForPrettifying(type, randomId)}`;

    const tempFilePath = path.join(
        path.dirname(document.fileName),
        `${randomId}_Temp${path.extname(document.fileName)}`,
    );

    // Create a temporary file at the same location as the current file
    await fs.writeFile(tempFilePath, code);

    const tempDocument = await vscode.workspace.openTextDocument(tempFilePath);
    const lineIndex = tempDocument.lineCount - 1;
    const characterIndex = tempDocument
        .lineAt(lineIndex)
        .text.indexOf(`${randomId}_PrettyType`);

    const quickInfo = await getQuickInfo(
        tempDocument,
        new vscode.Position(lineIndex, characterIndex),
    );

    // Delete the temporary file after getting the quick info
    await fs.unlink(tempFilePath);

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
