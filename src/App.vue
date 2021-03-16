<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <a href="https://github.com/riesentoaster/zhaw.valentinhuber.me">GitHub</a> |
    <router-link to="/thin">THIN</router-link>
    <div v-if="new RegExp('^/thin(/.+)?$').test(this.$route.path)">
      <router-link to="/thin/dae">DAE</router-link>
    </div>
  </nav>
  <main>
    <router-view/>
  </main>
</template>

<script lang="ts">
export default {
  setup() {
    return {
    };
  },
};
</script>
