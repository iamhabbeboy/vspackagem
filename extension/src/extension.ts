// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { InstallerPanel } from "./InstallerPanel";


export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vspackagem" is now active...!');

  context.subscriptions.push(
    vscode.commands.registerCommand("vspackagem.search", () => {
      InstallerPanel.createOrShow(context.extensionUri);
      vscode.window.showInformationMessage("Hello world");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vspackagem.refresh", () => {
      InstallerPanel.kill();
      InstallerPanel.createOrShow(context.extensionUri);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  
}