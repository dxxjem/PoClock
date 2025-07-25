import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//import 'ant-design-vue/style.css'

createApp(App).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
