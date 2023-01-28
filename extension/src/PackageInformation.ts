const fs = require("fs");
const path = require("path");

interface PackageInterface {
  getDependencies(): string[];
  getDevDependencies(): string[];
}

export class PackageInformation {
  packageManager: PackageInterface;
  constructor(packageManager: PackageInterface) {
    this.packageManager = packageManager;
  }
}

export class NpmPackage implements PackageInterface {
  filePath: string;
  constructor(filePath: string) {
    this.filePath = path.join(filePath, "package.json");;
  }
  getDependencies(): string[] {
    if (this.filePath === "") {
      return [];
    }
    fs.readFile( this.filePath, { encoding: "utf-8" }, (err: Error, data: any) => {
        if (err) {
          console.log("received data: " + data);
          return false;
        }
       const jsonData = JSON.parse(data);
    });
    return [];
  }
  getDevDependencies(): string[] {
    return [];
  }
}
