# 智慧医院管理系统 - Vue 3 重构总结

## 一、项目基础搭建

### 1.1 技术栈升级
- **框架**: Vue 3.4 + Composition API
- **语言**: TypeScript 5.x
- **构建工具**: Vite 5.x
- **状态管理**: Pinia 2.x
- **路由**: Vue Router 4.x
- **UI 组件库**: Element Plus 2.x
- **代码规范**: ESLint + Prettier

### 1.2 项目初始化
使用官方脚手架创建标准模板：
```bash
npm create vue@latest .
```

---

## 二、结构规范化

### 2.1 标准目录结构
```
src/
├── assets/              # 静态资源（图片、样式）
├── components/          # 组件目录
│   ├── common/         # 公共组件（CommonTable、SearchForm、OperationDialog）
│   └── business/       # 业务组件
├── views/              # 页面视图
│   ├── auth/           # 认证模块（Login.vue）
│   ├── registration/   # 挂号管理（Registration.vue、RegistrationRecord.vue）
│   ├── patient/        # 患者管理（PatientList.vue、PatientQueue.vue）
│   ├── record/         # 病历管理（MedicalRecord.vue、Prescription.vue）
│   └── drug/           # 药房管理（DrugStore.vue）
├── layouts/            # 布局组件（Layout.vue）
├── router/             # 路由配置
├── stores/             # Pinia 状态管理
├── utils/              # 工具函数
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

### 2.2 公共组件封装
| 组件名 | 功能说明 |
|--------|----------|
| `CommonTable.vue` | 可复用表格组件，支持状态标签、分页 |
| `SearchForm.vue` | 通用搜索表单，支持输入框、下拉选择、日期选择 |
| `OperationDialog.vue` | 通用操作弹窗，支持新增/编辑表单 |

---

## 三、核心功能模块

### 3.1 登录模块
- 登录页面：[Login.vue](file:///d:/大二下课程/web/源码2.0/src/views/auth/Login.vue)
- 表单验证（用户名、密码必填校验）
- 路由守卫（未登录自动跳转登录页）
- Token 持久化（Pinia + localStorage）

### 3.2 布局框架
- 布局组件：[Layout.vue](file:///d:/大二下课程/web/源码2.0/src/layouts/Layout.vue)
- Header（顶部导航）+ Sidebar（侧边菜单）+ Main（主内容区）
- 使用 Element Plus `el-menu` 实现菜单导航
- 固定 PC 宽屏布局

### 3.3 挂号管理
- 窗口挂号：[Registration.vue](file:///d:/大二下课程/web/源码2.0/src/views/registration/Registration.vue)
- 挂号记录：[RegistrationRecord.vue](file:///d:/大二下课程/web/源码2.0/src/views/registration/RegistrationRecord.vue)
- 支持搜索、分页、退号操作

### 3.4 患者管理
- 患者列表：[PatientList.vue](file:///d:/大二下课程/web/源码2.0/src/views/patient/PatientList.vue)
- 排队叫号：[PatientQueue.vue](file:///d:/大二下课程/web/源码2.0/src/views/patient/PatientQueue.vue)
- 增删改查（弹窗形式）

### 3.5 病历管理
- 病历详情：[MedicalRecord.vue](file:///d:/大二下课程/web/源码2.0/src/views/record/MedicalRecord.vue)
- 处方管理：[Prescription.vue](file:///d:/大二下课程/web/源码2.0/src/views/record/Prescription.vue)

### 3.6 药房管理
- 药房管理：[DrugStore.vue](file:///d:/大二下课程/web/源码2.0/src/views/drug/DrugStore.vue)
- 发药管理、药品库存管理
- 入库/出库操作

---

## 四、Pinia 状态管理

### 4.1 Store 结构
| Store 文件 | 功能说明 |
|------------|----------|
| `auth.ts` | 用户认证状态（登录、登出、Token 管理） |
| `patient.ts` | 患者数据管理（患者列表、排队队列） |
| `registration.ts` | 挂号数据管理（挂号记录、科室医生） |
| `drug.ts` | 药品数据管理（药品库存、处方） |

### 4.2 状态持久化
所有 Store 支持 `localStorage` 持久化，刷新页面后数据不丢失。

---

## 五、路由配置

### 5.1 路由表结构
```typescript
const routes = [
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/', 
    name: 'Layout', 
    component: Layout,
    redirect: '/dashboard',
    children: [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/registration', name: 'Registration' },
      { path: '/registration-record', name: 'RegistrationRecord' },
      { path: '/patient-list', name: 'PatientList' },
      { path: '/patient-queue', name: 'PatientQueue' },
      { path: '/medical-record/:id?', name: 'MedicalRecord' },
      { path: '/prescription', name: 'Prescription' },
      { path: '/drugstore', name: 'DrugStore' }
    ]
  }
]
```

### 5.2 路由守卫
- 全局前置守卫：检查登录状态
- 未登录访问受限路由自动跳转登录页
- 已登录访问登录页自动跳转首页

---

## 六、Vue 3 高级特性应用

### 6.1 Composition API
- 所有组件使用 `<script setup>` 语法糖
- 响应式数据：`ref`、`reactive`、`computed`
- 生命周期：`onMounted`、`onUnmounted`

### 6.2 动画效果
- 使用 `<Transition>` 实现页面切换动画
- Element Plus 内置动画组件

### 6.3 类型安全
- TypeScript 接口定义（Patient、Drug、Registration 等）
- 严格模式类型检查

---

## 七、代码质量保障

### 7.1 ESLint 配置
- 代码风格检查
- 潜在问题检测
- 统一代码规范

### 7.2 构建验证
```bash
npm run build    # 生产构建
npm run dev      # 开发服务器
npm run lint     # ESLint 检查
```

---

## 八、亮点总结

| 维度 | 亮点 |
|------|------|
| **架构设计** | 标准 Vue 3 项目结构，易于维护和扩展 |
| **代码复用** | 公共组件封装，减少重复代码 |
| **状态管理** | Pinia + localStorage 实现数据持久化 |
| **路由控制** | 完善的路由守卫和权限控制 |
| **类型安全** | TypeScript 全程支持 |
| **UI 体验** | Element Plus 组件库，界面美观统一 |
| **开发效率** | Vite 构建工具，热更新快速 |

---

## 九、快速启动

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

---

**项目版本**: v1.0.0  
**最后更新**: 2026年6月  
**技术栈**: Vue 3 + TypeScript + Vite + Pinia + Element Plus