/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Legacy Google Sites paths (from the old sitemap9.xml) — preserves
      // any existing SEO equity once kellelectricals.com points here.
      // /about, /services, and /contact already match 1:1 on the new site,
      // so only the paths that actually changed need a redirect.
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        // No real /testimonials page exists yet (no verbatim quotes have
        // been provided — see docs/next-steps.md). Redirecting to home for
        // now; point this at /testimonials once that page is built.
        source: '/testimonials',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
