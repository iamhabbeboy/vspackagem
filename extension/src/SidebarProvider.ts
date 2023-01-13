import * as vscode from "vscode";
import { apiBaseUrl } from "./constant";
import { getNonce } from "./getNonce";
const { exec } = require("node:child_process");
const fs = require('fs');

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

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        //     case "report": {
        //       const message = await vscode.window.showInputBox({
        //         placeHolder: "why are you reporting this user?",
        //       });
        //       if (message) {
        //         await mutationNoErr(`/report`, { message, ...data.value });
        //         webviewView.webview.postMessage({
        //           command: "report-done",
        //           data,
        //         });
        //         vscode.window.showInformationMessage("Thank you for reporting!");
        //       }
        //       break;
        //     }
        //     case "unmatch": {
        //       const y = await vscode.window.showInformationMessage(
        //         `Are you sure you want to unmatch "${data.value.userName}"?`,
        //         "Yes",
        //         "No"
        //       );
        //       if (y === "Yes") {
        //         try {
        //           await mutation(`/unmatch`, { userId: data.value.userId });
        //           webviewView.webview.postMessage({
        //             command: "unmatch-done",
        //             payload: {},
        //           });
        //           vscode.window.showInformationMessage(`You unmatched "${data.value.userName}"`);
        //         } catch {}
        //       }
        //       break;
        //     }
        //     case "send-tokens": {
        //       webviewView.webview.postMessage({
        //         command: "init-tokens",
        //         payload: {
        //           accessToken: Util.getAccessToken(),
        //           refreshToken: Util.getRefreshToken(),
        //         },
        //       });
        //       break;
        //     }
        //     case "logout": {
        //       await Util.globalState.update(accessTokenKey, "");
        //       await Util.globalState.update(refreshTokenKey, "");
        //       SwiperPanel.kill();
        //       ViewCodeCardPanel.kill();
        //       break;
        //     }
        //     case "delete-account": {
        //       const y = await vscode.window.showInformationMessage(
        //         "Are you sure you want to delete your account?",
        //         "yes",
        //         "no"
        //       );
        //       if (y === "yes") {
        //         try {
        //           await mutation("/account/delete", {});
        //           await Util.globalState.update(accessTokenKey, "");
        //           await Util.globalState.update(refreshTokenKey, "");
        //           webviewView.webview.postMessage({
        //             command: "account-deleted",
        //             payload: {},
        //           });
        //           vscode.window.showInformationMessage("successfully deleted");
        //           SwiperPanel.kill();
        //           ViewCodeCardPanel.kill();
        //         } catch {}
        //       }
        //       break;
        //     }
        //     case "show-snippet-status": {
        //       SnippetStatus.show();
        //       break;
        //     }
        //     case "hide-snippet-status": {
        //       SnippetStatus.hide();
        //       break;
        //     }
        case "onInstall": {
          if (!data.value) {
            return;
          }
          let command, module;
          let [vendor, name] = data.value.split("::");
          switch (vendor) {
            case "npm":
              command = `yarn add ${name}`;
              module = "yarn.json";
              break;
            case "goget":
              command = `go get ${name}`;
              module = "go.mod";
              break;
            default:
              command = `composer require ${name}`;
              module = "composer.lock";
              break;
          }
          const fileName = vscode.window.activeTextEditor?.document.fileName;
          const f = vscode.workspace.workspaceFolders
            ?.map((folder) => folder.uri.fsPath)
            .filter((fsPath) => fileName?.startsWith(fsPath))[0];

          const p = `${f}/${module}`;
          var cmd = `cd ${f} && ${command}`;
          if (vendor === "npm" && !fs.existsSync(p)) {
            //file not exist
            cmd = `cd ${f} && npm install ${name}`;
          }
          vscode.window.showInformationMessage(`${name} is about to be Installed`);
          // exec(cmd, (err: any, output: any) => {
          //   if (err) {
          //     vscode.window.showErrorMessage(
          //       `Could not install ${name}: ${err}`
          //     );
          //     return;
          //   }
          //   console.log("Output: \n", output);
          // });
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        // case "tokens": {
        //   await Util.globalState.update(accessTokenKey, data.accessToken);
        //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
        //   break;
        // }
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
