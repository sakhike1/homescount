'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  )
}
