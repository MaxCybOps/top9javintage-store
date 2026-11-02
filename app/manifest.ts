import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Top9javintage', short_name: 'Top9ja', description: 'Curated vintage streetwear, fresh kicks, and everyday statement pieces. From Lagos to everywhere.',
    start_url: '/', display: 'standalone', background_color: '#fcfcfa', theme_color: '#24251f',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
