<template>
  <div class="settings-container">
    <h1>配置页面</h1>
    <p>这里是配置页面的内容</p>
  </div>
</template>

<script setup lang="ts">
// 配置页面逻辑可以在这里添加
</script>

<style scoped>
.settings-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 16px;
}

p {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  h1 {
    color: #f5f5f5;
  }
  
  p {
    color: #ccc;
  }
}
</style>