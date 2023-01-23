import * as vscode from "vscode";
import { packageManagerInfo } from "./constant";
const { exec } = require("node:child_process");
const fs = require("fs");

export class PackageManager {
  constructor() {}
  public install(data: any) {
    const [vendor, name, command, module] = this._getPackageInfo(data);
    const fileName = vscode.window.activeTextEditor?.document.fileName;
    const f = vscode.workspace.workspaceFolders
      ?.map((folder) => folder.uri.fsPath)
      .filter((fsPath) => fileName?.startsWith(fsPath))[0];

    const p = `${f}/${module}`;
    var cmd = `cd ${f} && ${command}`;
    if (vendor === "npm" && !fs.existsSync(p)) {
      //file yarn doesn not exist
      cmd = `cd ${f} && npm install ${name}`;
    }

    this._processCommandExecution(name, cmd);
  }

  private _processCommandExecution(name: string, cmd: string) {
    vscode.window.showInformationMessage(`${name} is about to be Installed`);
    exec(cmd, (err: any, output: any) => {
      if (err) {
        vscode.window.showErrorMessage(`Could not install ${name}: ${err}`);
        return;
      }
      vscode.window.showErrorMessage(`Installed: ${output.toString()}`);
    });
  }

  private _getPackageInfo(data: any) {
    let command, module;
    let [vendor, name] = data.value.split("::");
    // const packageInfo = packageManagerInfo[vendor];
    // command = packageInfo.manager.length ? packageInfo.manager[]
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
    return [vendor, name, command, module];
  }
}
