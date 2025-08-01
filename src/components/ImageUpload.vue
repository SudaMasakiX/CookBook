<template>
  <view class="image-upload">
    <view class="image-grid">
      <!-- 已上传的图片 -->
      <view 
        v-for="(image, index) in modelValue" 
        :key="index"
        class="image-item"
        :class="sizeClass"
      >
        <image 
          :src="image" 
          mode="aspectFill"
          class="image-preview"
          @click="previewImage(index)"
        />
        <view class="image-delete" @click="removeImage(index)">
          <van-icon name="cross" size="12" color="#fff" />
        </view>
      </view>

      <!-- 添加按钮 -->
      <view 
        v-if="modelValue.length < maxCount"
        class="image-add"
        :class="sizeClass"
        @click="chooseImage"
      >
        <van-icon name="plus" size="24" color="#ddd" />
        <text class="add-text">{{ modelValue.length === 0 ? '添加图片' : '' }}</text>
      </view>
    </view>

    <view v-if="showTip" class="upload-tip">
      <text class="text-xs text-gray-400">
        最多可上传{{ maxCount }}张图片，支持JPG、PNG格式
      </text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { chooseImage as chooseImageUtil, previewImage as previewImageUtil, showToast, showLoading, hideLoading } from '@/utils'
import { recipeAPI } from '@/api/recipe'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxCount: {
    type: Number,
    default: 9
  },
  size: {
    type: String,
    default: 'normal', // normal, small
    validator: (value) => ['normal', 'small'].includes(value)
  },
  showTip: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const sizeClass = computed(() => {
  return props.size === 'small' ? 'size-small' : 'size-normal'
})

const chooseImage = async () => {
  try {
    const remainingCount = props.maxCount - props.modelValue.length
    const res = await chooseImageUtil(Math.min(remainingCount, 9))
    
    showLoading('上传中...')
    
    const uploadPromises = res.tempFilePaths.map(filePath => 
      recipeAPI.uploadImage(filePath)
    )
    
    const uploadResults = await Promise.all(uploadPromises)
    const newImages = [...props.modelValue, ...uploadResults]
    
    emit('update:modelValue', newImages)
    emit('change', newImages)
    
    showToast('上传成功', 'success')
  } catch (error) {
    console.error('上传图片失败:', error)
    showToast('上传失败')
  } finally {
    hideLoading()
  }
}

const removeImage = (index) => {
  const newImages = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newImages)
  emit('change', newImages)
}

const previewImage = (index) => {
  previewImageUtil(props.modelValue[index], props.modelValue)
}
</script>

<style scoped>
.image-upload {
  @apply w-full;
}

.image-grid {
  @apply grid grid-cols-3 gap-2;
}

.image-item {
  @apply relative rounded-lg overflow-hidden;
}

.size-normal {
  @apply aspect-square h-24;
}

.size-small {
  @apply aspect-square h-16;
}

.image-preview {
  @apply w-full h-full object-cover;
}

.image-delete {
  @apply absolute top-1 right-1 w-5 h-5 bg-black bg-opacity-60 rounded-full flex items-center justify-center;
}

.image-add {
  @apply bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50;
}

.add-text {
  @apply text-xs text-gray-400 mt-1;
}

.upload-tip {
  @apply mt-2 text-center;
}
</style> 