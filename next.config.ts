import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dramabox.sansekai.my.id/api/dramabox/:path*',
      },
    ];
  },
};

export default nextConfig;
