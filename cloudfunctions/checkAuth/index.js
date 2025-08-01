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
    // 获取或创建用户记录
    const userCollection = db.collection('users')
    
    // 查询用户是否存在
    const userResult = await userCollection
      .where({
        _openid: wxContext.OPENID
      })
      .get()
    
    let user
    
    if (userResult.data.length > 0) {
      // 用户已存在，更新最后登录时间
      user = userResult.data[0]
      await userCollection
        .doc(user._id)
        .update({
          data: {
            lastLoginTime: new Date()
          }
        })
    } else {
      // 新用户，创建用户记录
      const createResult = await userCollection.add({
        data: {
          _openid: wxContext.OPENID,
          createTime: new Date(),
          lastLoginTime: new Date(),
          recipeCount: 0,
          favoriteCount: 0
        }
      })
      
      user = {
        _id: createResult._id,
        _openid: wxContext.OPENID,
        createTime: new Date(),
        lastLoginTime: new Date(),
        recipeCount: 0,
        favoriteCount: 0
      }
    }
    
    return {
      success: true,
      user: {
        id: user._id,
        openid: user._openid,
        createTime: user.createTime,
        lastLoginTime: user.lastLoginTime,
        recipeCount: user.recipeCount || 0,
        favoriteCount: user.favoriteCount || 0
      }
    }
  } catch (error) {
    console.error('检查用户认证失败:', error)
    return {
      success: false,
      message: '检查用户认证失败',
      error: error.message
    }
  }
} 