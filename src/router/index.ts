import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import registrationRoutes from './modules/registration'
import patientRoutes from './modules/patient'
import recordRoutes from './modules/record'
import doctorRoutes from './modules/doctor'
import drugRoutes from './modules/drug'

const routes: RouteRecordRaw[] = [
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录' }
  },
  { 
    path: '/', 
    name: 'Layout', 
    component: () => import('@/layouts/Layout.vue'),
    redirect: '/dashboard',
    children: [
      { 
        path: '/dashboard', 
        name: 'Dashboard', 
        component: () => import('@/views/Dashboard.vue'),
        meta: { role: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist'], title: '首页' }
      },
      {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/Test.vue')
      },
      ...registrationRoutes,
      ...patientRoutes,
      ...recordRoutes,
      ...doctorRoutes,
      ...drugRoutes
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.path === '/login') {
    return next()
  }
  
  const authStore = useAuthStore()
  authStore.loadFromStorage()
  
  if (!authStore.isLoggedIn) {
    return next('/login')
  }
  
  if (to.meta.title) {
    document.title = `智慧医院HIS系统 - ${to.meta.title}`
  }
  
  next()
})

export default router