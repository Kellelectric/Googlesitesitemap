'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { buildSearchIndex, searchEntries } from '@/lib/searchIndex'

const searchIndex = buildSearchIndex()

export function SearchBox({
  autoFocus = false,
  initialQuery = '',
  onNavigate,
}: {
  autoFocus?: boolean
  initialQuery?: string
  onNavigate?: () => void
}) {
  const [query, setQuery] = useState(initialQuery)
  const results = useMemo(() => searchEntries(searchIndex, query), [query])

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search services, projects, resources..."
        aria-label="Search the site"
        className="w-full border border-ink/15 bg-paper px-4 py-3 text-base text-ink outline-none placeholder:text-ink/40 focus-visible:border-petrol"
      />

      {query.trim().length > 0 && (
        <ul className="mt-4 divide-y divide-ink/10 border border-ink/10">
          {results.length === 0 ? (
            <li className="p-4 text-sm text-ink/60">
              No matches for &ldquo;{query}&rdquo;. Try a service, area, or project name.
            </li>
          ) : (
            results.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  onClick={onNavigate}
                  className="group flex items-start justify-between gap-4 p-4 hover:bg-petrol/5"
                >
                  <div>
                    <span className="eyebrow text-petrol/70">{entry.category}</span>
                    <p className="mt-1 font-semibold text-ink group-hover:text-petrol">
                      {entry.title}
                    </p>
                    <p className="mt-1 text-sm text-ink/60">{entry.description}</p>
                  </div>
                  <span aria-hidden="true" className="mt-1 shrink-0 text-petrol">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
