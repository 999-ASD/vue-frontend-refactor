import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/patient-home',
    name: 'PatientHome',
    component: () => import('@/views/patient/Index.vue'),
    meta: { role: ['admin', 'doctor', 'nurse'], title: '患者管理' }
  },
  {
    path: '/patient-list',
    name: 'PatientList',
    component: () => import('@/views/patient/PatientList.vue'),
    meta: { role: ['admin', 'doctor', 'nurse'], title: '患者列表' }
  },
  {
    path: '/patient-queue',
    name: 'PatientQueue',
    component: () => import('@/views/patient/PatientQueue.vue'),
    meta: { role: ['admin', 'doctor', 'nurse'], title: '排队叫号' }
  }
]

export default routes