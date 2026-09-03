import Link from 'next/link'
import { FAQ } from '@/content/faqs'
import { faqSchema } from '@/lib/schema'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function FAQSection({ items, viewAllHref }: { items: FAQ[]; viewAllHref?: string }) {
  return (
    <section className="bg-paper py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(items.map((item) => ({ question: item.question, answer: item.answer }))),
          ),
        }}
      />
      <div className="container-content max-w-4xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-petrol/70">FAQ</span>
            <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              Common questions
            </h2>
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="link-underline text-sm font-semibold text-petrol">
              View all FAQs &rarr;
            </Link>
          )}
        </Reveal>

        {/* Question in a fixed left column, answer in the wider right column -
            a "spec sheet" split instead of a stacked accordion list, with a
            ghost numeral echoing the numbering device ServiceCard/ProcessSection
            already use elsewhere on the site. */}
        <StaggerGroup className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
          {items.map((item, i) => (
            <MotionDiv
              key={item.question}
              variants={staggerItem}
              className="grid grid-cols-1 gap-x-8 gap-y-3 py-8 md:grid-cols-[minmax(0,320px)_1fr]"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-2xl font-semibold leading-none text-petrol/15">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
              </div>
              <p className="leading-relaxed text-ink/70">{item.answer}</p>
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
