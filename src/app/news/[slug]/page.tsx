import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { getNewsBySlug, news } from '@/content/news'
import { getServiceBySlug } from '@/content/services'
import { getProjectBySlug } from '@/content/projects'
import { company } from '@/content/company'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return news.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const post = getNewsBySlug(params.slug)
  if (!post) return {}
  return pageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.summary,
    path: `/news/${post.slug}`,
    image: post.image,
  })
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function NewsDetailPage(props: Props) {
  const params = await props.params
  const post = getNewsBySlug(params.slug)
  if (!post) notFound()

  const related = news.filter((n) => n.slug !== post.slug).slice(0, 2)
  const relatedServices = (post.relatedServiceSlugs ?? [])
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service))
  const relatedProject = post.relatedProjectSlug ? getProjectBySlug(post.relatedProjectSlug) : undefined

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogPostingSchema({
              title: post.title,
              summary: post.summary,
              slug: post.slug,
              datePublished: post.date,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: company.domain },
              { name: 'News', url: `${company.domain}/news` },
              { name: post.title, url: `${company.domain}/news/${post.slug}` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src={post.image}
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
          <nav className="eyebrow flex gap-2 text-paper/60" aria-label="Breadcrumb">
            <Link href="/news" className="hover:text-paper">
              News
            </Link>
            <span>/</span>
            <span className="text-paper/80">{post.title}</span>
          </nav>

          <div className="mt-6 flex items-center gap-2">
            <span className="eyebrow text-yellow">{post.category}</span>
            <span aria-hidden="true" className="text-paper/50">&middot;</span>
            <time dateTime={post.date} className="eyebrow text-paper/60">
              {formatDate(post.date)}
            </time>
          </div>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">{post.summary}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="space-y-12 md:col-span-2">
            {post.sections.map((section) => (
              <Reveal key={section.heading}>
                <h2 className="text-2xl font-semibold text-ink">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="leading-relaxed text-ink/75">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <aside>
            {relatedProject && (
              <div className="border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">Full case study</span>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {relatedProject.title}
                </p>
                <Link
                  href={`/projects/${relatedProject.slug}`}
                  className="link-underline mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-petrol"
                >
                  View project
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}

            {relatedServices.length > 0 && (
              <div className="mt-8 border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">Related services</span>
                <ul className="mt-4 space-y-3">
                  {relatedServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="link-underline text-sm font-medium text-ink"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 border border-ink/10 p-6">
              <span className="eyebrow text-petrol/70">Have a job like this?</span>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                We run the same assessment process on site before quoting.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Button href="/contact" variant="primary" className="w-full">
                  Request a Quote
                </Button>
                <Button
                  href={company.phoneHref}
                  variant="secondary"
                  data-on-light="true"
                  className="w-full"
                >
                  Call {company.phone}
                </Button>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-8 border border-ink/10 p-6">
                <span className="eyebrow text-petrol/70">More updates</span>
                <ul className="mt-4 space-y-3">
                  {related.map((n) => (
                    <li key={n.slug}>
                      <Link
                        href={`/news/${n.slug}`}
                        className="link-underline text-sm font-medium text-ink"
                      >
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  )
}
