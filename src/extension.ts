import * as path from 'path';
import { ExtensionContext } from 'vscode';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node';

export function activate(context: ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join('dist', 'server.js'));
  const serverOptions = {
    run:   { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: { execArgv: ['--nolazy', '--inspect=6009'] } }
  };
  
  const client = new LanguageClient(
    'riddleServer',      
    'Riddle Language Server',  
    serverOptions,        
    { documentSelector: [{ scheme: 'file', language: 'riddle' }] }
  );

  client.start();
  context.subscriptions.push(client);
}
