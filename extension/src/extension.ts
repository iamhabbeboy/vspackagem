// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { InstallerPanel } from "./InstallerPanel";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vspackagem-sidebar",
      sidebarProvider
    )
  );
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
      // setTimeout(() => {
      //   vscode.commands.executeCommand(
      //     "workbench.action.webview.openDeveloperTools"
      //   );
      // }, 500);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
