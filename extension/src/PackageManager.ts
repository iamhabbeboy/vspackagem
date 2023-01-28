import * as vscode from "vscode";
import { NpmPackage, PackageInformation } from "./PackageInformation";
const { exec } = require("node:child_process");
const fs = require("fs");
const path = require("path");

export class PackageManager {
  private _webview: vscode.Webview;

  constructor(webview: vscode.Webview) {
    this._webview = webview;
  }

  public install(data: string) {
    const [vendor, name, command, module] = this._getPackageInfo(data);

    const workspacePath = this._getWorkspaceFolderPath();
    const path = `${workspacePath}/${module}`;
    let cmd = `cd ${workspacePath} && ${command}`;
    if (vendor === "npm" && !fs.existsSync(path)) {
      //file yarn doesnt exist
      cmd = `cd ${workspacePath} && npm install ${name}`;
    }

    this._processCommandExecution(name, cmd);
  }

  private _getWorkspaceFolderPath(fileName: string = ""): string {
    // TODO: improve to handle vscode workspace directory
    // TODO: improve to handle package module in sub directory
    let folders: string[] =
      vscode.workspace.workspaceFolders?.map(
        (folder: vscode.WorkspaceFolder) => folder.uri.fsPath
      ) || [];
    return folders[0];
  }

  private _processCommandExecution(name: string, cmd: string) {
    vscode.window.showInformationMessage(`${name} is about to be Installed`);
    const result = {
      type: "onSuccess",
      value: `${name} is installed`,
    };
    exec(cmd, (err: any, output: any) => {
      if (err) {
        vscode.window.showErrorMessage(`Could not install ${name}: ${err}`);
        result.type = "onError";
        result.value = `Could not install ${name}: ${err}`;

        this._webview.postMessage({
          command: "onInstalled",
          data: { type: "onError", value: `Could not install ${name}: ${err}` },
        });
        return false;
      }

      this._webview.postMessage({
        command: "onInstalled",
        data: { type: "onSuccess", value: name },
      });
      vscode.window.showInformationMessage(`Installed: ${output.toString()}`);
    });
  }

  private _getPackageInfo(data: any) {
    let command, module;
    let [vendor, name] = data.split("::");
    // const packageInfo = packageManagerInfo[vendor];
    // command = packageInfo.manager.length ? packageInfo.manager[]
    switch (vendor) {
      case "npm":
        command = `yarn add ${name}`;
        module = "yarn.lock";
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
    return [vendor, name, command, module];
  }

  public getInstalledPackages() {
    const workspaceFolder = this._getWorkspaceFolderPath();
    const packageInfo = new PackageInformation(new NpmPackage(workspaceFolder));
    packageInfo.packageManager.getDependencies();
  }
}
