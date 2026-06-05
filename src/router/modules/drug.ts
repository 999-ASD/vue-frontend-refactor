import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/drugstore',
    name: 'DrugStore',
    component: () => import('@/views/drug/DrugStore.vue'),
    meta: { role: ['admin', 'pharmacist'], title: '药房管理' }
  }
]

export default routes