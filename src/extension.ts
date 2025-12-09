import * as vscode from 'vscode';
import { SidebarViewProvider } from './views/sidebarView.js';
import { generateReport } from './commands/generateReport.js';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('codereport.sidebarView', sidebarProvider)
  );

  context.subscriptions.push(
  vscode.commands.registerCommand("codereport.generateReport", (...args: any[]) =>
      generateReport(sidebarProvider)
    )
  );
}

export function deactivate() {}
