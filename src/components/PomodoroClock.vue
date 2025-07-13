<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Button, Switch, Typography, Space, Card } from 'ant-design-vue'
//import 'ant-design-vue/dist/reset.css'

declare global {
  interface Window {
    electronAPI: {
      sendNotification: (message: string) => void
    }
  }
}

defineProps<{ msg: string }>()

// 时钟状态
const isWorking = ref(true)
const timeLeft = ref(1 * 60)
const isRunning = ref(false)
let timer: number | null = null

// 格式化时间显示
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 切换工作/休息模式
const toggleMode = () => {
  //isWorking.value = !isWorking.value
  timeLeft.value = isWorking.value ? 1 * 60 : 5 * 60
  if (timer) {
    clearInterval(timer)
    timer = null
    isRunning.value = false
  }
}

// 开始/暂停计时器
const toggleTimer = () => {
  if (isRunning.value) {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  } else {
    timer = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        // 计时结束，发送通知
        if (window.electronAPI) {
          window.electronAPI.sendNotification(isWorking.value ? '工作时间结束！' : '休息时间结束！')
        }
        toggleMode()
      }
    }, 1000)
  }
  isRunning.value = !isRunning.value
}

// 组件卸载时清除计时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <Card class="clock-card" title="番茄时钟">
    <Space direction="vertical" size="large" align="center">
      <Typography.Title :level="1">{{ formatTime(timeLeft) }}</Typography.Title>
      <div class="switch-label-row">
        <Switch
          v-model:checked="isWorking"
          @change="toggleMode"
        />
        <label class="mode-label">
          {{ isWorking ? '工作' : '休息' }}
        </label>
      </div>
      <Space size="middle">
        <Button type="primary" @click="toggleTimer" :loading="isRunning">
          {{ isRunning ? '暂停' : '开始' }}
        </Button>
      </Space>
    </Space>
  </Card>
</template>

<style scoped>
.clock-card {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 24px;
}
</style>
<style scoped>
.switch-label-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.mode-label {
  font-size: 16px;
  margin-left: 8px;
}
</style>
<style scoped>
.ant-switch {
  width: 56px !important;
  height: 28px !important;
  min-width: 56px !important;
  background: #e6f7ff !important;
  border: 2px solid #1890ff !important;
  box-shadow: 0 0 4px #1890ff44;
}
.ant-switch-checked {
  background: #1890ff !important;
  border-color: #1890ff !important;
}
.ant-switch .ant-switch-handle {
  width: 24px !important;
  height: 24px !important;
  top: 1px !important;
  left: 1px !important;
}
.ant-switch-checked .ant-switch-handle {
  left: calc(100% - 25px) !important;
}
.ant-switch .ant-switch-inner {
  font-size: 16px !important;
}
</style>