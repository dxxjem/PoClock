<script setup lang="ts">
import { ref } from 'vue'
import PomodoroClock from './components/PomodoroClock.vue'
import Settings from './components/Settings.vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons-vue'

const activeMenu = ref('pomodoro')

const menus = [
  {
    key: 'pomodoro',
    icon: MenuUnfoldOutlined,
    title: '番茄时钟',
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    title: '配置',
  }
]

const changeMenu = (key: string) => {
  activeMenu.value = key
}

// 窗口控制函数
const minimizeWindow = () => {
  if (window.electronAPI && (window.electronAPI as any).minimizeWindow) {
    (window.electronAPI as any).minimizeWindow()
  }
}

const maximizeWindow = () => {
  if (window.electronAPI && (window.electronAPI as any).maximizeWindow) {
    (window.electronAPI as any).maximizeWindow()
  }
}

const closeWindow = () => {
  if (window.electronAPI && (window.electronAPI as any).closeWindow) {
    (window.electronAPI as any).closeWindow()
  }
}
</script>

<template>
  <div class="app-container">
    <!-- 顶部任务栏 -->
    <div class="title-bar">
      <div class="title-bar-text">番茄时钟</div>
      <div class="title-bar-controls">
        <button class="title-bar-button minimize" @click="minimizeWindow">─</button>
        <button class="title-bar-button maximize" @click="maximizeWindow">□</button>
        <button class="title-bar-button close" @click="closeWindow">✕</button>
      </div>
    </div>
    
    <div class="layout-container">
      <!-- 左侧菜单 -->
      <div class="sidebar">
        <div class="logo">
          <img src="./assets/vue.svg" alt="Logo" />
        </div>
        <div class="menu">
          <div 
            v-for="menu in menus" 
            :key="menu.key"
            class="menu-item"
            :class="{ active: activeMenu === menu.key }"
            @click="changeMenu(menu.key)"
            :title="menu.title"
          >
            <component :is="menu.icon" class="menu-icon" />
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content">
        <div v-if="activeMenu === 'pomodoro'">
          <PomodoroClock msg="个人办公助手" />
        </div>
        <div v-else-if="activeMenu === 'settings'">
          <Settings />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  -webkit-app-region: drag;
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.title-bar {
  height: 30px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.title-bar-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  -webkit-app-region: drag;
}

.title-bar-controls {
  display: flex;
  gap: 5px;
  -webkit-app-region: no-drag;
}

.title-bar-button {
  width: 25px;
  height: 20px;
  border: none;
  background: transparent;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 3px;
  -webkit-app-region: no-drag;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

.title-bar-button:hover {
  background-color: #e0e0e0;
}

.title-bar-button.close:hover {
  background-color: #ff5555;
  color: white;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .title-bar {
    background-color: #333;
    border-bottom: 1px solid #555;
  }
  
  .title-bar-text {
    color: #f5f5f5;
  }
  
  .title-bar-button {
    color: #f5f5f5;
  }
  
  .title-bar-button:hover {
    background-color: #555;
  }
  
  .title-bar-button.close:hover {
    background-color: #ff5555;
    color: white;
  }
}

.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  padding-top: 30px;
  box-sizing: border-box;
}

.sidebar {
  width: 64px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  -webkit-app-region: no-drag;
  overflow: hidden;
  height: calc(100vh - 30px);
  position: fixed;
  top: 30px;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.logo {
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid #ddd;
}

.logo img {
  height: 32px;
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  overflow: hidden;
}

.menu-item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
  -webkit-app-region: no-drag;
  color: #333;
}

.menu-item:hover {
  background: #e6f7ff;
}

.menu-item.active {
  background: #1890ff;
  color: white;
}

.menu-item.active::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid #fff;
}

.menu-icon {
  font-size: 18px;
  -webkit-app-region: no-drag;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .sidebar {
    background: #333;
    border-right: 1px solid #555;
  }
  
  .logo {
    border-bottom: 1px solid #555;
  }
  
  .menu-item {
    color: #f5f5f5;
  }
  
  .menu-item:hover {
    background: #005f9e;
  }
}

.content {
  flex: 1;
  overflow: hidden;
  -webkit-app-region: no-drag;
  height: calc(100vh - 30px);
  margin-top: 30px;
  margin-left: 64px;
}

.settings-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

/* 彻底隐藏滚动条 */
::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* 针对所有可能滚动的元素彻底隐藏滚动条 */
.layout-container,
.sidebar,
.menu,
.content {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE 10+ */
}
</style>

<style>
/* 全局隐藏滚动条 */
::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
html, body {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  overflow: hidden !important;
}
</style>