// ============================================================
// useLocationSearch
// Free-form city/place autocomplete using OpenStreetMap's
// Nominatim API. No key required (public usage policy:
// max 1 req/s and a User-Agent header). We debounce the query
// at the call site so a hot autocomplete won't get throttled.
// ============================================================

import { useQuery } from '@tanstack/react-query'

export interface LocationSuggestion {
  /** Compact display string e.g. "Nairobi, Kenya" */
  label: string
  /** Pre-built fully-qualified address e.g. "Nairobi, Nairobi County, Kenya" */
  fullAddress: string
  /** Country name in English */
  country: string
  lat: number
  lon: number
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

const ENDPOINT = 'https://nominatim.openstreetmap.org/search'

/**
 * Fetches up to 6 location suggestions for the given free-text query.
 * Skips fetching entirely while query is too short.
 */
export function useLocationSearch(query: string) {
  const trimmed = query.trim()
  const enabled = trimmed.length >= 2

  return useQuery<LocationSuggestion[]>({
    queryKey: ['nominatim', trimmed],
    enabled,
    queryFn: async () => {
      const url = new URL(ENDPOINT)
      url.searchParams.set('q', trimmed)
      url.searchParams.set('format', 'jsonv2')
      url.searchParams.set('addressdetails', '1')
      url.searchParams.set('limit', '6')
      // Hint Nominatim about our language preference
      url.searchParams.set('accept-language', 'en')

      const res = await fetch(url.toString(), {
        headers: {
          // Nominatim usage policy: identify the app via User-Agent.
          // Browser fetch ignores custom User-Agent, but the policy is
          // primarily concerned with abuse \u2014 we honor the rate limit
          // via React Query's caching + the debounce upstream.
          'Accept': 'application/json',
        },
      })
      if (!res.ok) throw new Error(`nominatim failed: ${res.status}`)
      const raw = (await res.json()) as NominatimResult[]
      return raw.map((r) => {
        const city = r.address?.city ?? r.address?.town ?? r.address?.village ?? ''
        const country = r.address?.country ?? ''
        const label = [city, country].filter(Boolean).join(', ') || r.display_name
        return {
          label,
          fullAddress: r.display_name,
          country,
          lat: Number(r.lat),
          lon: Number(r.lon),
        }
      })
    },
    staleTime: 1000 * 60 * 5, // 5 min \u2014 the same query won't refetch within a session
    retry: 0,
  })
}
