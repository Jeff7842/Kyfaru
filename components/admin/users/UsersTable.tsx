'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Pencil, Snowflake, Trash2, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { kfToast } from '@/lib/admin/toast'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/admin/permissions'
import Pagination from '@/components/admin/shared/Pagination'
import UserSlideOver from './UserSlideOver'
import type { User } from '@/lib/admin/db/schema'
import type { Role } from '@/lib/admin/permissions'

interface UsersTableProps {
  initialUsers: User[]
  initialTotal: number
}

const PAGE_SIZE = 20

export default function UsersTable({ initialUsers, initialTotal }: UsersTableProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [slideOpen, setSlideOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchUsers = useCallback(async (newPage: number, search: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(newPage),
        pageSize: String(PAGE_SIZE),
        q: search,
      })
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [])

  function handleSearch(val: string) {
    setQ(val)
    setPage(0)
    fetchUsers(0, val)
  }

  function handlePageChange(p: number) {
    setPage(p)
    fetchUsers(p, q)
  }

  function openAdd() {
    setEditing(null)
    setSlideOpen(true)
  }

  function openEdit(u: User) {
    setEditing(u)
    setSlideOpen(true)
  }

  async function handleFreeze(u: User) {
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFrozen: !u.isFrozen }),
    })
    if (res.ok) {
      kfToast.success(u.isFrozen ? 'Account unfrozen' : 'Account frozen')
      fetchUsers(page, q)
      router.refresh()
    } else {
      kfToast.error('Failed to update user')
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      kfToast.success('User deactivated')
      setDeleteId(null)
      fetchUsers(page, q)
      router.refresh()
    } else {
      const data = await res.json()
      kfToast.error(data.error ?? 'Delete failed')
    }
  }

  function handleSaved(_saved: User) {
    fetchUsers(page, q)
    router.refresh()
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Search users…"
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20"
            />
          </div>
          <button
            onClick={openAdd}
            className="h-9 px-4 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Add user
          </button>
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 hidden md:table-cell">Access</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 hidden lg:table-cell">Last login</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className={cn(loading && 'opacity-50 pointer-events-none')}>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center shrink-0">
                          {u.avatarUrl || u.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.avatarUrl ?? u.image ?? ''}
                              alt={u.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-zinc-500">
                              {u.name[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{u.name}</p>
                          <p className="text-xs text-zinc-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                          ROLE_COLORS[u.role as Role] ?? 'bg-zinc-100 text-zinc-700',
                        )}
                      >
                        {ROLE_LABELS[u.role as Role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-zinc-500">
                      {u.accessType === 'permanent'
                        ? 'Permanent'
                        : u.accessUntil
                          ? `Until ${format(new Date(u.accessUntil), 'dd MMM yyyy')}`
                          : u.accessType}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-zinc-500">
                      {u.lastLoginAt ? format(new Date(u.lastLoginAt), 'dd MMM yyyy HH:mm') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                          u.isFrozen
                            ? 'bg-blue-100 text-blue-700'
                            : u.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-zinc-100 text-zinc-500',
                        )}
                      >
                        {u.isFrozen ? 'Frozen' : u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <ActionBtn
                          onClick={() => openEdit(u)}
                          title="Edit"
                          className="hover:text-[var(--kf-green)]"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => handleFreeze(u)}
                          title={u.isFrozen ? 'Unfreeze' : 'Freeze'}
                          className={u.isFrozen ? 'text-blue-600 hover:text-blue-800' : 'hover:text-blue-600'}
                        >
                          {u.isFrozen ? (
                            <UserCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Snowflake className="w-3.5 h-3.5" />
                          )}
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => setDeleteId(u.id)}
                          title="Delete"
                          className="hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>

      <UserSlideOver
        user={editing}
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        onSaved={handleSaved}
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative z-10 bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-semibold text-zinc-900 mb-2">Deactivate user?</h3>
            <p className="text-sm text-zinc-500 mb-5">
              The user will be deactivated and cannot log in. This action is logged.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ActionBtn({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 transition',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
