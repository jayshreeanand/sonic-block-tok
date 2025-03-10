/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.mixkit.co'],
  },
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 