/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/PeriodTrackerApp',
  assetPrefix: '/PeriodTrackerApp/',
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
}

export default nextConfig
