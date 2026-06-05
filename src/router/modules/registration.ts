import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/registration-home',
    name: 'RegistrationHome',
    component: () => import('@/views/registration/Index.vue'),
    meta: { role: ['admin', 'receptionist'], title: '挂号管理' }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('@/views/registration/Registration.vue'),
    meta: { role: ['admin', 'receptionist'], title: '窗口挂号' }
  },
  {
    path: '/registration-record',
    name: 'RegistrationRecord',
    component: () => import('@/views/registration/RegistrationRecord.vue'),
    meta: { role: ['admin', 'receptionist'], title: '挂号记录' }
  }
]

export default routes