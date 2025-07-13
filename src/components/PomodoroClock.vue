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