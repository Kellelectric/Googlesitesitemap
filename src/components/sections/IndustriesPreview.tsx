import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { industries } from '@/content/industries'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

// Full-bleed real photography per card (public/images/photos/industry-detail-hero-*.jpg -
// the same hero shots already used on each /industries/[slug] detail page, previously
// sitting unused on this homepage section) with a dark gradient overlay for text
// legibility, matching the same image+gradient language Hero.tsx and the /projects
// hero already use elsewhere on the site. Replaces the earlier icon+text bordered-box
// treatment, which read as flat and generic next to the real photography everywhere
// else on the homepage.
export function IndustriesPreview() {
  return (
    <section className="bg-petrol-700 py-24 text-paper">
      <div className="container-content">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-yellow">Who we serve</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
              Engineered for the property in front of us
            </h2>
          </div>
          <Button href="/industries" variant="secondary">
            View all industries
          </Button>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <MotionDiv key={industry.slug} variants={staggerItem}>
              <Link
                href={`/industries/${industry.slug}`}
                className="group relative block aspect-[4/5] w-full overflow-hidden border border-paper/15 hover:border-yellow"
              >
                <Image
                  src={`/images/photos/industry-detail-hero-${industry.slug}.jpg`}
                  alt=""
                  fill
                  quality={65}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-base font-semibold text-paper">{industry.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/75">{industry.summary}</p>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
