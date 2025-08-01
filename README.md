# 美食食谱小程序

一个专为女朋友打造的微信小程序，用于记录和管理美食食谱，支持图片上传、随机推荐等功能。

## 技术栈

- **前端框架**: Vue 3 + uni-app
- **UI组件**: Vant Weapp
- **样式**: TailwindCSS
- **构建工具**: Vite
- **状态管理**: Pinia
- **后端**: 微信云开发
- **数据库**: 云数据库
- **文件存储**: 云存储

## 功能特性

### 📖 食谱管理
- ✅ 创建食谱（名称、描述、难度、制作时间、用餐人数）
- ✅ 添加食材清单（名称、用量）
- ✅ 详细制作步骤（支持步骤图片）
- ✅ 食谱标签分类
- ✅ 上传食谱图片（最多5张）
- ✅ 小贴士和注意事项

### 🔍 浏览和搜索
- ✅ 食谱列表展示
- ✅ 关键词搜索（名称、描述、食材）
- ✅ 标签筛选
- ✅ 食谱详情查看
- ✅ 图片预览功能

### 🎲 随机推荐
- ✅ 随机菜品推荐
- ✅ 按难度筛选
- ✅ 按制作时间筛选
- ✅ 按菜系筛选
- ✅ 推荐历史记录

### 👤 个人中心
- ✅ 用户资料管理
- ✅ 食谱统计信息
- ✅ 缓存管理
- ✅ 关于应用

## 项目结构

```
CookBook/
├── cloudfunctions/          # 云函数目录
│   ├── checkAuth/          # 用户认证
│   ├── createRecipe/       # 创建食谱
│   ├── deleteRecipe/       # 删除食谱
│   ├── getRecipeById/      # 获取食谱详情
│   ├── getRecipes/         # 获取食谱列表
│   └── updateRecipe/       # 更新食谱
├── src/
│   ├── api/                # API接口
│   ├── components/         # 公共组件
│   │   ├── ImageUpload.vue # 图片上传组件
│   │   ├── RecipeCard.vue  # 食谱卡片
│   │   └── RecipeSkeleton.vue # 骨架屏
│   ├── pages/              # 页面目录
│   │   ├── index/          # 首页
│   │   ├── recipe/         # 食谱相关页面
│   │   └── user/           # 用户页面
│   ├── static/             # 静态资源
│   │   ├── css/           # 样式文件
│   │   ├── images/        # 图片资源
│   │   └── tabbar/        # 标签栏图标
│   ├── stores/             # 状态管理
│   ├── utils/              # 工具函数
│   ├── App.vue            # 应用入口
│   ├── main.js            # 主入口文件
│   ├── manifest.json      # 应用配置
│   └── pages.json         # 页面路由配置
├── package.json           # 项目依赖
├── tailwind.config.js     # TailwindCSS配置
├── vite.config.js         # Vite配置
└── project.config.json    # 微信小程序配置
```

## 开发环境搭建

### 1. 安装依赖
```bash
npm install
```

### 2. 微信开发者工具配置
1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 创建小程序项目，获取 AppID
3. 开启云开发，创建云环境

### 3. 配置文件修改
1. 修改 `project.config.json` 中的 `appid`
2. 修改 `src/manifest.json` 中的 `mp-weixin.appid`
3. 修改 `src/App.vue` 中的云环境ID

### 4. 云函数部署
在微信开发者工具中：
1. 右键点击 `cloudfunctions` 目录
2. 选择"创建并部署云函数"
3. 依次部署所有云函数

### 5. 数据库配置
在云开发控制台创建以下集合：
- `recipes` - 食谱集合
- `users` - 用户集合

### 6. 启动开发
```bash
npm run dev:mp
```

## 云开发配置

### 云函数权限
所有云函数需要配置以下权限：
- 数据库读写权限
- 云存储读写权限

### 数据库索引
为提高查询性能，建议为以下字段创建索引：
- `recipes._openid`
- `recipes.createTime`
- `recipes.tags`
- `users._openid`

## 部署说明

1. **云函数部署**: 在微信开发者工具中上传并部署所有云函数
2. **小程序发布**: 通过微信开发者工具提交代码并发布
3. **云环境配置**: 确保云环境资源配额满足需求

## 注意事项

### 开发注意点
- 所有样式使用 TailwindCSS 类名
- 图片上传需要配置云存储权限
- 测试时注意小程序包大小限制（2MB）

### 图标资源
项目中的标签栏图标需要自行准备，放置在 `src/static/tabbar/` 目录下：
- home.png / home-active.png (首页)
- add.png / add-active.png (添加)
- random.png / random-active.png (随机)
- user.png / user-active.png (用户)

建议尺寸：24x24 像素，PNG格式

### 云开发限制
- 免费版云开发有资源限制
- 注意数据库读写次数配额
- 云存储空间限制

## 功能扩展建议

- [ ] 食谱分享功能
- [ ] 用户收藏系统
- [ ] 烹饪计时器
- [ ] 购物清单生成
- [ ] 营养成分分析
- [ ] 用户评论系统
- [ ] 食谱导入导出

## 技术支持

如有问题，请通过以下方式联系：
- 微信: [您的微信号]
- 邮箱: [您的邮箱]

## 许可证

MIT License
