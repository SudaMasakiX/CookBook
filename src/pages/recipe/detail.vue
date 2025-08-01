<template>
  <view class="min-h-screen bg-gray-50">
    <view v-if="loading" class="p-4">
      <view class="skeleton recipe-image mb-4"></view>
      <view class="skeleton h-8 w-3/4 mb-2"></view>
      <view class="skeleton h-4 w-full mb-4"></view>
    </view>

    <view v-else-if="recipe" class="pb-safe-bottom">
      <!-- 随机提示 -->
      <view v-if="isRandom" class="bg-primary-500 text-white text-center py-2">
        <text>🎲 为你随机推荐的美食</text>
      </view>

      <!-- 食谱图片 -->
      <view class="relative">
        <swiper 
          v-if="recipe.images && recipe.images.length > 0"
          class="recipe-swiper"
          indicator-dots
          autoplay
          circular
        >
          <swiper-item v-for="(image, index) in recipe.images" :key="index">
            <image 
              :src="image" 
              mode="aspectFill"
              class="w-full h-full"
              @click="previewImages(index)"
            />
          </swiper-item>
        </swiper>
        <view v-else class="w-full h-80 bg-gray-200 flex items-center justify-center">
          <text class="text-gray-400 text-4xl">🍽️</text>
        </view>

        <!-- 返回按钮 -->
        <view class="absolute top-4 left-4 z-10">
          <van-icon 
            name="arrow-left" 
            size="24" 
            color="#fff"
            class="bg-black bg-opacity-30 rounded-full p-2"
            @click="goBack"
          />
        </view>

        <!-- 操作按钮 -->
        <view class="absolute top-4 right-4 z-10 flex space-x-2">
          <van-icon 
            name="edit" 
            size="20" 
            color="#fff"
            class="bg-black bg-opacity-30 rounded-full p-2"
            @click="goToEdit"
          />
          <van-icon 
            name="delete" 
            size="20" 
            color="#fff"
            class="bg-black bg-opacity-30 rounded-full p-2"
            @click="handleDelete"
          />
        </view>
      </view>

      <!-- 食谱信息 -->
      <view class="mx-4 mt-4 space-y-4">
        <!-- 基本信息 -->
        <view class="card">
          <view class="flex justify-between items-start mb-3">
            <view class="flex-1">
              <text class="text-2xl font-bold text-gray-800 mb-2 block">{{ recipe.name }}</text>
              <text class="text-gray-600 leading-relaxed">{{ recipe.description }}</text>
            </view>
            <view 
              class="ml-4 px-3 py-1 rounded-full text-sm font-medium"
              :class="getDifficultyClass(recipe.difficulty)"
            >
              {{ getDifficultyText(recipe.difficulty) }}
            </view>
          </view>

          <!-- 标签 -->
          <view v-if="recipe.tags && recipe.tags.length > 0" class="mb-4">
            <view class="flex flex-wrap">
              <text 
                v-for="tag in recipe.tags" 
                :key="tag"
                class="tag tag-primary"
              >
                {{ tag }}
              </text>
            </view>
          </view>

          <!-- 统计信息 -->
          <view class="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
            <view class="text-center">
              <view class="text-2xl mb-1">⏱️</view>
              <text class="text-sm text-gray-500">制作时间</text>
              <text class="block font-semibold">{{ formatTime(recipe.cookingTime) }}</text>
            </view>
            <view class="text-center">
              <view class="text-2xl mb-1">👥</view>
              <text class="text-sm text-gray-500">用餐人数</text>
              <text class="block font-semibold">{{ recipe.servings }}人份</text>
            </view>
            <view class="text-center">
              <view class="text-2xl mb-1">❤️</view>
              <text class="text-sm text-gray-500">收藏</text>
              <text class="block font-semibold">{{ recipe.favoriteCount || 0 }}</text>
            </view>
          </view>
        </view>

        <!-- 食材清单 -->
        <view class="card">
          <view class="flex justify-between items-center mb-4">
            <text class="text-lg font-semibold text-gray-800">🥬 食材清单</text>
            <van-button size="small" @click="toggleAllIngredients">
              {{ allIngredientsChecked ? '取消全选' : '全选' }}
            </van-button>
          </view>
          <view class="space-y-3">
            <view 
              v-for="(ingredient, index) in recipe.ingredients" 
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              @click="toggleIngredient(index)"
            >
              <view class="flex items-center flex-1">
                <van-checkbox 
                  :value="checkedIngredients[index]"
                  @change="toggleIngredient(index)"
                />
                <text 
                  class="ml-3 text-gray-800"
                  :class="{ 'line-through text-gray-400': checkedIngredients[index] }"
                >
                  {{ ingredient.name }}
                </text>
              </view>
              <text class="text-primary-500 font-medium">{{ ingredient.amount }}</text>
            </view>
          </view>
        </view>

        <!-- 制作步骤 -->
        <view class="card">
          <text class="block text-lg font-semibold text-gray-800 mb-4">👨‍🍳 制作步骤</text>
          <view class="space-y-6">
            <view 
              v-for="(step, index) in recipe.steps" 
              :key="index"
              class="flex space-x-4"
            >
              <view class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {{ index + 1 }}
              </view>
              <view class="flex-1">
                <text class="text-gray-800 leading-relaxed mb-3 block">{{ step.description }}</text>
                <view v-if="step.images && step.images.length > 0" class="grid grid-cols-3 gap-2">
                  <image 
                    v-for="(image, imgIndex) in step.images" 
                    :key="imgIndex"
                    :src="image"
                    mode="aspectFill"
                    class="w-full h-20 rounded-lg"
                    @click="previewStepImages(step.images, imgIndex)"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 小贴士 -->
        <view v-if="recipe.tips" class="card">
          <text class="block text-lg font-semibold text-gray-800 mb-3">💡 小贴士</text>
          <view class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
            <text class="text-gray-700 leading-relaxed">{{ recipe.tips }}</text>
          </view>
        </view>

        <!-- 创建信息 -->
        <view class="card">
          <view class="flex items-center justify-between text-sm text-gray-500">
            <text>创建时间：{{ formatDate(recipe.createTime) }}</text>
            <text v-if="recipe.updateTime && recipe.updateTime !== recipe.createTime">
              更新时间：{{ formatDate(recipe.updateTime) }}
            </text>
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <view class="flex px-4 py-3 space-x-3">
          <van-button 
            type="default" 
            size="large"
            class="flex-1"
            @click="shareRecipe"
          >
            分享食谱
          </van-button>
          <van-button 
            type="primary" 
            size="large"
            class="flex-1"
            @click="cookAgain"
          >
            我要做菜
          </van-button>
        </view>
      </view>
    </view>

    <view v-else class="flex flex-col items-center justify-center h-screen">
      <text class="text-gray-400 text-lg mb-4">食谱不存在</text>
      <van-button type="primary" @click="goBack">返回</van-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { recipeAPI } from '@/api/recipe'
import { formatTime, formatDate, getDifficultyText, previewImage, showToast, showLoading, hideLoading, showModal } from '@/utils'

const appStore = useAppStore()

// 响应式数据
const loading = ref(true)
const recipe = ref(null)
const isRandom = ref(false)
const checkedIngredients = reactive({})

// 计算属性
const allIngredientsChecked = computed(() => {
  if (!recipe.value?.ingredients) return false
  return recipe.value.ingredients.every((_, index) => checkedIngredients[index])
})

// 生命周期
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  
  if (options.id) {
    loadRecipe(options.id)
    isRandom.value = options.random === 'true'
  }
})

// 方法
const loadRecipe = async (id) => {
  try {
    loading.value = true
    const result = await recipeAPI.getById(id)
    if (result.success) {
      recipe.value = result.data
      appStore.setCurrentRecipe(result.data)
      initIngredientChecks()
    } else {
      showToast('加载失败')
    }
  } catch (error) {
    console.error('加载食谱详情失败:', error)
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

const initIngredientChecks = () => {
  if (recipe.value?.ingredients) {
    recipe.value.ingredients.forEach((_, index) => {
      checkedIngredients[index] = false
    })
  }
}

const getDifficultyClass = (level) => {
  const classMap = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-yellow-100 text-yellow-700',
    3: 'bg-red-100 text-red-700'
  }
  return classMap[level] || 'bg-gray-100 text-gray-700'
}

const toggleIngredient = (index) => {
  checkedIngredients[index] = !checkedIngredients[index]
}

const toggleAllIngredients = () => {
  const newValue = !allIngredientsChecked.value
  recipe.value.ingredients.forEach((_, index) => {
    checkedIngredients[index] = newValue
  })
}

const previewImages = (index) => {
  previewImage(recipe.value.images[index], recipe.value.images)
}

const previewStepImages = (images, index) => {
  previewImage(images[index], images)
}

const goBack = () => {
  uni.navigateBack()
}

const goToEdit = () => {
  uni.navigateTo({
    url: `/pages/recipe/edit?id=${recipe.value._id}`
  })
}

const handleDelete = async () => {
  const confirm = await showModal('确认删除', '确定要删除这个食谱吗？')
  if (!confirm) return
  
  try {
    showLoading('删除中...')
    const result = await recipeAPI.delete(recipe.value._id)
    if (result.success) {
      appStore.removeRecipe(recipe.value._id)
      showToast('删除成功', 'success')
      setTimeout(() => {
        goBack()
      }, 1000)
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

const shareRecipe = () => {
  wx.showShareMenu({
    withShareTicket: true
  })
  showToast('请点击右上角分享')
}

const cookAgain = () => {
  showToast('开始做菜吧！', 'success')
}
</script>

<style scoped>
.recipe-swiper {
  @apply h-72 w-full;
}
</style> 