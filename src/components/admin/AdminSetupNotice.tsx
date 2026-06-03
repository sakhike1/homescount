import { ADMIN_DB_SETUP_MESSAGE } from '@/lib/admin-errors'

export default function AdminSetupNotice({ detail }: { detail?: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-950"
    >
      <p className="font-bold">Database setup required</p>
      <p className="mt-2 leading-relaxed">{ADMIN_DB_SETUP_MESSAGE}</p>
      {detail && (
        <p className="mt-2 text-xs font-mono text-amber-900/80 break-all">{detail}</p>
      )}
    </div>
  )
}
