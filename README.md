# 智慧医院管理系统

基于 Vue 3 + Vite 的现代化智慧医院管理系统前端项目。

## 技术栈

- **框架**: Vue 3 (Composition API + Script Setup)
- **构建工具**: Vite 5
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI 组件库**: Element Plus
- **语言**: TypeScript
- **代码规范**: ESLint + Prettier

## 功能模块

| 模块 | 功能 |
|------|------|
| 🏠 首页 | 数据统计仪表盘 |
| 🔐 登录 | 用户认证与权限控制 |
| 📝 挂号管理 | 患者挂号、退号、记录查询 |
| 👥 患者管理 | 患者信息管理、队列叫号 |
| 📋 病历管理 | 病历创建、编辑、查看 |
| 💊 处方管理 | 处方开具、药品选择 |
| 🏪 药房管理 | 药品库存、发药管理 |

## 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # 组件
│   ├── common/         # 公共组件
│   └── business/       # 业务组件
├── views/              # 页面组件
│   ├── auth/          # 认证页面
│   ├── registration/  # 挂号相关
│   ├── patient/       # 患者管理
│   ├── doctor/        # 医生管理
│   ├── drug/          # 药房管理
│   └── record/        # 病历管理
├── layouts/           # 布局组件
├── router/            # 路由配置
├── stores/            # Pinia 状态管理
├── utils/             # 工具函数
├── App.vue
└── main.ts
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 登录信息

- **用户名**: admin
- **密码**: 123456

## License

MIT