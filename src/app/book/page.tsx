import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatNaira } from '@/config/business'

export const metadata: Metadata = {
  title: 'Book a Service',
  description: 'Already know what you need? Book a service directly — inspection, fault diagnosis, solar assessment, maintenance, or a consultation.',
}

// Service pricing/availability is admin-editable at runtime (see
// /admin/services) — this must never be baked in as static build-time
// output, and must not fail the build if a database isn't reachable at
// build time (e.g. a fresh Vercel deploy before DATABASE_URL is set).
export const dynamic = 'force-dynamic'

export default async function BookPage() {
  const services = await db.service.findMany({
    where: { active: true, bookable: true },
    orderBy: { sortOrder: 'asc' },
    include: { category: true },
  })

  return (
    <section className="container-content py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow text-petrol">Book a Service</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Already know what you need?
        </h1>
        <p className="mt-4 text-ink/60">
          Choose a service below to book a date and time directly. Not sure which service is right?{' '}
          <Link href="/assessment" className="link-underline text-petrol">
            Take the 2-minute assessment
          </Link>{' '}
          instead and we’ll recommend one for you.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/book/${service.slug}`}
            className="group rounded border border-ink/10 bg-white p-6 transition-colors hover:border-petrol/40 hover:bg-petrol/5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">{service.category.name}</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-ink group-hover:text-petrol">{service.name}</h2>
            <p className="mt-2 text-sm text-ink/60 line-clamp-2">{service.description}</p>
            <p className="mt-4 text-sm font-semibold text-petrol">
              From {formatNaira(service.inspectionFeeNgn ?? service.priceFromNgn)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
