'use client'

import { useState } from 'react'
import { TestimonialCard } from '@/components/sections/TestimonialCard'
import type { Testimonial } from '@/content/testimonials'

const INITIAL_COUNT = 6

export function TestimonialGrid({ items }: { items: Testimonial[] }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? items : items.slice(0, INITIAL_COUNT)

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      {!expanded && items.length > INITIAL_COUNT && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center justify-center rounded border border-ink/20 px-8 py-3 text-sm font-semibold text-ink transition-colors hover:border-petrol hover:text-petrol"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  )
}
