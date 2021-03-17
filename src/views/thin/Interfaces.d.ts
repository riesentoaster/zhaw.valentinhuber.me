export interface Input {
  [node: string]: InputNode;
}

export interface InputNode {
  starting: boolean;
  accepting: boolean;
  paths: InputPaths;
}

export interface InputPaths {
  [input: string]: string[];
}

export interface NewNode {
  name: string;
  node: InputNode;
}

export interface Path {
  input: string;
  output: string[];
}

export interface Combination {
  starting: boolean;
  accepting: boolean;
  reached: boolean;
  nodes: string[];
  paths: Path[];
}
