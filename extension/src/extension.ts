// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { InstallerPanel } from "./InstallerPanel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "packagem" is now active...!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "packagem.helloWorldx",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      // const panel = vscode.window.createWebviewPanel(
      //   "Packagem",
      //   "Package Manager",
      //   vscode.ViewColumn.One,
      //   {}
      // );
      InstallerPanel.createOrShow(context.extensionUri);
    //   let data: any;
    //   (async () => {
    
    //   })();

      vscode.window.showInformationMessage("Hello world");
    }
  );

  context.subscriptions.push(disposable);
}



function getWebviewContent() {
  let generator = `<!DOCTYPE html>
  <html lang="en">
  <head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
  (function() {
    const vscode = acquireVsCodeApi()
    const search = document.getElementById('search');
    vscode.postMessage({
      command: 'alert',
      text: search.textContent
    })
    console.log(search.textContent)
  }())
</script>
  </head>
  <body>
	<h3>Packagem</h3>
	<div className="search">
            <h2>Packagem Search</h2>
            <div class="inner">
                <input type="text" value="" />
                <button id="search">Search</button>
            </div>
            <div class="package-managers">
                <a href="#">
                    <img src="https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png" width="50" height="50" />
                </a>
                <a href="#">
                    <img src="https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/php_tczkal.png" width="50" height="50" />
                </a>
                <a href="#">
                    <img src="https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/go_qo9jg9.png" width="50" height="50" />
                </a>
            </div>
            <div>
            </div>
        </div>
	<div id="list">
	</div>

  </body>
  </html>`;

  return generator;
}

async function searchPackage() {
  // const response = await fetch(
  // 	"https://jsonplaceholder.typicode.com/posts"
  //   );
  //   const data = await response.json();
  //   const elem = document.getElementById('list');
  //   let li = '';
  //   for(let i in elem) {
  //     li += '<li>' + i.title + '</li>';
  //   }
  //   elem.innerHTML = li
}



// This method is called when your extension is deactivated
export function deactivate() {}

class Packagem {
  private readonly _extensionPath: string;

  private constructor(extensionPath: string) {
    this._extensionPath = extensionPath;
  }
}