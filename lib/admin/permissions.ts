// ============================================================
// Role-based permission helpers. Used in every server action.
// ============================================================

export type Role =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'viewer'
  | 'communications'
  | 'tech'
  | 'finance'
  | 'sales'

const HIERARCHY: Record<Role, number> = {
  viewer: 1,
  communications: 1,
  tech: 1,
  finance: 1,
  sales: 1,
  manager: 2,
  admin: 3,
  super_admin: 4,
}

export function hasRole(userRole: Role | undefined, required: Role): boolean {
  if (!userRole) return false
  return (HIERARCHY[userRole] ?? 0) >= (HIERARCHY[required] ?? 0)
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
  communications: 'Communications',
  tech: 'Tech',
  finance: 'Finance',
  sales: 'Sales',
}

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: 'bg-yellow-500/15 text-yellow-700',
  admin: 'bg-emerald-500/15 text-emerald-700',
  manager: 'bg-blue-500/15 text-blue-700',
  viewer: 'bg-zinc-500/15 text-zinc-600',
  communications: 'bg-purple-500/15 text-purple-700',
  tech: 'bg-cyan-500/15 text-cyan-700',
  finance: 'bg-orange-500/15 text-orange-700',
  sales: 'bg-pink-500/15 text-pink-700',
}
