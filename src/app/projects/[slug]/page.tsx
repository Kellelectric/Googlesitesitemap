import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { getProjectBySlug, projects, sectorLabels } from '@/content/projects'
import { getServiceBySlug } from '@/content/services'
import { company } from '@/content/company'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

// See src/content/projects.ts: placeholder case study, invented at the
// client's explicit request, pending their review — keep noIndex on.
export function generateMetadata({ params }: Props): Metadata {
  const project = getProjectBySlug(params.slug)
  if (!project) return {}
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.image,
    noIndex: true,
  })
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const relatedServices = project.serviceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service))

  const otherProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'Projects', url: `${company.domain}/projects` },
              { name: project.title, url: `${company.domain}/projects/${project.slug}` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src={project.image}
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/95 to-petrol/60" />
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <nav className="eyebrow flex gap-2 text-paper/60" aria-label="Breadcrumb">
            <Link href="/projects" className="hover:text-paper">
              Projects
            </Link>
            <span>/</span>
            <span className="text-paper/80">{project.title}</span>
          </nav>
          <span className="eyebrow mt-6 block text-yellow">
            {sectorLabels[project.sector]} &middot; {project.location}
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">{project.summary}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <Reveal>
              <span className="eyebrow text-petrol/70">The challenge</span>
              <p className="mt-3 text-base leading-relaxed text-ink/80">
                {project.challenge}
              </p>
            </Reveal>
            <Reveal>
              <span className="eyebrow text-petrol/70">Our solution</span>
              <p className="mt-3 text-base leading-relaxed text-ink/80">
                {project.solution}
              </p>
            </Reveal>
            <Reveal>
              <span className="eyebrow text-petrol/70">The outcome</span>
              <p className="mt-3 text-base leading-relaxed text-ink/80">
                {project.outcome}
              </p>
            </Reveal>
          </div>

          <div>
            <span className="eyebrow text-petrol/70">Services used</span>
            <StaggerGroup className="mt-4 space-y-3">
              {relatedServices.map((service) => (
                <MotionDiv key={service.slug} variants={staggerItem}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="link-underline block border border-ink/10 p-4 text-sm font-medium text-ink hover:border-petrol"
                  >
                    {service.name}
                  </Link>
                </MotionDiv>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      <section className="bg-petrol-700 py-20 text-paper">
        <div className="container-content">
          <Reveal>
            <span className="eyebrow text-yellow">More projects</span>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {otherProjects.map((other) => (
              <MotionDiv key={other.slug} variants={staggerItem}>
                <Link
                  href={`/projects/${other.slug}`}
                  className="link-underline block border border-paper/15 p-5 text-sm font-medium text-paper hover:border-yellow"
                >
                  {other.title}
                </Link>
              </MotionDiv>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection
        heading="Have a similar job in mind?"
        body="Tell us the details and we'll respond with a scoped assessment."
        serviceSlug={relatedServices[0]?.slug}
      />
    </>
  )
}
