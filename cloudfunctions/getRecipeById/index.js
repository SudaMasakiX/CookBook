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
    const { id } = event
    
    if (!id) {
      return {
        success: false,
        message: '食谱ID不能为空'
      }
    }
    
    // 获取食谱详情
    const result = await db.collection('recipes')
      .doc(id)
      .get()
    
    if (result.data) {
      // 增加浏览次数
      await db.collection('recipes')
        .doc(id)
        .update({
          data: {
            viewCount: db.command.inc(1)
          }
        })
      
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: '食谱不存在'
      }
    }
  } catch (error) {
    console.error('获取食谱详情失败:', error)
    return {
      success: false,
      message: '获取食谱详情失败',
      error: error.message
    }
  }
} 