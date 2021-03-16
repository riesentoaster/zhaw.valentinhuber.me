<template>
  <h1>DAE Generator</h1>
  <h2>Input</h2>
  <textarea rows="50" v-model="rawInput"></textarea>
  <button @click.prevent="beautifyTextArea">Beautify textarea</button>
  <p>Parsed Input:</p>
  <pre>{{parsedInput}}</pre>
  <p>Inputs: {{inputs}}</p>
  <p>Nodes: {{nodes}}</p>
  <h2>Output</h2>
  <table>
    <tr>
      <th>node</th>
      <th v-for="input of inputs" :key="input">{{input}}</th>
      <th>Starting</th>
      <th>Accepting</th>
    </tr>
    <tr v-for="combination of combinations" :key="combination.nodes">
      <td>{{combination.nodes[0]}}</td>
      <td v-for="path of combination.paths" :key="path.input">{{path.output[0]}}</td>
      <td>{{combination.starting}}</td>
      <td>{{combination.accepting}}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { ref, computed, ComputedRef } from 'vue';

interface Input {
  [node: string]: Node;
}
interface Node {
  starting: boolean;
  accepting: boolean;
  paths: Path[];
}
interface Path {
  input: string[];
  output: string[];
}
interface Combination {
  starting: boolean;
  accepting: boolean;
  reached: boolean;
  nodes: string[];
  paths: Path[];
}
export default {
  components: { },
  setup() {
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

    const rawInput = ref('{"node0":{"starting":true,"accepting":false,"paths":[{"input":["input1"],"output":["node1"]}]},"node1":{"starting":false,"accepting":false,"paths":[{"input":["input1"],"output":["node2"]},{"input":["input3"],"output":["node1","node2"]}]},"node2":{"starting":false,"accepting":false,"paths":[{"input":["input1"],"output":["node3"]},{"input":["input3"],"output":["node3","node4"]}]},"node3":{"starting":false,"accepting":false,"paths":[{"input":["input1"],"output":["node2"]},{"input":["input3"],"output":["node2"]}]},"node4":{"starting":false,"accepting":true,"paths":[]}}');
    const beautifyTextArea = () => {
      console.log('beautifying');
      rawInput.value = JSON.stringify(JSON.parse(rawInput.value), null, 2);
    };
    beautifyTextArea();
    const parsedInput: ComputedRef<Input> = computed(() => JSON.parse(rawInput.value));
    const nodes: ComputedRef<string[]> = computed(() => Object.keys(parsedInput.value));
    const inputs: ComputedRef<string[]> = computed(() => Object.values(parsedInput.value)
      .map((e) => e.paths.map((path) => path.input).flat()).flat()
      .filter((value, index, self) => self.indexOf(value) === index));

    const combinations = computed(() => {
      let res: Combination[] = [];
      // generate empty paths
      generatePermutations(nodes.value).forEach((element) => {
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
        inputs.value.forEach((input) => combination.paths.push({ input: [input], output: [] }));
        const shouldStart = (combination.nodes.length === 1
          && parsedInput.value[combination.nodes[0]].starting);
        // eslint-disable-next-line no-param-reassign
        combination.starting = combination.starting || shouldStart;
        const shouldAccept = combination.nodes
          .filter((node) => parsedInput.value[node].accepting).length > 0;
        // eslint-disable-next-line no-param-reassign
        combination.accepting = combination.accepting || shouldAccept;
      });
      // filling paths by input
      res.forEach((combination) => {
        const pathsToAdd: Path[] = [];
        combination.nodes.forEach((node) => {
          pathsToAdd.push(...parsedInput.value[node].paths);
        });
        combination.paths.forEach((path) => {
          path.output.push(...pathsToAdd
            .filter((e) => compareArray(e.input, path.input))
            .map((e) => e.output)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort());
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
    });

    return {
      rawInput,
      beautifyTextArea,
      parsedInput,
      inputs,
      nodes,
      combinations,
    };
  },
};

</script>

<style scoped>
textarea {
  width: 100%;
  white-space: pre-wrap;
  background-color: #c6cdd7;
  outline: none;
}
</style>
