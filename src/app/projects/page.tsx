import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { projects, sectorLabels } from '@/content/projects'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export const metadata: Metadata = pageMetadata({
  title: 'Projects',
  description:
    'Recent electrical engineering projects across residential, commercial, and industrial properties in Abuja.',
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/hero-control-panel.jpg"
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
          <span className="eyebrow text-yellow">Projects</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            Recent work across Abuja
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">
            A sample of residential, commercial, and industrial jobs, from
            first assessment through handover.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content">
          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <MotionDiv key={project.slug} variants={staggerItem}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex h-full flex-col border border-ink/10 bg-paper transition-colors duration-200 hover:border-yellow"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      quality={60}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <span className="eyebrow text-petrol/70">
                        {sectorLabels[project.sector]} &middot; {project.location}
                      </span>
                      <h2 className="mt-3 text-lg font-semibold text-ink">
                        {project.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-ink/70">
                        {project.summary}
                      </p>
                    </div>
                    <span className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-petrol">
                      Read the case study
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
