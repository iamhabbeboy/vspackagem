export const apiBaseUrl = "http://localhost:9200/v1";

interface PackageInfo {
  language: string;
  manager:
    | Array<{
        name: string;
        identifer: string;
        executor?: string;
      }>
    | string;
  executor?: string;
}
export const packageManagerInfo: PackageInfo[] = [
  {
    language: "npm",
    manager: [
      {
        name: "yarn",
        identifer: "yarn.lock",
        executor: "yarn add",
      },
      {
        name: "npm",
        identifer: "package-lock.json",
        executor: "npm install",
      },
    ],
  },
  {
    language: "goget",
    manager: "goget",
    executor: "go get",
  },
  {
    language: "composer",
    manager: "composer",
    executor: "go get",
  },
];
