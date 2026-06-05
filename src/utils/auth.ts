export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  PHARMACIST: 'pharmacist'
}

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMIN]: '超级管理员',
  [ROLES.DOCTOR]: '医生',
  [ROLES.NURSE]: '护士',
  [ROLES.RECEPTIONIST]: '挂号员',
  [ROLES.PHARMACIST]: '药剂师'
}

export function hasPermission(role: string, requiredRoles: string[]): boolean {
  if (!role || !requiredRoles || requiredRoles.length === 0) {
    return false
  }
  return requiredRoles.includes(role)
}

export function canAccess(role: string, routeMeta: { role?: string[] }): boolean {
  if (!routeMeta?.role || routeMeta.role.length === 0) {
    return true
  }
  return hasPermission(role, routeMeta.role)
}