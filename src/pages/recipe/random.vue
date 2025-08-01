<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 顶部区域 -->
    <view class="bg-white shadow-sm">
      <view class="container py-6">
        <text class="text-2xl font-bold text-gray-800 mb-2 block text-center">🎲 随机美食</text>
        <text class="text-gray-500 text-center block">不知道吃什么？让我来帮你决定！</text>
      </view>
    </view>

    <!-- 筛选条件 -->
    <view class="mx-4 mt-4">
      <view class="card">
        <text class="block text-lg font-semibold text-gray-800 mb-4">筛选条件</text>
        
        <!-- 难度筛选 -->
        <view class="mb-4">
          <text class="block text-sm text-gray-600 mb-2">难度</text>
          <view class="flex space-x-2">
            <van-button 
              size="small"
              :type="filters.difficulty === null ? 'primary' : 'default'"
              @click="setDifficulty(null)"
            >
              不限
            </van-button>
            <van-button 
              size="small"
              :type="filters.difficulty === 1 ? 'primary' : 'default'"
              @click="setDifficulty(1)"
            >
              简单
            </van-button>
            <van-button 
              size="small"
              :type="filters.difficulty === 2 ? 'primary' : 'default'"
              @click="setDifficulty(2)"
            >
              中等
            </van-button>
            <van-button 
              size="small"
              :type="filters.difficulty === 3 ? 'primary' : 'default'"
              @click="setDifficulty(3)"
            >
              困难
            </van-button>
          </view>
        </view>

        <!-- 时间筛选 -->
        <view class="mb-4">
          <text class="block text-sm text-gray-600 mb-2">制作时间</text>
          <view class="flex space-x-2">
            <van-button 
              size="small"
              :type="filters.maxTime === null ? 'primary' : 'default'"
              @click="setMaxTime(null)"
            >
              不限
            </van-button>
            <van-button 
              size="small"
              :type="filters.maxTime === 15 ? 'primary' : 'default'"
              @click="setMaxTime(15)"
            >
              15分钟内
            </van-button>
            <van-button 
              size="small"
              :type="filters.maxTime === 30 ? 'primary' : 'default'"
              @click="setMaxTime(30)"
            >
              30分钟内
            </van-button>
            <van-button 
              size="small"
              :type="filters.maxTime === 60 ? 'primary' : 'default'"
              @click="setMaxTime(60)"
            >
              1小时内
            </van-button>
          </view>
        </view>

        <!-- 标签筛选 -->
        <view class="mb-4">
          <text class="block text-sm text-gray-600 mb-2">菜系</text>
          <scroll-view scroll-x class="whitespace-nowrap">
            <view class="flex space-x-2 pb-2">
              <van-button 
                size="small"
                :type="filters.tag === null ? 'primary' : 'default'"
                @click="setTag(null)"
              >
                不限
              </van-button>
              <van-button 
                v-for="tag in popularTags" 
                :key="tag"
                size="small"
                :type="filters.tag === tag ? 'primary' : 'default'"
                @click="setTag(tag)"
                class="whitespace-nowrap"
              >
                {{ tag }}
              </van-button>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 随机按钮 -->
    <view class="mx-4 mt-4">
      <van-button 
        type="primary" 
        size="large" 
        block
        :loading="randomizing"
        @click="getRandomRecipe"
        class="random-btn"
      >
        <text class="text-2xl mr-2">🎯</text>
        {{ randomizing ? '正在为你选择...' : '随机一道菜' }}
      </van-button>
    </view>

    <!-- 随机结果 -->
    <view v-if="randomRecipe" class="mx-4 mt-4">
      <view class="card">
        <view class="text-center mb-4">
          <text class="text-lg font-semibold text-primary-500">🎉 为你推荐</text>
        </view>
        
        <recipe-card 
          :recipe="randomRecipe"
          @click="goToDetail"
          class="mb-4"
        />
        
        <view class="flex space-x-2">
          <van-button 
            type="default" 
            size="large"
            class="flex-1"
            @click="getRandomRecipe"
          >
            换一个
          </van-button>
          <van-button 
            type="primary" 
            size="large"
            class="flex-1"
            @click="goToDetail"
          >
            就是它了
          </van-button>
        </view>
      </view>
    </view>

    <!-- 历史记录 -->
    <view v-if="randomHistory.length > 0" class="mx-4 mt-4 mb-4">
      <view class="card">
        <view class="flex justify-between items-center mb-4">
          <text class="text-lg font-semibold text-gray-800">📝 历史推荐</text>
          <van-button size="small" @click="clearHistory">清空</van-button>
        </view>
        
        <scroll-view scroll-x class="whitespace-nowrap">
          <view class="flex space-x-3 pb-2">
            <view 
              v-for="recipe in randomHistory" 
              :key="recipe._id"
              class="flex-shrink-0 w-32"
              @click="goToHistoryDetail(recipe._id)"
            >
              <image 
                v-if="recipe.images && recipe.images.length > 0"
                :src="recipe.images[0]"
                mode="aspectFill"
                class="w-full h-24 rounded-lg mb-2"
              />
              <view v-else class="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                <text class="text-gray-400">🍽️</text>
              </view>
              <text class="text-sm text-gray-800 text-ellipsis block">{{ recipe.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="!randomRecipe && filteredRecipes.length === 0 && !loading" class="mx-4 mt-8">
      <view class="text-center py-12">
        <text class="text-6xl mb-4 block">😅</text>
        <text class="text-gray-400 text-lg mb-4 block">没有符合条件的食谱</text>
        <text class="text-gray-500 text-sm mb-6 block">试试调整筛选条件或添加更多食谱</text>
        <van-button type="primary" @click="goToAdd">添加食谱</van-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { showToast } from '@/utils'
import RecipeCard from '@/components/RecipeCard.vue'

const appStore = useAppStore()

// 响应式数据
const loading = ref(false)
const randomizing = ref(false)
const randomRecipe = ref(null)
const randomHistory = ref([])

// 筛选条件
const filters = reactive({
  difficulty: null,
  maxTime: null,
  tag: null
})

// 热门标签
const popularTags = ['川菜', '粤菜', '家常菜', '素食', '甜品', '汤品', '快手菜']

// 计算属性
const filteredRecipes = computed(() => {
  let recipes = [...appStore.recipes]
  
  // 按难度筛选
  if (filters.difficulty !== null) {
    recipes = recipes.filter(recipe => recipe.difficulty === filters.difficulty)
  }
  
  // 按时间筛选
  if (filters.maxTime !== null) {
    recipes = recipes.filter(recipe => recipe.cookingTime <= filters.maxTime)
  }
  
  // 按标签筛选
  if (filters.tag !== null) {
    recipes = recipes.filter(recipe => recipe.tags.includes(filters.tag))
  }
  
  return recipes
})

// 生命周期
onMounted(() => {
  loadHistory()
})

// 方法
const setDifficulty = (difficulty) => {
  filters.difficulty = difficulty
}

const setMaxTime = (maxTime) => {
  filters.maxTime = maxTime
}

const setTag = (tag) => {
  filters.tag = tag
}

const getRandomRecipe = async () => {
  if (filteredRecipes.value.length === 0) {
    showToast('没有符合条件的食谱')
    return
  }
  
  try {
    randomizing.value = true
    
    // 模拟随机选择的动画效果
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const randomIndex = Math.floor(Math.random() * filteredRecipes.value.length)
    const selectedRecipe = filteredRecipes.value[randomIndex]
    
    randomRecipe.value = selectedRecipe
    
    // 添加到历史记录
    addToHistory(selectedRecipe)
    
    showToast('为你推荐了一道美食！', 'success')
  } catch (error) {
    console.error('随机选择失败:', error)
    showToast('随机选择失败')
  } finally {
    randomizing.value = false
  }
}

const addToHistory = (recipe) => {
  // 移除已存在的记录
  const existingIndex = randomHistory.value.findIndex(item => item._id === recipe._id)
  if (existingIndex !== -1) {
    randomHistory.value.splice(existingIndex, 1)
  }
  
  // 添加到开头
  randomHistory.value.unshift(recipe)
  
  // 保持最多10条记录
  if (randomHistory.value.length > 10) {
    randomHistory.value = randomHistory.value.slice(0, 10)
  }
  
  saveHistory()
}

const loadHistory = () => {
  try {
    const history = wx.getStorageSync('randomHistory')
    if (history) {
      randomHistory.value = JSON.parse(history)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

const saveHistory = () => {
  try {
    wx.setStorageSync('randomHistory', JSON.stringify(randomHistory.value))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

const clearHistory = () => {
  randomHistory.value = []
  saveHistory()
  showToast('已清空历史记录')
}

const goToDetail = () => {
  if (randomRecipe.value) {
    uni.navigateTo({
      url: `/pages/recipe/detail?id=${randomRecipe.value._id}&random=true`
    })
  }
}

const goToHistoryDetail = (id) => {
  uni.navigateTo({
    url: `/pages/recipe/detail?id=${id}&random=true`
  })
}

const goToAdd = () => {
  uni.switchTab({
    url: '/pages/recipe/add'
  })
}
</script>

<style scoped>
.random-btn {
  @apply bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-lg;
}
</style> 