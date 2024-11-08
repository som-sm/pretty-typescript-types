export function splitQuickInfo(
    quickInfo: string,
    quickInfoKind: string,
): [prefix: string, type: string] | undefined {
    const regex = new RegExp(`(\\(?${quickInfoKind}\\)?[^=:]+[:=]\\s+)([\\s\\S]+)`);
    return quickInfo.match(regex)?.slice(1, 3) as [string, string];
}
