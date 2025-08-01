import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const user = ref(null)
  const loading = ref(false)
  const recipes = ref([])
  const currentRecipe = ref(null)
  
  // 计算属性
  const isLoggedIn = computed(() => !!user.value)
  const recipeCount = computed(() => recipes.value.length)
  
  // 用户相关方法
  const setUser = (userData) => {
    user.value = userData
  }
  
  const clearUser = () => {
    user.value = null
  }
  
  // Loading相关方法
  const setLoading = (state) => {
    loading.value = state
  }
  
  // 食谱相关方法
  const setRecipes = (recipeList) => {
    recipes.value = recipeList
  }
  
  const addRecipe = (recipe) => {
    recipes.value.unshift(recipe)
  }
  
  const updateRecipe = (recipeId, updatedRecipe) => {
    const index = recipes.value.findIndex(r => r._id === recipeId)
    if (index !== -1) {
      recipes.value[index] = { ...recipes.value[index], ...updatedRecipe }
    }
  }
  
  const removeRecipe = (recipeId) => {
    const index = recipes.value.findIndex(r => r._id === recipeId)
    if (index !== -1) {
      recipes.value.splice(index, 1)
    }
  }
  
  const setCurrentRecipe = (recipe) => {
    currentRecipe.value = recipe
  }
  
  const clearCurrentRecipe = () => {
    currentRecipe.value = null
  }
  
  // 获取随机食谱
  const getRandomRecipe = () => {
    if (recipes.value.length === 0) return null
    const randomIndex = Math.floor(Math.random() * recipes.value.length)
    return recipes.value[randomIndex]
  }
  
  // 搜索食谱
  const searchRecipes = (keyword) => {
    if (!keyword.trim()) return recipes.value
    
    return recipes.value.filter(recipe => 
      recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
      recipe.description.toLowerCase().includes(keyword.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(keyword.toLowerCase())) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    )
  }
  
  // 按标签筛选食谱
  const filterRecipesByTag = (tag) => {
    return recipes.value.filter(recipe => 
      recipe.tags.includes(tag)
    )
  }
  
  // 按难度筛选食谱
  const filterRecipesByDifficulty = (difficulty) => {
    return recipes.value.filter(recipe => 
      recipe.difficulty === difficulty
    )
  }
  
  // 按时间筛选食谱
  const filterRecipesByTime = (maxTime) => {
    return recipes.value.filter(recipe => 
      recipe.cookingTime <= maxTime
    )
  }
  
  return {
    // 状态
    user,
    loading,
    recipes,
    currentRecipe,
    
    // 计算属性
    isLoggedIn,
    recipeCount,
    
    // 方法
    setUser,
    clearUser,
    setLoading,
    setRecipes,
    addRecipe,
    updateRecipe,
    removeRecipe,
    setCurrentRecipe,
    clearCurrentRecipe,
    getRandomRecipe,
    searchRecipes,
    filterRecipesByTag,
    filterRecipesByDifficulty,
    filterRecipesByTime
  }
}) 