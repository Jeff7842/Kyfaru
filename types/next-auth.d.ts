import type { Role } from '@/lib/admin/permissions'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: Role
    isTwoFactorEnabled?: boolean
  }

  interface Session {
    user: User & {
      id: string
      role?: Role
      isTwoFactorEnabled?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role
    isTwoFactorEnabled?: boolean
  }
}
