<template>
  <h1>DEA Generator</h1>
  <h2>Input</h2>
  <div v-if="Object.keys(input).length > 0">
    <h3>Add Input</h3>
  <input type="text" v-model="newInput">
  <button @click.prevent="addInput()">Add Input</button>
  </div>
  <h3>Current NEA</h3>
  <p>Careful: Adding paths to inexisting nodes will brake the generator.</p>
  <table>
    <tr>
      <th>Node</th>
      <th>Starting</th>
      <th>Accepting</th>
      <th v-for="input of inputs" :key="input">{{input}}</th>
      <th>Actions</th>
    </tr>
    <tr v-for="[nodeName, node] of Object.entries(input).sort()" :key="nodeName">
      <td>{{nodeName}}</td>
      <td>{{node.starting}}</td>
      <td>{{node.accepting}}</td>
      <td v-for="input of inputs" :key="input">
        {{node.paths[input]?.length > 0 ? node.paths[input].join(', '): ''}}
      </td>
      <td><button @click.prevent="removeNode(nodeName)">Delete node</button></td>
    </tr>
    <tr>
      <td><input type="text" v-model="newNode.name"></td>
      <td><input type="checkbox" v-model="newNode.starting"></td>
      <td><input type="checkbox" v-model="newNode.accepting"></td>
      <td v-for="inputt of inputs" :key="inputt">
        <input type="text" v-model="newNode.paths[inputt]">
      </td>
      <td>
        <button @click.prevent="addNode()">Add node</button>
      </td>
    </tr>
  </table>

  <h2>Output</h2>
  <table>
    <tr>
      <th>node</th>
      <th v-for="input of inputs" :key="input">{{input}}</th>
      <th>Starting</th>
      <th>Accepting</th>
    </tr>
    <tr v-for="combination of output" :key="combination.nodes">
      <td>{{combination.nodes[0]}}</td>
      <td v-for="path of combination.paths" :key="path.input">{{path.output[0]}}</td>
      <td>{{combination.starting}}</td>
      <td>{{combination.accepting}}</td>
    </tr>
  </table>
  <h2>Raw Input</h2>
  <pre>{{input}}</pre>
  <h2>Raw Output</h2>
  <pre>{{output}}</pre>
</template>

<script lang="ts">
import {
  ref, computed, reactive,
} from 'vue';
// import * as _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import { generateCombinations, generateInputs } from './generateDEA';
import { InputNode, NewNode } from './Interfaces.d';

export default {
  components: { },
  setup() {
    const input = reactive(JSON.parse('{"node0":{"starting":true,"accepting":false,"paths":{"input1":["node1"]}},"node1":{"starting":false,"accepting":false,"paths":{"input1":["node1","node2"]}},"node2":{"starting":false,"accepting":true,"paths":{"input0":["node1"],"input2":["node0"]}}}'));
    const inputs = computed(() => generateInputs(input));
    const output = computed(() => generateCombinations(input));
    const newInput = ref('');
    const newNode: NewNode = reactive({
      name: '',
      starting: false,
      accepting: false,
      paths: Object.fromEntries(inputs.value.map((e) => [e, ''])),

    });
    const removeNode = (node: string) => {
      delete input[node];
      Object.keys(newNode.paths).forEach((path) => {
        if (inputs.value.indexOf(path) < 0) {
          delete newNode.paths[path];
        }
      });
    };
    const addInput = () => {
      if (inputs.value.indexOf(newInput.value) < 0) {
        const firstNode = Object.keys(input)[0];
        input[firstNode].paths[newInput.value] = [];
      }
    };
    const addNode = () => {
      const nodeToAdd: InputNode = {
        starting: newNode.starting,
        accepting: newNode.accepting,
        paths: Object.fromEntries(Object.entries(newNode.paths)
          .map(([inputt, outputt]) => [inputt,
            outputt.split(',').map((e) => e.trim()).sort()])),
      };
      input[newNode.name] = cloneDeep(nodeToAdd);
    };
    return {
      input,
      inputs,
      output,
      newInput,
      removeNode,
      addInput,
      newNode,
      addNode,
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
table {
  width: 100%;
}
td {
  text-align: center;
}
</style>
