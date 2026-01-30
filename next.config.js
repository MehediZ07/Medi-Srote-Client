/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://medi-store-backend-sigma.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;