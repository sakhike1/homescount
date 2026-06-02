import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export default async function AdminLoginPage() {
  const session = await auth()
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  return <AdminLoginForm />
}
