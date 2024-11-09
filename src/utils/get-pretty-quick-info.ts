import * as vscode from "vscode";
import { SUPPORTED_QUICKINFO_KINDS } from "./constants";
import { getQuickInfo } from "./get-quick-info";
import { getPrettyType } from "./get-pretty-type";
import { extractQuickInfoParts } from "./extract-quick-info-parts";

export async function getPrettyQuickInfo(
    document: vscode.TextDocument,
    position: vscode.Position,
): Promise<string | undefined> {
    const quickInfo = await getQuickInfo(document, position);
    if (!quickInfo || !SUPPORTED_QUICKINFO_KINDS.includes(quickInfo.kind)) {
        return;
    }

    const quickInfoParts = extractQuickInfoParts(quickInfo.displayString, quickInfo.kind);
    if (!quickInfoParts) {
        return;
    }

    const { prefix, type } = quickInfoParts;
    const prettyType = await getPrettyType(type, document);
    if (!prettyType) {
        return;
    }

    const prettyQuickInfo = `${prefix}${prettyType}`;
    if (prettyQuickInfo !== quickInfo.displayString) {
        return prettyQuickInfo;
    }
}
