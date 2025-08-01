// 食谱相关API
export const recipeAPI = {
  // 获取所有食谱
  async getAll() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getRecipes'
      })
      return res.result
    } catch (error) {
      console.error('获取食谱列表失败:', error)
      throw error
    }
  },

  // 根据ID获取食谱详情
  async getById(id) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getRecipeById',
        data: { id }
      })
      return res.result
    } catch (error) {
      console.error('获取食谱详情失败:', error)
      throw error
    }
  },

  // 创建新食谱
  async create(recipeData) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'createRecipe',
        data: recipeData
      })
      return res.result
    } catch (error) {
      console.error('创建食谱失败:', error)
      throw error
    }
  },

  // 更新食谱
  async update(id, recipeData) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'updateRecipe',
        data: { id, ...recipeData }
      })
      return res.result
    } catch (error) {
      console.error('更新食谱失败:', error)
      throw error
    }
  },

  // 删除食谱
  async delete(id) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'deleteRecipe',
        data: { id }
      })
      return res.result
    } catch (error) {
      console.error('删除食谱失败:', error)
      throw error
    }
  },

  // 上传图片到云存储
  async uploadImage(filePath) {
    try {
      const cloudPath = `recipe-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return res.fileID
    } catch (error) {
      console.error('上传图片失败:', error)
      throw error
    }
  },

  // 搜索食谱
  async search(keyword) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'searchRecipes',
        data: { keyword }
      })
      return res.result
    } catch (error) {
      console.error('搜索食谱失败:', error)
      throw error
    }
  },

  // 获取随机食谱
  async getRandom() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getRandomRecipe'
      })
      return res.result
    } catch (error) {
      console.error('获取随机食谱失败:', error)
      throw error
    }
  },

  // 获取食谱标签
  async getTags() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getRecipeTags'
      })
      return res.result
    } catch (error) {
      console.error('获取食谱标签失败:', error)
      throw error
    }
  }
} 