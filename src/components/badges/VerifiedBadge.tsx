import { BadgeCheck } from 'lucide-react'

type Props = {
  size?: 'sm' | 'md'
  className?: string
}

export default function VerifiedBadge({ size = 'sm', className = '' }: Props) {
  const isSm = size === 'sm'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-600 font-bold text-white ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
      title="Admin-verified listing"
    >
      <BadgeCheck className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden />
      Verified
    </span>
  )
}
