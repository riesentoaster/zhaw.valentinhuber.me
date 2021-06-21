<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/thin">THIN</router-link> |
    <a href="https://github.com/riesentoaster/zhaw.valentinhuber.me">GitHub</a> |
    <a href="https://valentinhuber.me/about">About Me</a>
    <div v-if="new RegExp('^/thin(/.+)?$').test(this.$route.path)">
      <router-link to="/thin/dea">DEA</router-link>
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
