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
    // 获取用户的所有食谱，按创建时间倒序
    const result = await db.collection('recipes')
      .where({
        _openid: wxContext.OPENID
      })
      .orderBy('createTime', 'desc')
      .get()
    
    return {
      success: true,
      data: result.data,
      count: result.data.length
    }
  } catch (error) {
    console.error('获取食谱列表失败:', error)
    return {
      success: false,
      message: '获取食谱列表失败',
      error: error.message
    }
  }
} 