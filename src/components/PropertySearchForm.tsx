type Props = {
  action: string
  defaultQ?: string
  defaultPrice?: string
}

export default function PropertySearchForm({
  action,
  defaultQ = '',
  defaultPrice = '',
}: Props) {
  return (
    <form
      action={action}
      method="get"
      className="flex flex-col sm:flex-row gap-2 mb-8"
    >
      <input
        name="q"
        defaultValue={defaultQ}
        placeholder="City, suburb or address..."
        className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-sm"
      />
      <select
        name="price"
        defaultValue={defaultPrice}
        className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm bg-white"
      >
        <option value="">Any price</option>
        <option value="500000">Under R500k</option>
        <option value="1000000">Under R1M</option>
        <option value="2000000">Under R2M</option>
        <option value="5000000">Under R5M</option>
      </select>
      <button
        type="submit"
        className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
      >
        Search
      </button>
    </form>
  )
}
