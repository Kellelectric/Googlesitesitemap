import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { pageMetadata } from '@/lib/metadata'
import { SearchPageClient } from './SearchPageClient'

export const metadata: Metadata = pageMetadata({
  title: 'Search',
  description: 'Search services, industries, projects, resources, and news across the Kell Electricals Ltd site.',
  path: '/search',
  noIndex: true,
})

export default function SearchPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Search</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Find anything on the site
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Services, industries, projects, resources, news, and service
            areas - all in one place.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content max-w-2xl">
          <Suspense fallback={null}>
            <SearchPageClient />
          </Suspense>
        </div>
      </section>
    </>
  )
}
