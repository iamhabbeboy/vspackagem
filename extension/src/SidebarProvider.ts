import * as vscode from "vscode";
import { apiBaseUrl } from "./constant";
import { getNonce } from "./getNonce";
import { PackageManager } from "./PackageManager";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage( (data) => {
      const pkg = new PackageManager(webviewView.webview);
      switch (data.type) {
        case "onInstall": {
          if (!data.value) {
            return;
          }
          pkg.install(data.value);
          break;
        }
        case "onPackageListing": { 
          pkg.getInstalledPackages();
          break;
        }
        case "onInfo": {
          // if (!data.value) {
          //   return;
          // }
          // post message to webview
  
          return data;
          // vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const assetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media")
    );

    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src 'self' https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        }; script-src 'nonce-${nonce}';">
        <meta name="image-path" content="${assetUri}"  />
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi() 
          const apiBaseUrl = ${JSON.stringify(apiBaseUrl)}
        </script>
			</head>
      <body>
      <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }

//   private _getWebviewOptions(   
//     extensionUri: vscode.Uri
// ): vscode.WebviewOptions {
//     return {    
//         enableScripts: true,
//         localResourceRoots: [
//             vscode.Uri.joinPath(extensionUri, 'media'),
//         ]
//     };
// }

}
