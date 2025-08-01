import { createSSRApp } from 'vue'
import pinia from './stores'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 使用 Pinia
  app.use(pinia)
  
  return {
    app,
    pinia
  }
} 