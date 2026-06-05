import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/doctor',
    name: 'Doctor',
    component: () => import('@/views/doctor/Index.vue'),
    meta: { role: ['admin', 'doctor'], title: '医生管理' }
  }
]

export default routes