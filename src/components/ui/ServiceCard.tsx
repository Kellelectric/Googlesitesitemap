import Link from 'next/link'
import { Service, categoryLabels } from '@/content/services'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col justify-between border border-ink/10 bg-paper p-6 transition-colors duration-200 hover:border-yellow"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
      <div>
        <span className="eyebrow text-petrol/70">
          {categoryLabels[service.category]}
        </span>
        <h3 className="mt-3 text-xl font-semibold text-ink">
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
