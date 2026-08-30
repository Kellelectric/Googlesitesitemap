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
      // /about, /services, /contact, and /testimonials already match 1:1
      // on the new site, so only /home needs a redirect.
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
