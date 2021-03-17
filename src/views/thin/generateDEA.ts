import { Combination, Input, InputPaths } from './Interfaces.d';

// TODO: What if path points to non-existing node?

const compareArray = (a: unknown[], b: unknown[]) => {
  if (a == null || a === undefined || b == null || b === undefined) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generatePermutations = (arr: any) => {
  const res = [];
  for (let i = 0; i < 2 ** arr.length; i += 1) {
    const temp = [];
    for (let j = 0; j < arr.length; j += 1) {
      // eslint-disable-next-line no-bitwise
      if (i & (2 ** j)) {
        temp.push(arr[j]);
      }
    }
    res.push(temp);
  }
  return res.sort((a, b) => a.length - b.length);
};

const generateInputs = (input: Input) => Object.values(input)
  .map((node) => Object.keys(node.paths)).flat()
  .filter((value, index, self) => self.indexOf(value) === index)
  .sort();

const generateNodes = (input: Input) => Object.keys(input);

const generateCombinations = (input: Input) => {
  const nodes = generateNodes(input);
  const inputs = generateInputs(input);
  let res: Combination[] = [];
  // generate empty paths
  generatePermutations(nodes).forEach((element) => {
    res.push({
      nodes: element,
      paths: [],
      accepting: false,
      starting: false,
      reached: false,
    });
  });

  // generate paths for all inputs
  res.forEach((combination) => {
    // inputs.forEach((inputt) => combination.paths.push({ input: [inputt], output: [] }));
    const shouldStart = (combination.nodes.length === 1
      && input[combination.nodes[0]].starting);
    // eslint-disable-next-line no-param-reassign
    combination.starting = combination.starting || shouldStart;
    const shouldAccept = combination.nodes
      .filter((node) => input[node].accepting).length > 0;
    // eslint-disable-next-line no-param-reassign
    combination.accepting = combination.accepting || shouldAccept;
  });

  // filling paths by input
  res.forEach((combination) => {
    const pathsToAdd: InputPaths = {};
    inputs.forEach((inputt) => { pathsToAdd[inputt] = []; });
    combination.nodes.forEach((node) => {
      Object.entries(input[node].paths).forEach(([key, value]) => {
        pathsToAdd[key].push(...value);
      });
    });
    Object.entries(pathsToAdd)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    Object.entries(pathsToAdd).forEach(([inputt, outputts]) => {
      combination.paths.push({ input: inputt, output: outputts });
    });
  });
  // eslint-disable-next-line no-param-reassign
  res.forEach((combination) => { combination.reached = combination.starting; });
  // tag reached combinations
  let addedReached = true;
  while (addedReached) {
    addedReached = false;
    res.filter((combination) => combination.reached)
      // eslint-disable-next-line no-loop-func
      .forEach((combination) => {
        res.forEach((compareCombination) => {
          if (!compareCombination.reached) {
            combination.paths.forEach((path) => {
              const reaches = (path.output.length > 0
                && compareArray(path.output, compareCombination.nodes));
              if (reaches) {
                // eslint-disable-next-line no-param-reassign
                compareCombination.reached = true;
                addedReached = true;
              }
            });
          }
        });
      });
  }
  // return res;
  res = res.filter((e) => e.reached);
  res.forEach((combination, index) => {
    res.forEach((compareCombination) => {
      compareCombination.paths.forEach((comparePath) => {
        if (compareArray(comparePath.output, combination.nodes)) {
          // eslint-disable-next-line no-param-reassign
          comparePath.output = [String(index)];
        }
      });
    });
    // eslint-disable-next-line no-param-reassign
    combination.nodes = [String(index)];
  });
  return res;
};

export { generateCombinations, generateInputs, generateNodes };
