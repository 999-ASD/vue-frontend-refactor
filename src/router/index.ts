import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: () => import('../views/auth/Login.vue') },
  { 
    path: '/', 
    name: 'Layout', 
    component: () => import('../layouts/Layout.vue'),
    redirect: '/dashboard',
    children: [
      { path: '/dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: '/registration', name: 'Registration', component: () => import('../views/registration/Registration.vue') },
      { path: '/registration-record', name: 'RegistrationRecord', component: () => import('../views/registration/RegistrationRecord.vue') },
      { path: '/patient-list', name: 'PatientList', component: () => import('../views/patient/PatientList.vue') },
      { path: '/patient-queue', name: 'PatientQueue', component: () => import('../views/patient/PatientQueue.vue') },
      { path: '/doctor', name: 'Doctor', component: () => import('../views/doctor/Index.vue') },
      { path: '/medical-record/:id?', name: 'MedicalRecord', component: () => import('../views/record/MedicalRecord.vue') },
      { path: '/prescription', name: 'Prescription', component: () => import('../views/record/Prescription.vue') },
      { path: '/drugstore', name: 'DrugStore', component: () => import('../views/drug/DrugStore.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()
  
  if (to.path !== '/login') {
    if (!authStore.isLoggedIn) {
      return next('/login')
    }
  }
  
  if (to.path === '/login' && authStore.isLoggedIn) {
    return next('/dashboard')
  }
  
  next()
})

export default router