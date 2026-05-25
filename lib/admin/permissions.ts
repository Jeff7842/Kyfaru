// ============================================================
// Role-based permission helpers. Used in every server action.
// ============================================================

export type Role = 'super_admin' | 'admin' | 'manager' | 'viewer'

const HIERARCHY: Record<Role, number> = {
  viewer: 1,
  manager: 2,
  admin: 3,
  super_admin: 4,
}

export function hasRole(userRole: Role | undefined, required: Role): boolean {
  if (!userRole) return false
  return HIERARCHY[userRole] >= HIERARCHY[required]
}

export function requireRole(userRole: Role | undefined, required: Role) {
  if (!hasRole(userRole, required)) {
    throw new Error(`Forbidden — requires ${required} role`)
  }
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  viewer: 'Viewer',
}

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300',
  admin: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  manager: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  viewer: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300',
}
