import * as ts from "typescript";
import {
    createSystem,
    createVirtualTypeScriptEnvironment,
    createDefaultMapFromNodeModules,
} from "@typescript/vfs";

export function getPrettyType(type: string): string | undefined {
    const code = `
    type Prettify<T> = T extends Function | string | number ? T: {[P in keyof T]: Prettify<T[P]>};
    type Result = Prettify<${type}>;
    `;
    const compilerOpts: ts.CompilerOptions = {};

    const filesMap = createDefaultMapFromNodeModules(compilerOpts);
    const tempFileName = "temp.ts";
    filesMap.set(tempFileName, code);

    const system = createSystem(filesMap);
    const env = createVirtualTypeScriptEnvironment(
        system,
        [tempFileName],
        ts,
        compilerOpts,
    );

    const diagnostics = env.languageService.getSemanticDiagnostics(tempFileName);
    if (diagnostics.length > 0) {
        return undefined;
    }

    const quickInfo = env.languageService.getQuickInfoAtPosition(
        tempFileName,
        code.indexOf("Result"),
    );

    return quickInfo?.displayParts
        ?.slice(6)
        .map((part) => part.text)
        .join("");
}
