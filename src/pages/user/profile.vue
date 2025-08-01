<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 用户信息卡片 -->
    <view class="bg-white">
      <view class="container py-6">
        <view class="flex items-center space-x-4">
          <image 
            :src="userInfo.avatarUrl || '/static/images/default-avatar.png'"
            class="w-20 h-20 rounded-full"
            mode="aspectFill"
          />
          <view class="flex-1">
            <text class="text-xl font-semibold text-gray-800 block">{{ userInfo.nickName || '美食达人' }}</text>
            <text class="text-gray-500 text-sm">{{ userInfo.signature || '热爱生活，热爱美食' }}</text>
          </view>
          <van-icon name="edit" size="20" @click="editProfile" />
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="mx-4 mt-4">
      <view class="card">
        <view class="grid grid-cols-3 gap-4 text-center">
          <view @click="viewMyRecipes">
            <text class="text-2xl font-bold text-primary-500 block">{{ appStore.recipeCount }}</text>
            <text class="text-sm text-gray-500">我的食谱</text>
          </view>
          <view>
            <text class="text-2xl font-bold text-secondary-500 block">{{ favoriteCount }}</text>
            <text class="text-sm text-gray-500">收藏</text>
          </view>
          <view>
            <text class="text-2xl font-bold text-yellow-500 block">{{ cookingDays }}</text>
            <text class="text-sm text-gray-500">烹饪天数</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="mx-4 mt-4">
      <view class="card">
        <view class="space-y-1">
          <view class="menu-item" @click="viewMyRecipes">
            <view class="flex items-center">
              <text class="text-2xl mr-3">📝</text>
              <text class="text-gray-800">我的食谱</text>
            </view>
            <van-icon name="arrow" />
          </view>
          
          <view class="menu-item" @click="viewFavorites">
            <view class="flex items-center">
              <text class="text-2xl mr-3">❤️</text>
              <text class="text-gray-800">我的收藏</text>
            </view>
            <van-icon name="arrow" />
          </view>
          
          <view class="menu-item" @click="viewCookingHistory">
            <view class="flex items-center">
              <text class="text-2xl mr-3">📈</text>
              <text class="text-gray-800">烹饪记录</text>
            </view>
            <van-icon name="arrow" />
          </view>
          
          <view class="menu-item" @click="exportData">
            <view class="flex items-center">
              <text class="text-2xl mr-3">📤</text>
              <text class="text-gray-800">导出数据</text>
            </view>
            <van-icon name="arrow" />
          </view>
        </view>
      </view>
    </view>

    <!-- 设置菜单 -->
    <view class="mx-4 mt-4">
      <view class="card">
        <text class="block text-lg font-semibold text-gray-800 mb-3">设置</text>
        <view class="space-y-1">
          <view class="menu-item" @click="showAbout">
            <view class="flex items-center">
              <text class="text-2xl mr-3">ℹ️</text>
              <text class="text-gray-800">关于应用</text>
            </view>
            <van-icon name="arrow" />
          </view>
          
          <view class="menu-item" @click="feedback">
            <view class="flex items-center">
              <text class="text-2xl mr-3">💬</text>
              <text class="text-gray-800">意见反馈</text>
            </view>
            <van-icon name="arrow" />
          </view>
          
          <view class="menu-item" @click="clearCache">
            <view class="flex items-center">
              <text class="text-2xl mr-3">🗑️</text>
              <text class="text-gray-800">清除缓存</text>
            </view>
            <text class="text-gray-400 text-sm">{{ cacheSize }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="mx-4 mt-4 mb-4">
      <view class="text-center text-gray-400 text-sm">
        <text>美食食谱 v1.0.0</text>
      </view>
    </view>

    <!-- 编辑资料弹窗 -->
    <van-popup v-model:show="showEditDialog" position="bottom" round>
      <view class="p-6">
        <text class="block text-lg font-semibold text-gray-800 mb-4">编辑资料</text>
        
        <van-field
          v-model="editForm.nickName"
          label="昵称"
          placeholder="请输入昵称"
          class="mb-4"
        />
        
        <van-field
          v-model="editForm.signature"
          label="个性签名"
          placeholder="请输入个性签名"
          type="textarea"
          rows="3"
          class="mb-4"
        />
        
        <view class="flex space-x-3">
          <van-button type="default" size="large" class="flex-1" @click="cancelEdit">
            取消
          </van-button>
          <van-button type="primary" size="large" class="flex-1" @click="saveProfile">
            保存
          </van-button>
        </view>
      </view>
    </van-popup>

    <!-- 关于应用弹窗 -->
    <van-popup v-model:show="showAboutDialog" position="center" round>
      <view class="p-6 w-80">
        <view class="text-center mb-4">
          <text class="text-2xl">🍳</text>
          <text class="block text-lg font-semibold text-gray-800 mt-2">美食食谱</text>
          <text class="text-sm text-gray-500">v1.0.0</text>
        </view>
        
        <text class="text-gray-600 text-sm leading-relaxed mb-4 block">
          这是一个专为你的女朋友打造的食谱应用，记录美食制作过程，分享烹饪心得，让爱意在每一道菜中传递。
        </text>
        
        <view class="text-center">
          <van-button type="primary" size="small" @click="closeAbout">
            确定
          </van-button>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { showToast, showModal, getUserProfile } from '@/utils'

const appStore = useAppStore()

// 响应式数据
const showEditDialog = ref(false)
const showAboutDialog = ref(false)
const favoriteCount = ref(0)
const cookingDays = ref(0)
const cacheSize = ref('0 MB')

// 用户信息
const userInfo = reactive({
  nickName: '',
  avatarUrl: '',
  signature: ''
})

// 编辑表单
const editForm = reactive({
  nickName: '',
  signature: ''
})

// 生命周期
onMounted(() => {
  loadUserInfo()
  loadStatistics()
  calculateCacheSize()
})

// 方法
const loadUserInfo = () => {
  try {
    const info = wx.getStorageSync('userInfo')
    if (info) {
      Object.assign(userInfo, JSON.parse(info))
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const loadStatistics = () => {
  // 加载收藏数量
  try {
    const favorites = wx.getStorageSync('favorites')
    favoriteCount.value = favorites ? JSON.parse(favorites).length : 0
  } catch (error) {
    favoriteCount.value = 0
  }
  
  // 计算烹饪天数（模拟数据）
  cookingDays.value = Math.max(1, Math.floor(appStore.recipeCount * 1.5))
}

const calculateCacheSize = () => {
  // 模拟缓存大小计算
  const size = Math.random() * 50 + 10 // 10-60MB
  cacheSize.value = `${size.toFixed(1)} MB`
}

const editProfile = async () => {
  // 如果没有用户信息，先获取授权
  if (!userInfo.nickName) {
    try {
      const profile = await getUserProfile()
      userInfo.nickName = profile.userInfo.nickName
      userInfo.avatarUrl = profile.userInfo.avatarUrl
      saveUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
  
  editForm.nickName = userInfo.nickName
  editForm.signature = userInfo.signature
  showEditDialog.value = true
}

const cancelEdit = () => {
  showEditDialog.value = false
}

const saveProfile = () => {
  userInfo.nickName = editForm.nickName
  userInfo.signature = editForm.signature
  saveUserInfo()
  showEditDialog.value = false
  showToast('保存成功', 'success')
}

const saveUserInfo = () => {
  try {
    wx.setStorageSync('userInfo', JSON.stringify(userInfo))
  } catch (error) {
    console.error('保存用户信息失败:', error)
  }
}

const viewMyRecipes = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

const viewFavorites = () => {
  showToast('收藏功能开发中...')
}

const viewCookingHistory = () => {
  showToast('烹饪记录功能开发中...')
}

const exportData = async () => {
  const confirm = await showModal('导出数据', '是否导出所有食谱数据？')
  if (confirm) {
    showToast('导出功能开发中...')
  }
}

const showAbout = () => {
  showAboutDialog.value = true
}

const closeAbout = () => {
  showAboutDialog.value = false
}

const feedback = () => {
  showToast('请通过微信联系开发者')
}

const clearCache = async () => {
  const confirm = await showModal('清除缓存', '确定要清除所有缓存数据吗？')
  if (confirm) {
    try {
      // 清除部分缓存数据
      wx.removeStorageSync('randomHistory')
      cacheSize.value = '0 MB'
      showToast('缓存清除成功', 'success')
    } catch (error) {
      showToast('清除失败')
    }
  }
}
</script>

<style scoped>
.menu-item {
  @apply flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0;
}
</style> 