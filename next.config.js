/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.mixkit.co'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 