import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [],
    unoptimized: true,
  },
};

export default config;
