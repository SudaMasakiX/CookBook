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
      id,
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
    
    if (!id) {
      return {
        success: false,
        message: '食谱ID不能为空'
      }
    }
    
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
    
    // 先检查食谱是否存在且属于当前用户
    const checkResult = await db.collection('recipes')
      .doc(id)
      .get()
    
    if (!checkResult.data) {
      return {
        success: false,
        message: '食谱不存在'
      }
    }
    
    if (checkResult.data._openid !== wxContext.OPENID) {
      return {
        success: false,
        message: '无权限修改此食谱'
      }
    }
    
    // 构建更新数据
    const updateData = {
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
      updateTime: new Date()
    }
    
    // 更新食谱
    const result = await db.collection('recipes')
      .doc(id)
      .update({
        data: updateData
      })
    
    if (result.stats.updated > 0) {
      // 返回更新后的完整数据
      const updatedRecipe = {
        _id: id,
        ...checkResult.data,
        ...updateData
      }
      
      return {
        success: true,
        data: updatedRecipe,
        message: '更新成功'
      }
    } else {
      return {
        success: false,
        message: '更新失败'
      }
    }
  } catch (error) {
    console.error('更新食谱失败:', error)
    return {
      success: false,
      message: '更新食谱失败',
      error: error.message
    }
  }
} 