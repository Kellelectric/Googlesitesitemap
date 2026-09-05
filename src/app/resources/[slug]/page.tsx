import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { getArticleBySlug, articles } from '@/content/resources'
import { getServiceBySlug } from '@/content/services'
import { company } from '@/content/company'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/metadata'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return pageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.summary,
    path: `/resources/${article.slug}`,
    image: '/images/photos/resource-detail-hero-manual.jpg',
  })
}

export default async function ArticleDetailPage(props: Props) {
  const params = await props.params;
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2)
  const relatedServices = article.relatedServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: article.title,
              summary: article.summary,
              slug: article.slug,
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
              { name: 'Resources', url: `${company.domain}/resources` },
              { name: article.title, url: `${company.domain}/resources/${article.slug}` },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden bg-petrol text-paper">
        <Image
          src="/images/photos/resource-detail-hero-manual.jpg"
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
            <Link href="/resources" className="hover:text-paper">
              Resources
            </Link>
            <span>/</span>
            <span className="text-paper/80">{article.title}</span>
          </nav>

          <span className="eyebrow mt-6 inline-block text-yellow">{article.category}</span>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-xl text-paper/70">{article.summary}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-content grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="space-y-12 md:col-span-2">
            {article.sections.map((section) => (
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
            {relatedServices.length > 0 && (
              <div className="border border-ink/10 p-6">
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
                <span className="eyebrow text-petrol/70">More guides</span>
                <ul className="mt-4 space-y-3">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/resources/${a.slug}`}
                        className="link-underline text-sm font-medium text-ink"
                      >
                        {a.title}
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
