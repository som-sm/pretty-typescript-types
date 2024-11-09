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
type ${randomId}_Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type ${randomId}_Exact = ${randomId}_Equal<${type}, ${randomId}_Result>;
    `;

    const tempFilePath = path.join(
        path.dirname(document.fileName),
        `${randomId}_Temp${path.extname(document.fileName)}`,
    );

    // Create a temporary file at the same location as the current file
    fs.writeFileSync(tempFilePath, code);

    const tempDocument = await vscode.workspace.openTextDocument(tempFilePath);
    const documentLastLineIndex = document.lineCount - 1;
    const characterOffset = "type ".length; // Index where `Result`/`Exact` types start

    const [quickInfoForResult, quickInfoForExact] = await Promise.all([
        getQuickInfo(
            tempDocument,
            new vscode.Position(documentLastLineIndex + 2, characterOffset),
        ),
        getQuickInfo(
            tempDocument,
            new vscode.Position(documentLastLineIndex + 4, characterOffset),
        ),
    ]);

    // Delete the temporary file after getting the quick info
    fs.unlinkSync(tempFilePath);

    // `quickInfoForExact` is to check if the computed prettified type is same as the original type
    if (!quickInfoForResult || !quickInfoForExact?.displayString.includes("true")) {
        return;
    }

    return extractQuickInfoParts(
        quickInfoForResult.displayString,
        quickInfoForResult.kind,
    )?.type;
}
