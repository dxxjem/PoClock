<script setup lang="ts">
import PomodoroClock from './components/PomodoroClock.vue'
</script>

<template>
  <div class="app-drag">
    <a href="https://vuejs.org/" target="_blank" class="no-drag">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <PomodoroClock msg="个人办公助手" class="no-drag" />
  </div>
</template>

<style>
.app-drag {
  width: 100vw;
  height: 100vh;
  -webkit-app-region: drag;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  display: none;
}
.no-drag {
  -webkit-app-region: no-drag;
}
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
