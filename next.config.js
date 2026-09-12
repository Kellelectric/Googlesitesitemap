const { withSentryConfig } = require('@sentry/nextjs/config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Applies to every route. No iframe embedding, third-party
        // camera/mic/location access, or cross-origin framing is needed
        // anywhere on this site.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        // Pinned explicitly rather than relying on Vercel's implicit
        // default for public/ assets. Photos in public/images get
        // swapped in place (same filename, new bytes) fairly often on
        // this site — must-revalidate forces every client and the CDN
        // edge to check back with the origin on every request via the
        // ETag, so a swapped photo is never stuck showing stale bytes
        // to a returning visitor. Do not change this to a positive
        // max-age/immutable without also switching to content-hashed
        // filenames, or photo swaps will silently not show up for
        // anyone with a cached copy until their cache naturally expires.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
    ]
  },
  async redirects() {
    return [
      // Legacy Google Sites paths (from the old sitemap9.xml) — preserves
      // any existing SEO equity once kellelectricals.com points here.
      // /about, /services, /contact, and /testimonials already match 1:1
      // on the new site, so only /home needs a redirect. Destination is
      // deliberately relative ('/'), not an absolute URL: Next.js 16
      // silently collapses a fully static absolute destination targeting
      // the bare root back down to a relative Location header (confirmed
      // via a spoofed-Host test locally - the identical absolute-URL
      // pattern works fine everywhere else in this file because those
      // destinations use a dynamic `:path*` segment, not a static root).
      // A relative destination here still reaches the correct canonical
      // URL - www.kellelectricals.com/home takes one extra hop through
      // Vercel's own www->non-www edge redirect first, which is a normal,
      // Google-tolerated short chain, not worth working around with a
      // fragile absolute-URL trick for a bare root path.
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Canonical-domain consolidation: www.kellelectricals.com must not
      // serve a second copy of the site. Host-matched so this only fires
      // when a request actually arrives on the www host, preserving the
      // pathname/query string. This is a code-level backstop; it only
      // takes effect once www.kellelectricals.com is actually pointed at
      // this same Vercel project (see docs/next-steps.md's domain-
      // attachment note - the real domain isn't attached yet). Vercel's
      // own dashboard redirect (Settings -> Domains -> mark kellelectricals.com
      // primary) also produces this behavior once both hosts are added
      // there, so this rule is what fires if that Vercel-level setting is
      // ever off or reset.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.kellelectricals.com' }],
        destination: 'https://kellelectricals.com/:path*',
        permanent: true,
      },
      // Same consolidation, for Vercel's own auto-generated project domain.
      // googlesitesitemap.vercel.app serves the identical production build
      // (it's the bare project alias, not a password/SSO-gated preview -
      // those are already inaccessible without a Vercel login) and, unlike
      // the preview aliases, has been publicly crawlable since the project
      // was first created — well before kellelectricals.com was attached
      // and confirmed as primary. Google's Search Console flagged exactly
      // this: it started treating this URL as the canonical for the
      // homepage, /contact, and /testimonials instead of the declared
      // kellelectricals.com canonical, despite this domain's own <link
      // rel="canonical"> tag already correctly pointing at
      // kellelectricals.com. A redirect removes the duplicate outright
      // instead of relying on Google to honor a canonical tag it has
      // already shown it will override.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'googlesitesitemap.vercel.app' }],
        destination: 'https://kellelectricals.com/:path*',
        permanent: true,
      },
    ]
  },
}

// Wraps every build (source map upload, tunneling, etc.) - safe to leave
// unconditional: withSentryConfig itself no-ops most of its behavior
// without SENTRY_AUTH_TOKEN/SENTRY_ORG/SENTRY_PROJECT set, same pattern as
// every other optional integration in this codebase. silent avoids noisy
// build logs (missing-auth-token warnings) until those are actually set.
module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  // Routes browser Sentry requests through this site's own domain
  // (/monitoring) rather than directly to ingest.sentry.io - avoids ad
  // blockers dropping client-side error reports, at the cost of this one
  // extra rewritten route. Disable if it ever conflicts with a real
  // /monitoring route.
  tunnelRoute: '/monitoring',
})
