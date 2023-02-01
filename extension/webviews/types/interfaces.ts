export interface PackageType {
  name: string;
  description: string;
  version: string;
  published: string;
  author: string;
  reference?: string;
}

export interface PackageProps {
  status: boolean;
  result: PackageType[];
}
