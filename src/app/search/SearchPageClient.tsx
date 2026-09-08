'use client'

import { useSearchParams } from 'next/navigation'
import { SearchBox } from '@/components/search/SearchBox'

export function SearchPageClient() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  return <SearchBox autoFocus initialQuery={initialQuery} />
}
