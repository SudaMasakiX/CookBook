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
        message: '无权限删除此食谱'
      }
    }
    
    // 删除食谱
    const result = await db.collection('recipes')
      .doc(id)
      .remove()
    
    if (result.stats.removed > 0) {
      return {
        success: true,
        message: '删除成功'
      }
    } else {
      return {
        success: false,
        message: '删除失败'
      }
    }
  } catch (error) {
    console.error('删除食谱失败:', error)
    return {
      success: false,
      message: '删除食谱失败',
      error: error.message
    }
  }
}
 