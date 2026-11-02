/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.e2b.app'],
  images: { formats: ['image/webp'], deviceSizes: [360, 480, 640, 828, 1080, 1440, 1920] },
  poweredByHeader: false,
  devIndicators: false,
};
export default nextConfig;
