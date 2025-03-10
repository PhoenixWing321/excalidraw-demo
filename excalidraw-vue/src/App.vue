<script setup lang="ts">
import Excalidraw from './components/Excalidraw.vue'
</script>

<template>
  <div id="app">
    <Excalidraw msg="Excalidraw + Vue" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style>
/* 重置 Vite 的默认样式 */
#app {
  max-width: none !important; /* 移除最大宽度限制 */
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
