import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { BookingForm } from '@/components/booking/BookingForm'

type Props = { params: { service: string }; searchParams: { leadId?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await db.service.findUnique({ where: { slug: params.service } })
  return { title: service ? `Book ${service.name}` : 'Book a Service' }
}

export default async function BookServicePage({ params, searchParams }: Props) {
  const service = await db.service.findUnique({ where: { slug: params.service } })
  if (!service || !service.active || !service.bookable) notFound()

  return (
    <section className="container-content py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow text-petrol">Book a Service</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{service.name}</h1>
        <p className="mt-3 text-ink/60">{service.description}</p>

        <div className="mt-10">
          <BookingForm
            service={{
              slug: service.slug,
              name: service.name,
              description: service.description,
              included: service.included,
              priceFromNgn: service.priceFromNgn,
              inspectionFeeNgn: service.inspectionFeeNgn,
              durationMinutes: service.durationMinutes,
            }}
            leadId={searchParams.leadId}
          />
        </div>
      </div>
    </section>
  )
}
