import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/registration', component: () => import('../views/Registration.vue') },
  { path: '/registration-record', component: () => import('../views/RegistrationRecord.vue') },
  { path: '/patient-list', component: () => import('../views/PatientList.vue') },
  { path: '/medical-record', component: () => import('../views/MedicalRecord.vue') },
  { path: '/prescription', component: () => import('../views/Prescription.vue') },
  { path: '/drugstore', component: () => import('../views/DrugStore.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
