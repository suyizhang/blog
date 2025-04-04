import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:7001/api/:path*',
      },
    ];
  },
  experimental: {},
};

export default config;
