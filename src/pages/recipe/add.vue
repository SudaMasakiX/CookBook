<template>
  <view class="min-h-screen bg-gray-50 pb-safe-bottom">
    <!-- 表单容器 -->
    <view class="mx-4 py-4 space-y-4">
      <!-- 食谱图片 -->
      <view class="card">
        <text class="block text-lg font-semibold mb-3 text-gray-800">食谱图片</text>
        <image-upload 
          v-model="form.images" 
          :max-count="5"
          @change="handleImageChange"
        />
      </view>

      <!-- 基本信息 -->
      <view class="card">
        <text class="block text-lg font-semibold mb-3 text-gray-800">基本信息</text>
        
        <van-field
          v-model="form.name"
          label="食谱名称"
          placeholder="请输入食谱名称"
          required
          :error="errors.name"
          :error-message="errors.name"
        />
        
        <van-field
          v-model="form.description"
          type="textarea"
          label="简介"
          placeholder="简单介绍一下这道菜..."
          rows="3"
          autosize
        />

        <van-field label="难度">
          <template #input>
            <van-radio-group v-model="form.difficulty" direction="horizontal">
              <van-radio name="1">简单</van-radio>
              <van-radio name="2">中等</van-radio>
              <van-radio name="3">困难</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-model="form.cookingTime"
          label="制作时间"
          placeholder="分钟"
          type="number"
        />

        <van-field
          v-model="form.servings"
          label="用餐人数"
          placeholder="人"
          type="number"
        />
      </view>

      <!-- 标签 -->
      <view class="card">
        <text class="block text-lg font-semibold mb-3 text-gray-800">标签</text>
        <view class="mb-3">
          <van-field
            v-model="newTag"
            placeholder="添加标签"
            @keyup.enter="addTag"
          >
            <template #button>
              <van-button size="small" type="primary" @click="addTag">添加</van-button>
            </template>
          </van-field>
        </view>
        <view class="flex flex-wrap">
          <view 
            v-for="(tag, index) in form.tags" 
            :key="index"
            class="tag tag-primary mr-2 mb-2 relative"
          >
            {{ tag }}
            <text class="ml-1 text-red-500" @click="removeTag(index)">×</text>
          </view>
        </view>
        <view class="mt-2">
          <text class="text-sm text-gray-500 mb-2 block">热门标签：</text>
          <view class="flex flex-wrap">
            <text 
              v-for="tag in popularTags" 
              :key="tag"
              class="tag cursor-pointer mr-2 mb-2"
              @click="addPopularTag(tag)"
            >
              {{ tag }}
            </text>
          </view>
        </view>
      </view>

      <!-- 食材 -->
      <view class="card">
        <view class="flex justify-between items-center mb-3">
          <text class="text-lg font-semibold text-gray-800">食材</text>
          <van-button size="small" type="primary" @click="addIngredient">添加食材</van-button>
        </view>
        
        <view v-for="(ingredient, index) in form.ingredients" :key="index" class="mb-3">
          <view class="flex space-x-2">
            <van-field
              v-model="ingredient.name"
              placeholder="食材名称"
              class="flex-1"
            />
            <van-field
              v-model="ingredient.amount"
              placeholder="用量"
              class="w-20"
            />
            <van-button 
              size="small" 
              type="danger" 
              @click="removeIngredient(index)"
              icon="delete"
            />
          </view>
        </view>
      </view>

      <!-- 制作步骤 -->
      <view class="card">
        <view class="flex justify-between items-center mb-3">
          <text class="text-lg font-semibold text-gray-800">制作步骤</text>
          <van-button size="small" type="primary" @click="addStep">添加步骤</van-button>
        </view>
        
        <view v-for="(step, index) in form.steps" :key="index" class="mb-4">
          <view class="flex items-start space-x-3">
            <view class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {{ index + 1 }}
            </view>
            <view class="flex-1">
              <van-field
                v-model="step.description"
                type="textarea"
                placeholder="详细描述制作步骤..."
                rows="3"
                autosize
              />
              <view class="mt-2">
                <image-upload 
                  v-model="step.images" 
                  :max-count="3"
                  size="small"
                  @change="handleStepImageChange(index)"
                />
              </view>
            </view>
            <van-button 
              size="small" 
              type="danger" 
              @click="removeStep(index)"
              icon="delete"
            />
          </view>
        </view>
      </view>

      <!-- 小贴士 -->
      <view class="card">
        <text class="block text-lg font-semibold mb-3 text-gray-800">小贴士</text>
        <van-field
          v-model="form.tips"
          type="textarea"
          placeholder="分享一些制作技巧或注意事项..."
          rows="3"
          autosize
        />
      </view>

      <!-- 提交按钮 -->
      <view class="sticky bottom-0 bg-white p-4 shadow-lg">
        <van-button 
          type="primary" 
          block 
          :loading="submitting"
          @click="handleSubmit"
        >
          保存食谱
        </van-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { recipeAPI } from '@/api/recipe'
import { showToast, showLoading, hideLoading } from '@/utils'
import ImageUpload from '@/components/ImageUpload.vue'

const appStore = useAppStore()

// 响应式数据
const submitting = ref(false)
const newTag = ref('')

// 表单数据
const form = reactive({
  name: '',
  description: '',
  difficulty: '1',
  cookingTime: '',
  servings: '',
  tags: [],
  ingredients: [{ name: '', amount: '' }],
  steps: [{ description: '', images: [] }],
  images: [],
  tips: ''
})

// 表单验证错误
const errors = reactive({
  name: ''
})

// 热门标签
const popularTags = ['川菜', '粤菜', '家常菜', '素食', '甜品', '汤品', '快手菜', '下饭菜', '宵夜']

// 方法
const handleImageChange = (images) => {
  form.images = images
}

const handleStepImageChange = (stepIndex) => {
  // 步骤图片变化处理
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

const addPopularTag = (tag) => {
  if (!form.tags.includes(tag)) {
    form.tags.push(tag)
  }
}

const addIngredient = () => {
  form.ingredients.push({ name: '', amount: '' })
}

const removeIngredient = (index) => {
  if (form.ingredients.length > 1) {
    form.ingredients.splice(index, 1)
  }
}

const addStep = () => {
  form.steps.push({ description: '', images: [] })
}

const removeStep = (index) => {
  if (form.steps.length > 1) {
    form.steps.splice(index, 1)
  }
}

const validateForm = () => {
  errors.name = ''
  
  if (!form.name.trim()) {
    errors.name = '请输入食谱名称'
    return false
  }
  
  if (form.ingredients.some(ing => !ing.name.trim())) {
    showToast('请填写完整的食材信息')
    return false
  }
  
  if (form.steps.some(step => !step.description.trim())) {
    showToast('请填写完整的制作步骤')
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    submitting.value = true
    showLoading('保存中...')
    
    // 准备提交数据
    const recipeData = {
      ...form,
      difficulty: parseInt(form.difficulty),
      cookingTime: parseInt(form.cookingTime) || 0,
      servings: parseInt(form.servings) || 1,
      ingredients: form.ingredients.filter(ing => ing.name.trim()),
      steps: form.steps.filter(step => step.description.trim())
    }
    
    const result = await recipeAPI.create(recipeData)
    
    if (result.success) {
      appStore.addRecipe(result.data)
      showToast('保存成功！', 'success')
      
      // 返回首页
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 1000)
    } else {
      showToast(result.message || '保存失败')
    }
  } catch (error) {
    console.error('保存食谱失败:', error)
    showToast('保存失败')
  } finally {
    submitting.value = false
    hideLoading()
  }
}
</script>

<style scoped>
/* 所有样式已使用TailwindCSS类名，无需额外CSS */
</style> 