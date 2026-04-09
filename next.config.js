/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/api/:path*',
          destination: 'https://medi-store-backend-sigma.vercel.app/api/:path*',
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;