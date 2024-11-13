export function extractQuickInfoParts(
    quickInfo: string,
    quickInfoKind: string,
): { prefix: string; type: string } | undefined {
    const regex = new RegExp(
        `(?<prefix>\\(?${quickInfoKind}\\)?[^=:]+[:=]\\s+)(?<type>[\\s\\S]+)`,
    );
    const match = quickInfo.match(regex);
    if (!match?.groups?.prefix || !match.groups.type) {
        return;
    }
    return { prefix: match.groups.prefix, type: match.groups.type };
}
