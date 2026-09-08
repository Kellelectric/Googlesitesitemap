import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { news } from '@/content/news'
import { pageMetadata } from '@/lib/metadata'
import { StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'News & Updates',
  description:
    'Project spotlights and seasonal advisories from Kell Electricals Ltd, a COREN and NEMSA certified team in Abuja.',
  path: '/news',
  image: '/images/photos/about-blueprint-review.jpg',
})

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function NewsPage() {
  const sorted = [...news].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/about-blueprint-review.jpg"
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
          <span className="eyebrow text-yellow">News & Updates</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Project spotlights and seasonal advisories
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            Shorter, dated posts from the same team doing the sizing,
            testing, and compliance work on site - see{' '}
            <Link href="/resources" className="link-underline font-semibold">
              Resources
            </Link>{' '}
            for the evergreen technical guides.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sorted.map((post) => (
              <MotionDiv key={post.slug} variants={staggerItem}>
                <Link
                  href={`/news/${post.slug}`}
                  className="group relative flex h-full min-h-[20rem] flex-col justify-end overflow-hidden border border-ink/10"
                >
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    quality={65}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-2 text-yellow">
                      <span className="eyebrow">{post.category}</span>
                      <span aria-hidden="true">&middot;</span>
                      <time dateTime={post.date} className="eyebrow text-paper/60">
                        {formatDate(post.date)}
                      </time>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-paper">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-paper/75">
                      {post.summary}
                    </p>
                    <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-yellow">
                      Read more
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
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
