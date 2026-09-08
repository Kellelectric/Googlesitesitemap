import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { industries } from '@/content/industries'
import { pageMetadata } from '@/lib/metadata'
import { StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Industries We Serve',
  description:
    'Electrical engineering for residential, commercial, industrial, hospitality, education, healthcare, and retail properties across Abuja.',
  path: '/industries',
  image: '/images/photos/industries-hero-commercial-building.jpg',
})

export default function IndustriesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/industries-hero-commercial-building.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-16 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <span className="eyebrow text-yellow">Industries</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Built for what each property actually demands
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            A home, an office, a factory floor, and a hotel kitchen fail
            differently when the power goes. We size and specify for the
            property in front of us, not a generic template.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {industries.map((industry) => (
              <MotionDiv key={industry.slug} variants={staggerItem}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden border border-ink/10"
                >
                  <Image
                    src={industry.heroImage}
                    alt=""
                    fill
                    quality={65}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-[2px] w-0 bg-yellow transition-[width] duration-300 group-hover:w-full" />
                  <div className="relative p-8">
                    <h2 className="text-2xl font-semibold text-paper">
                      {industry.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-paper/75">
                      {industry.summary}
                    </p>
                    <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-yellow">
                      View services
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <WhyChooseUs heading="One certified team, engineered for every property type" />

      <CTASection />
    </>
  )
}
