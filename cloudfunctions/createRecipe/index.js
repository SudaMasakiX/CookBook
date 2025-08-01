// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const {
      name,
      description,
      difficulty,
      cookingTime,
      servings,
      tags,
      ingredients,
      steps,
      images,
      tips
    } = event
    
    // 数据验证
    if (!name || !name.trim()) {
      return {
        success: false,
        message: '食谱名称不能为空'
      }
    }
    
    if (!ingredients || ingredients.length === 0) {
      return {
        success: false,
        message: '至少需要一个食材'
      }
    }
    
    if (!steps || steps.length === 0) {
      return {
        success: false,
        message: '至少需要一个制作步骤'
      }
    }
    
    // 构建食谱数据
    const recipeData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      difficulty: parseInt(difficulty) || 1,
      cookingTime: parseInt(cookingTime) || 0,
      servings: parseInt(servings) || 1,
      tags: Array.isArray(tags) ? tags : [],
      ingredients: ingredients.filter(item => item.name && item.name.trim()),
      steps: steps.filter(item => item.description && item.description.trim()),
      images: Array.isArray(images) ? images : [],
      tips: tips ? tips.trim() : '',
      favoriteCount: 0,
      viewCount: 0,
      createTime: new Date(),
      updateTime: new Date(),
      _openid: wxContext.OPENID
    }
    
    // 保存到数据库
    const result = await db.collection('recipes').add({
      data: recipeData
    })
    
    if (result._id) {
      // 返回完整的食谱数据（包含生成的ID）
      const newRecipe = {
        _id: result._id,
        ...recipeData
      }
      
      return {
        success: true,
        data: newRecipe,
        message: '食谱创建成功'
      }
    } else {
      return {
        success: false,
        message: '创建失败'
      }
    }
  } catch (error) {
    console.error('创建食谱失败:', error)
    return {
      success: false,
      message: '创建食谱失败',
      error: error.message
    }
  }
} 