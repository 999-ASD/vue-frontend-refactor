import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  username: string
  name: string
  role: string
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  
  const isLoggedIn = computed(() => !!currentUser.value)
  
  const userRole = computed(() => currentUser.value?.role || '')

  function login(username: string, password: string): boolean {
    if (username === 'admin' && password === '123456') {
      currentUser.value = {
        id: 1,
        username: 'admin',
        name: '李思',
        role: 'admin',
        token: 'mock-jwt-token-' + Date.now()
      }
      localStorage.setItem('token', currentUser.value.token)
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      return true
    }
    return false
  }

  function logout(): void {
    currentUser.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function loadFromStorage(): void {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      try {
        currentUser.value = JSON.parse(storedUser)
      } catch {
        logout()
      }
    }
  }

  return {
    currentUser,
    isLoggedIn,
    userRole,
    login,
    logout,
    loadFromStorage
  }
})