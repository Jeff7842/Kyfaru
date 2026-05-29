'use client'

import { useQuery } from '@tanstack/react-query'

// Country + state/county data from countriesnow.space (free, no key).
// Cached aggressively since this data is effectively static.

export function useCountriesList() {
  return useQuery({
    queryKey: ['geo-countries'],
    queryFn: async (): Promise<string[]> => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/iso')
      const json = await res.json()
      const names: string[] = (json?.data ?? []).map((c: { name: string }) => c.name)
      return names.sort()
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })
}

export function useStates(country: string) {
  return useQuery({
    queryKey: ['geo-states', country],
    queryFn: async (): Promise<string[]> => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      })
      const json = await res.json()
      const states: string[] = (json?.data?.states ?? []).map((s: { name: string }) => s.name)
      return states.sort()
    },
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })
}
