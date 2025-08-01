<template>
  <view id="app">
    <!-- 全局loading -->
    <van-loading 
      v-if="globalLoading" 
      type="spinner" 
      vertical
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      加载中...
    </van-loading>
  </view>
</template>

<script setup>
import { ref, onLaunch, onShow, onHide } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const globalLoading = ref(false)

onLaunch(() => {
  console.log('App Launch')
  // 初始化云开发
  initCloud()
  // 检查用户登录状态
  checkUserAuth()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})

// 初始化云开发
const initCloud = () => {
  try {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'wxb0725297216f8416', // 替换为你的云环境ID
        traceUser: true
      })
      console.log('云开发初始化成功')
    }
  } catch (error) {
    console.error('云开发初始化失败:', error)
  }
}

// 检查用户登录状态
const checkUserAuth = async () => {
  try {
    const res = await wx.cloud.callFunction({
      name: 'checkAuth'
    })
    if (res.result.success) {
      appStore.setUser(res.result.user)
    }
  } catch (error) {
    console.error('检查用户状态失败:', error)
  }
}
</script>

<style>
@import './static/css/main.css';

/* 全局样式 */
page {
  height: 100%;
  background-color: #f5f5f5;
}

#app {
  height: 100%;
}

/* 自定义类名 */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.shadow-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style> 