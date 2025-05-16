import { createConnection, TextDocuments, ProposedFeatures, DiagnosticSeverity, TextDocumentSyncKind, DocumentSymbol, SymbolKind, Hover, TextDocumentPositionParams } from 'vscode-languageserver/node';
import { TextDocument } from "vscode-languageserver-textdocument";
import {Diagnostic} from "vscode-languageclient";
import {CompletionItem} from "vscode-languageserver";
import {keywordsCompletions} from "./keywords";

// 创建连接
const connection = createConnection(ProposedFeatures.all);

// 创建一个文档管理器
const documents = new TextDocuments(TextDocument);

// 文档初始化
connection.onInitialize(() => {
  connection.console.log('Server is initializing...');
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: { resolveProvider: true },
      documentSymbolProvider: true, // 启用文档符号提供
      hoverProvider: true
    }
  };
});

// 监听文档变化
documents.onDidChangeContent(change => {
  // 简单的语法检查或其他逻辑
  const diagnostics: Array<Diagnostic> = [];
  const text = change.document.getText();

  if (text.includes('error')) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 5 }
      },
      message: 'Invalid keyword: "error"',
      source: 'riddle'
    });
  }

  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

// 处理文档符号请求
connection.onDocumentSymbol((params): DocumentSymbol[] => {
  const document = documents.get(params.textDocument.uri);

  // 示例：返回一个简单的符号（你可以根据实际情况提取更多符号）
  const symbols: DocumentSymbol[] = [
    {
      name: 'myFunction',               // 符号名称
      kind: SymbolKind.Function,        // 符号类型：函数
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 10 }
      },
      selectionRange: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 10 }
      }
    },
    {
      name: 'myVariable',              // 符号名称
      kind: SymbolKind.Variable,       // 符号类型：变量
      range: {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 10 }
      },
      selectionRange: {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 10 }
      }
    }
  ];
  return symbols;
});

// 处理补全请求
connection.onCompletion((textDocumentPosition: TextDocumentPositionParams) => {
  return keywordsCompletions;
});

connection.onCompletionResolve((item: CompletionItem) => {
  // 在补全项被选中时，返回更详细的信息
  if (item.label === 'function1') {
    item.documentation = 'Detailed documentation for function1';
    item.detail = 'Additional details for function1';
  }

  return item;
});

// 处理悬停提示
connection.onHover((textDocumentPosition: TextDocumentPositionParams): Hover => {
  return {
    contents: { kind: 'markdown', value: 'This is a function or variable description.' }
  };
});

// 监听文档内容变化
documents.listen(connection);

// 启动连接
connection.listen();
