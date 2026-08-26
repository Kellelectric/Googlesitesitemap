import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { CTASection } from '@/components/sections/CTASection'
import { getArticleBySlug, articles } from '@/content/resources'
import { company } from '@/content/company'
import { breadcrumbSchema } from '@/lib/schema'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/resources/${article.slug}` },
  }
}

export default function ArticleDetailPage({ params }: Props) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2)

  return (
    <>
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
        <CircuitLines className="pointer-events-none absolute -right-24 -top-10 h-full w-1/2 text-paper/10" />
        <div className="container-content relative py-20">
          <nav className="eyebrow flex gap-2 text-paper/50" aria-label="Breadcrumb">
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
            <div className="border border-ink/10 p-6">
              <span className="eyebrow text-petrol/60">Have a job like this?</span>
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
                <span className="eyebrow text-petrol/60">More guides</span>
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
