import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { articles } from '@/content/resources'
import { pageMetadata } from '@/lib/metadata'
import { StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Resources & Technical Guides',
  description:
    'Technical guides on solar sizing, NEMSA compliance, electrical maintenance, security systems, and industrial power from a COREN and NEMSA certified engineering team in Abuja.',
  path: '/resources',
  image: '/images/photos/resources-hero-engineer-blueprint.jpg',
})

export default function ResourcesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/resources-hero-engineer-blueprint.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[55%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-16 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Resources</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Technical guides, not marketing copy
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Written by the same team that does the sizing, testing, and
            compliance work on site.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <MotionDiv key={article.slug} variants={staggerItem}>
                <Link
                  href={`/resources/${article.slug}`}
                  className="group relative flex h-full flex-col justify-between border border-ink/10 bg-paper p-6 transition-colors duration-200 hover:border-yellow"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
                  <div>
                    <span className="eyebrow text-petrol/70">{article.category}</span>
                    <h2 className="mt-3 text-xl font-semibold text-ink">
                      {article.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">
                      {article.summary}
                    </p>
                  </div>
                  <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-petrol">
                    Read guide
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection />
    </>
  )
}
