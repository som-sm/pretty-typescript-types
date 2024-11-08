import * as vscode from "vscode";
import { SUPPORTED_QUICKINFO_KINDS } from "./constants";
import { getQuickInfo } from "./get-quick-info";
import { prettifyType } from "./prettify-type";
import { splitQuickInfo } from "./split-quick-info";

export async function getPrettifiedQuickInfo(
    document: vscode.TextDocument,
    position: vscode.Position,
): Promise<string | undefined> {
    const quickInfo = await getQuickInfo(document, position);

    if (quickInfo && SUPPORTED_QUICKINFO_KINDS.includes(quickInfo.kind)) {
        const spilttedQuickInfo = splitQuickInfo(quickInfo.displayString, quickInfo.kind);

        if (spilttedQuickInfo) {
            const [prefix, type] = spilttedQuickInfo;
            const prettifiedType = prettifyType(type);

            if (prettifiedType) {
                const prettyDisplayString = `${prefix}${prettifiedType}`;

                if (prettyDisplayString !== quickInfo.displayString) {
                    return prettyDisplayString;
                }
            }
        }
    }
}
