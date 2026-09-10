import type { MetadataRoute } from 'next'
import { company } from '@/content/company'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: 'Kell Electricals',
    description: company.positioning,
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F0',
    theme_color: '#13322C',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
