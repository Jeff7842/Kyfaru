// ============================================================
// useCountries
// Fetches the full ISO-3166 country list from the free
// restcountries.com API. Returns each country's name, flag emoji,
// dial code, and iso alpha-2 code. Cached via TanStack Query so
// the same payload is only fetched once per session.
// ============================================================

import { useQuery } from '@tanstack/react-query'

export interface Country {
  /** Common English name e.g. "Kenya" */
  name: string
  /** ISO 3166-1 alpha-2 code e.g. "KE" */
  code: string
  /** Emoji flag e.g. "🇰🇪" */
  flag: string
  /** International dial code e.g. "+254" */
  dial: string
}

// Shape of the upstream response we depend on.
interface RawCountry {
  name?: { common?: string }
  cca2?: string
  flag?: string
  idd?: {
    root?: string
    suffixes?: string[]
  }
}

const ENDPOINT =
  'https://restcountries.com/v3.1/all?fields=name,cca2,flag,idd'

/**
 * Normalises the raw restcountries payload into our compact Country
 * shape, sorts alphabetically, and drops entries without a dial code.
 */
function normalise(raw: RawCountry[]): Country[] {
  return raw
    .map((r) => {
      const root = r.idd?.root ?? ''
      const suffix = r.idd?.suffixes?.[0] ?? ''
      const dial = root && suffix ? `${root}${suffix}` : root || ''
      return {
        name: r.name?.common ?? '',
        code: r.cca2 ?? '',
        flag: r.flag ?? '',
        dial,
      }
    })
    .filter((c) => c.name && c.code && c.dial)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * React hook wrapping the country fetch with TanStack Query.
 */
export function useCountries() {
  return useQuery<Country[]>({
    queryKey: ['restcountries-v3'],
    queryFn: async () => {
      const res = await fetch(ENDPOINT, { cache: 'force-cache' })
      if (!res.ok) throw new Error(`countries fetch failed: ${res.status}`)
      const json = (await res.json()) as RawCountry[]
      return normalise(json)
    },
    staleTime: 1000 * 60 * 60 * 24, // 24h — country list never changes day-to-day
    retry: 1,
  })
}
