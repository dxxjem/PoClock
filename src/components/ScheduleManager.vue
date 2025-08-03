<template>
  <Card class="schedule-card" title="日程管理">
    <div class="schedule-content">
      <p>这里是日程管理功能区域</p>
      <Button type="primary">添加日程</Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, Button } from 'ant-design-vue'
</script>

<style scoped>
.schedule-card {
  margin: 20px;
  text-align: center;
}

.schedule-content {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
</style>