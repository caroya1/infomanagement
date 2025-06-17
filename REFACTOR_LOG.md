# 粤西醒狮文化推广系统前端结构优化说明

## 主要目录结构调整

- `src/views/admin/`：后台管理相关页面（如主页、管理、分析、用户管理等）
- `src/views/forum/`：论坛相关页面（列表、详情等）
- `src/views/learning/`：学习活动相关页面（列表、详情等）
- `src/views/mall/`：商城相关页面（商品列表、详情等）
- `src/views/profile/`：个人中心相关页面
- `src/components/admin/`：后台管理通用组件（如侧边栏、管理表格等）
- `src/components/common/`：全局通用组件（如 Navbar、通用对话框等）
- `src/api/`：API 按业务拆分，mall 相关接口单独放到 mall.js

## 主要代码结构优化

- 抽象出通用表格、对话框、Navbar 等组件，减少重复代码
- 删除未用到的变量、方法、样式
- 后端未实现的接口已用醒目注释标明，并注明请求和期望返回
- 添加了必要的注释，提升可读性

## 具体文件迁移与重构

- `views` 下所有页面已按业务模块迁移到对应子目录
- `Navbar.vue` 移动到 `components/common/`
- 后台管理相关页面和表格抽象到 `components/admin/`
- API 拆分，商城相关接口单独放到 `api/mall.js`
- 其它详见各文件头部注释

---
如需详细 diff 或具体文件内容，请随时告知。
