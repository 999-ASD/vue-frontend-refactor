import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/record-home',
    name: 'RecordHome',
    component: () => import('@/views/record/Index.vue'),
    meta: { role: ['admin', 'doctor'], title: '病历管理' }
  },
  {
    path: '/medical-record/:id?',
    name: 'MedicalRecord',
    component: () => import('@/views/record/MedicalRecord.vue'),
    meta: { role: ['admin', 'doctor'], title: '病历记录' }
  },
  {
    path: '/prescription',
    name: 'Prescription',
    component: () => import('@/views/record/Prescription.vue'),
    meta: { role: ['admin', 'doctor'], title: '开具处方' }
  },
  {
    path: '/prescription-list',
    name: 'PrescriptionList',
    component: () => import('@/views/record/PrescriptionList.vue'),
    meta: { role: ['admin', 'doctor'], title: '处方记录' }
  }
]

export default routes