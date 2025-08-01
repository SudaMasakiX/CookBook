<template>
  <view class="recipe-card">
    <!-- 图片骨架 -->
    <view class="skeleton recipe-image"></view>
    
    <!-- 内容骨架 -->
    <view class="p-4">
      <!-- 标题骨架 -->
      <view class="skeleton h-6 w-3/4 mb-2 rounded"></view>
      
      <!-- 描述骨架 -->
      <view class="skeleton h-4 w-full mb-1 rounded"></view>
      <view class="skeleton h-4 w-2/3 mb-3 rounded"></view>
      
      <!-- 标签骨架 -->
      <view class="flex mb-3">
        <view class="skeleton h-6 w-12 mr-2 rounded-full"></view>
        <view class="skeleton h-6 w-16 mr-2 rounded-full"></view>
        <view class="skeleton h-6 w-14 rounded-full"></view>
      </view>
      
      <!-- 底部信息骨架 -->
      <view class="flex justify-between items-center">
        <view class="flex space-x-4">
          <view class="skeleton h-4 w-16 rounded"></view>
          <view class="skeleton h-4 w-12 rounded"></view>
        </view>
        <view class="flex space-x-2">
          <view class="skeleton h-4 w-4 rounded"></view>
          <view class="skeleton h-4 w-4 rounded"></view>
        </view>
      </view>
      
      <!-- 时间骨架 -->
      <view class="skeleton h-3 w-20 mt-2 rounded"></view>
    </view>
  </view>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
/* 所有样式已使用TailwindCSS类名，无需额外CSS */
</style> 