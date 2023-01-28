const fs = require("fs");
const path = require("path");

interface PackageInterface {
  getDependencies(): Promise<any>;
  getDevDependencies(): Promise<any>;
  getJsonData(filePath: string): Promise<any>;
}

interface NpmPackageType {
    dependencies: any;
    devDependencies: any;
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
    this.filePath = path.join(filePath, "package.json");
  }

  getJsonData(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err: Error, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data));
      });
    });
  }

  async getDependencies(): Promise<any> {
    if (this.filePath === "") {
      return false;
    }
    const data: NpmPackageType = await this.getJsonData(this.filePath);
    return data && data.dependencies || {};
  }

  async getDevDependencies(): Promise<any> {
    if (this.filePath === "") {
        return false;
      }
      const data: NpmPackageType = await this.getJsonData(this.filePath);
      return data && data.devDependencies || {};
  }
}
