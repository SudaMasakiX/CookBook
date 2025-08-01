<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 顶部搜索栏 -->
    <view class="bg-white sticky top-0 z-10 shadow-sm">
      <view class="container py-4">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索食谱、食材..."
          @search="handleSearch"
          @clear="handleClearSearch"
          @cancel="handleClearSearch"
        />
      </view>
    </view>

    <!-- 快捷功能区 -->
    <view class="bg-white mx-4 mt-4 rounded-lg shadow-card p-4">
      <view class="flex justify-between items-center">
        <view class="flex items-center space-x-2">
          <text class="text-lg font-semibold text-gray-800">🍳 今天吃什么？</text>
        </view>
        <van-button 
          type="primary" 
          size="small"
          round
          @click="getRandomRecipe"
          :loading="randomLoading"
        >
          随机推荐
        </van-button>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="mx-4 mt-4">
      <scroll-view scroll-x class="whitespace-nowrap">
        <view class="flex space-x-2 pb-2">
          <view 
            class="inline-block px-4 py-2 rounded-full text-sm transition-colors"
            :class="selectedTag === '' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'"
            @click="filterByTag('')"
          >
            全部
          </view>
          <view 
            v-for="tag in popularTags" 
            :key="tag"
            class="inline-block px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
            :class="selectedTag === tag ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'"
            @click="filterByTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 食谱列表 -->
    <view class="mx-4 mt-4 pb-safe-bottom">
      <view v-if="loading" class="space-y-4">
        <recipe-skeleton v-for="i in 3" :key="i" />
      </view>
      
      <view v-else-if="displayRecipes.length === 0" class="text-center py-12">
        <text class="text-gray-400 text-lg">暂无食谱</text>
        <view class="mt-4">
          <van-button type="primary" @click="goToAdd">添加第一个食谱</van-button>
        </view>
      </view>
      
      <view v-else class="grid grid-cols-1 gap-4">
        <recipe-card 
          v-for="recipe in displayRecipes" 
          :key="recipe._id"
          :recipe="recipe"
          @click="goToDetail(recipe._id)"
          @edit="goToEdit(recipe._id)"
          @delete="handleDelete(recipe._id)"
        />
      </view>
    </view>

    <!-- 悬浮添加按钮 -->
    <view class="fixed bottom-20 right-4 z-20">
      <van-button 
        type="primary" 
        round 
        icon="plus"
        size="large"
        @click="goToAdd"
        class="shadow-lg"
      >
        添加食谱
      </van-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onPullDownRefresh } from 'vue'
import { useAppStore } from '@/stores/app'
import { recipeAPI } from '@/api/recipe'
import { showToast, showLoading, hideLoading, showModal } from '@/utils'
import RecipeCard from '@/components/RecipeCard.vue'
import RecipeSkeleton from '@/components/RecipeSkeleton.vue'

const appStore = useAppStore()

// 响应式数据
const loading = ref(false)
const randomLoading = ref(false)
const searchKeyword = ref('')
const selectedTag = ref('')

// 热门标签
const popularTags = ref(['川菜', '粤菜', '家常菜', '素食', '甜品', '汤品', '快手菜'])

// 计算属性
const displayRecipes = computed(() => {
  let recipes = appStore.recipes
  
  // 按标签筛选
  if (selectedTag.value) {
    recipes = recipes.filter(recipe => recipe.tags.includes(selectedTag.value))
  }
  
  // 按搜索关键词筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    recipes = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(keyword) ||
      recipe.description.toLowerCase().includes(keyword) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(keyword))
    )
  }
  
  return recipes
})

// 生命周期
onMounted(() => {
  loadRecipes()
})

onPullDownRefresh(() => {
  loadRecipes(true)
})

// 方法
const loadRecipes = async (refresh = false) => {
  try {
    if (!refresh) {
      loading.value = true
    }
    
    const result = await recipeAPI.getAll()
    if (result.success) {
      appStore.setRecipes(result.data)
    } else {
      showToast('加载失败')
    }
  } catch (error) {
    console.error('加载食谱失败:', error)
    showToast('加载失败')
  } finally {
    loading.value = false
    if (refresh) {
      wx.stopPullDownRefresh()
    }
  }
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
}

const handleClearSearch = () => {
  searchKeyword.value = ''
}

const filterByTag = (tag) => {
  selectedTag.value = tag
}

const getRandomRecipe = async () => {
  if (appStore.recipes.length === 0) {
    showToast('还没有食谱哦')
    return
  }
  
  try {
    randomLoading.value = true
    const randomRecipe = appStore.getRandomRecipe()
    if (randomRecipe) {
      uni.navigateTo({
        url: `/pages/recipe/detail?id=${randomRecipe._id}&random=true`
      })
    }
  } catch (error) {
    showToast('获取随机食谱失败')
  } finally {
    randomLoading.value = false
  }
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/recipe/detail?id=${id}`
  })
}

const goToAdd = () => {
  uni.switchTab({
    url: '/pages/recipe/add'
  })
}

const goToEdit = (id) => {
  uni.navigateTo({
    url: `/pages/recipe/edit?id=${id}`
  })
}

const handleDelete = async (id) => {
  const confirm = await showModal('确认删除', '确定要删除这个食谱吗？')
  if (!confirm) return
  
  try {
    showLoading('删除中...')
    const result = await recipeAPI.delete(id)
    if (result.success) {
      appStore.removeRecipe(id)
      showToast('删除成功', 'success')
    } else {
      showToast('删除失败')
    }
  } catch (error) {
    console.error('删除食谱失败:', error)
    showToast('删除失败')
  } finally {
    hideLoading()
  }
}
</script>

<style scoped>
/* 所有样式已使用TailwindCSS类名，无需额外CSS */
</style> 