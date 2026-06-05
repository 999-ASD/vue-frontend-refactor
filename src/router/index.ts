import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/registration', name: 'Registration', component: () => import('../views/Registration.vue') },
  { path: '/registration-record', name: 'RegistrationRecord', component: () => import('../views/RegistrationRecord.vue') },
  { path: '/patient-list', name: 'PatientList', component: () => import('../views/PatientList.vue') },
  { path: '/medical-record/:id?', name: 'MedicalRecord', component: () => import('../views/MedicalRecord.vue') },
  { path: '/prescription', name: 'Prescription', component: () => import('../views/Prescription.vue') },
  { path: '/drugstore', name: 'DrugStore', component: () => import('../views/DrugStore.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.path !== '/login') {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      return '/login'
    }
  }
})

export default router
