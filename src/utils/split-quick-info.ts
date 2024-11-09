export function splitQuickInfo(
    quickInfo: string,
    quickInfoKind: string,
): { prefix: string; type: string } | undefined {
    const regex = new RegExp(
        `(?<prefix>\\(?${quickInfoKind}\\)?[^=:]+[:=]\\s+)(?<type>[\\s\\S]+)`,
    );
    const match = quickInfo.match(regex);
    if (match?.groups) {
        return { prefix: match.groups.prefix, type: match.groups.type };
    }
}
