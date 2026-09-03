import Link from 'next/link'
import { Service, categoryLabels } from '@/content/services'

// index is optional so /services hub (which lists all 16 in category
// groups, not one flat numbered sequence) can keep rendering cards without
// numerals - only ServicesPreview's flat 6-up homepage grid passes one.
export function ServiceCard({ service, index }: { service: Service; index?: number }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col justify-between border border-ink/10 border-t-2 border-t-yellow bg-paper p-6 transition-colors duration-200 hover:border-ink/30 hover:border-t-yellow"
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="eyebrow text-petrol/70">
            {categoryLabels[service.category]}
          </span>
          {typeof index === 'number' && (
            <span className="font-display text-sm text-ink/30">
              {String(index).padStart(2, '0')}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-ink">
          {service.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          {service.summary}
        </p>
      </div>
      <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-petrol">
        View scope
        <span aria-hidden="true">&rarr;</span>
      </span>
    </Link>
  )
}
