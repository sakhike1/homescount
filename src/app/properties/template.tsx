export default function PropertiesTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="motion-safe:animate-[fadeIn_0.2s_ease-out]">{children}</div>
  )
}
