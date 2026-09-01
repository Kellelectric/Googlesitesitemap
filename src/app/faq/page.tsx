import type { Metadata } from 'next'
import Image from 'next/image'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { company } from '@/content/company'
import { faqCategories } from '@/content/faqs'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers on service areas, business hours, licensing, emergency response, and how we scope a job — from a COREN and NEMSA certified team in Abuja.',
  path: '/faq',
  image: '/images/photos/faq-hero-inspection.jpg',
})

export default function FAQPage() {
  const allItems = faqCategories.flatMap((c) => c.items)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(allItems.map((item) => ({ question: item.question, answer: item.answer }))),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'FAQ', url: `${company.domain}/faq` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/faq-hero-inspection.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[55%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">FAQ</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Service areas, licensing, hours, and how a job actually gets
            scoped. Anything not covered here, ask us directly.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content max-w-3xl space-y-16">
          {faqCategories.map((cat) => (
            <div key={cat.category}>
              <Reveal>
                <span className="eyebrow text-petrol/70">{cat.category}</span>
              </Reveal>
              <StaggerGroup className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
                {cat.items.map((item) => (
                  <MotionDiv key={item.question} variants={staggerItem} className="py-6">
                    <h2 className="text-lg font-semibold text-ink">{item.question}</h2>
                    <p className="mt-3 leading-relaxed text-ink/70">{item.answer}</p>
                  </MotionDiv>
                ))}
              </StaggerGroup>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  )
}
