import {SymbolKind} from "vscode-languageserver/node";

export const keywords: string[] = [
    'var', 'val', 'for', 'while', 'continue', 'break',
    'if', 'else', 'fun', 'return', 'import', 'package',
    'class', 'true', 'false', 'null', 'try', 'catch',
    'override', 'static', 'const', 'public', 'protected',
    'private', 'virtual', 'operator'
];

export const keywordsCompletions = keywords.map((name)=>{
    return {
        label: name,
        kind: SymbolKind.Key,
        documentation: `Riddle keyword`
    }
})