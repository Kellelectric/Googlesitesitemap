'use client'

import { useMemo, useState } from 'react'
import { TestimonialGrid } from '@/components/sections/TestimonialGrid'
import type { Testimonial } from '@/content/testimonials'

type Filter = 'All' | 'Google' | 'Trustpilot'

export function TestimonialFilterGrid({ items }: { items: Testimonial[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((t) => t.source === filter)),
    [items, filter],
  )

  const filters: Filter[] = ['All', 'Google', 'Trustpilot']

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews by source">
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`border px-4 py-2 text-sm font-semibold transition-colors ${
              filter === option
                ? 'border-petrol bg-petrol text-paper'
                : 'border-ink/15 text-ink/70 hover:border-petrol hover:text-petrol'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <TestimonialGrid items={filtered} />
      </div>
    </div>
  )
}
