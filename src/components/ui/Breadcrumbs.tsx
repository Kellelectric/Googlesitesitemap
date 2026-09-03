import Link from 'next/link'

// Visible on-page breadcrumb trail, paired with the BreadcrumbList JSON-LD
// each page already emits via lib/schema.ts's breadcrumbSchema() - that
// schema is for search engines, this is for the visitor. Pass the same
// items to both so they never drift apart. The last item (current page)
// has no href and renders as plain text, not a link.
export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  // Dark hero sections need light/translucent text; light sections need
  // the standard ink tones. Defaults to dark since most heroes on this
  // site are the petrol/paper-text pattern.
  dark?: boolean
}

export function Breadcrumbs({ items, dark = true }: BreadcrumbsProps) {
  const linkColor = dark
    ? 'text-paper/60 hover:text-paper'
    : 'text-ink/60 hover:text-ink'
  const currentColor = dark ? 'text-paper/90' : 'text-ink/90'
  const separatorColor = dark ? 'text-paper/30' : 'text-ink/30'

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
              {i > 0 && <span className={separatorColor}>/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className={`link-underline transition-colors ${linkColor}`}>
                  {item.label}
                </Link>
              ) : (
                <span className={currentColor} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
