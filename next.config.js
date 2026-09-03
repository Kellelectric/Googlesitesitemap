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
      // on the new site, so only /home needs a redirect.
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
    ]
  },
}

module.exports = nextConfig
