<template>
  <view class="recipe-card fade-in" @click="$emit('click')">
    <!-- 食谱图片 -->
    <view class="relative">
      <image 
        v-if="recipe.images && recipe.images.length > 0"
        :src="recipe.images[0]" 
        class="recipe-image"
        mode="aspectFill"
        @error="onImageError"
      />
      <view v-else class="recipe-image bg-gray-200 flex items-center justify-center">
        <text class="text-gray-400 text-2xl">🍽️</text>
      </view>
      
      <!-- 难度标签 -->
      <view class="absolute top-2 left-2">
        <view 
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="getDifficultyClass(recipe.difficulty)"
        >
          {{ getDifficultyText(recipe.difficulty) }}
        </view>
      </view>
      
      <!-- 收藏按钮 -->
      <view class="absolute top-2 right-2">
        <van-icon 
          name="star-o" 
          size="20" 
          color="#fff"
          class="bg-black bg-opacity-30 rounded-full p-1"
        />
      </view>
    </view>

    <!-- 食谱信息 -->
    <view class="p-4">
      <!-- 标题和描述 -->
      <view class="mb-2">
        <text class="text-lg font-semibold text-gray-800 text-ellipsis block">
          {{ recipe.name }}
        </text>
        <text class="text-sm text-gray-500 text-ellipsis-2 mt-1 block">
          {{ recipe.description }}
        </text>
      </view>

      <!-- 标签 -->
      <view class="mb-3" v-if="recipe.tags && recipe.tags.length > 0">
        <view class="flex flex-wrap">
          <text 
            v-for="tag in recipe.tags.slice(0, 3)" 
            :key="tag"
            class="tag tag-primary"
          >
            {{ tag }}
          </text>
          <text v-if="recipe.tags.length > 3" class="tag">
            +{{ recipe.tags.length - 3 }}
          </text>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="flex justify-between items-center text-sm text-gray-500">
        <view class="flex items-center space-x-4">
          <view class="flex items-center">
            <van-icon name="clock-o" size="14" class="mr-1" />
            <text>{{ formatTime(recipe.cookingTime) }}</text>
          </view>
          <view class="flex items-center">
            <van-icon name="friends-o" size="14" class="mr-1" />
            <text>{{ recipe.servings }}人份</text>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="flex items-center space-x-2">
          <van-icon 
            name="edit" 
            size="16" 
            @click.stop="$emit('edit')"
            class="text-primary-500"
          />
          <van-icon 
            name="delete" 
            size="16" 
            @click.stop="$emit('delete')"
            class="text-red-500"
          />
        </view>
      </view>

      <!-- 创建时间 -->
      <view class="mt-2 text-xs text-gray-400">
        {{ formatDate(recipe.createTime) }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { formatTime, formatDate, getDifficultyText, getDifficultyColor } from '@/utils'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'edit', 'delete'])

const onImageError = () => {
  console.log('图片加载失败')
}

const getDifficultyClass = (level) => {
  const classMap = {
    1: 'bg-green-500 text-white',
    2: 'bg-yellow-500 text-white',
    3: 'bg-red-500 text-white'
  }
  return classMap[level] || 'bg-gray-500 text-white'
}
</script>

<style scoped>
/* 所有样式已使用TailwindCSS类名，无需额外CSS */
</style> 