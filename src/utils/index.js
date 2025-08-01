// 通用工具函数

// 防抖函数
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export function throttle(func, wait) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, wait)
    }
  }
}

// 格式化时间
export function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes}分钟`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}小时`
    } else {
      return `${hours}小时${remainingMinutes}分钟`
    }
  }
}

// 格式化日期
export function formatDate(date) {
  const now = new Date()
  const target = new Date(date)
  const diff = now - target
  const day = 1000 * 60 * 60 * 24

  if (diff < day) {
    return '今天'
  } else if (diff < day * 2) {
    return '昨天'
  } else if (diff < day * 7) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return target.toLocaleDateString()
  }
}

// 获取难度中文名称
export function getDifficultyText(level) {
  const difficultyMap = {
    1: '简单',
    2: '中等',
    3: '困难'
  }
  return difficultyMap[level] || '未知'
}

// 获取难度颜色
export function getDifficultyColor(level) {
  const colorMap = {
    1: 'text-green-600',
    2: 'text-yellow-600',
    3: 'text-red-600'
  }
  return colorMap[level] || 'text-gray-600'
}

// 图片压缩
export function compressImage(src, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = wx.createCanvasContext('compressCanvas')
    wx.getImageInfo({
      src,
      success: (res) => {
        const { width, height } = res
        const maxWidth = 800
        const maxHeight = 600
        
        let newWidth = width
        let newHeight = height
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          newWidth = width * ratio
          newHeight = height * ratio
        }
        
        canvas.drawImage(src, 0, 0, newWidth, newHeight)
        canvas.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'compressCanvas',
            quality,
            success: (res) => resolve(res.tempFilePath),
            fail: () => resolve(src)
          })
        })
      },
      fail: () => resolve(src)
    })
  })
}

// 显示提示消息
export function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title,
    icon,
    duration
  })
}

// 显示加载中
export function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

// 隐藏加载中
export function hideLoading() {
  wx.hideLoading()
}

// 显示确认对话框
export function showModal(title, content) {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

// 选择图片
export function chooseImage(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: resolve,
      fail: reject
    })
  })
}

// 预览图片
export function previewImage(current, urls) {
  wx.previewImage({
    current,
    urls
  })
}

// 获取用户授权
export function getUserProfile() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: resolve,
      fail: reject
    })
  })
}

// 生成唯一ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 深拷贝
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })
    return cloned
  }
}

// 数组去重
export function unique(arr, key) {
  if (!key) {
    return [...new Set(arr)]
  }
  const seen = new Set()
  return arr.filter(item => {
    const val = item[key]
    if (seen.has(val)) {
      return false
    }
    seen.add(val)
    return true
  })
} 