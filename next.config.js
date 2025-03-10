/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.mixkit.co', 'storage.googleapis.com', 'dfsncplzrz5f2.cloudfront.net'],
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