/** Supabase PostgrestError is often not `instanceof Error`; normalize for UI. */
export function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message

  if (typeof e === 'object' && e !== null) {
    const o = e as Record<string, unknown>
    const parts: string[] = []
    if (typeof o.message === 'string') parts.push(o.message)
    if (typeof o.details === 'string' && o.details) parts.push(o.details)
    if (typeof o.hint === 'string' && o.hint) parts.push(o.hint)
    if (parts.length) return parts.join(' · ')
  }

  if (typeof e === 'string') return e
  return 'Failed to load data.'
}
