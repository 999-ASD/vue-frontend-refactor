import request from '../utils/request'

export interface User {
  id: number
  username: string
  name: string
  role: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const login = (username: string, password: string) => 
  request.post<LoginResponse>('/auth/login', { username, password })

export const logout = () => request.post('/auth/logout')

export const getCurrentUser = () => request.get<User>('/auth/me')