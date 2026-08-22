/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:1078";
    return [
      {
        source: "/api/elders/:path*",
        destination: `${backendUrl}/api/elders/:path*`,
      },
      {
        source: "/api/wellbeing/:path*",
        destination: `${backendUrl}/api/wellbeing/:path*`,
      },
    ];
  },
};

export default nextConfig;
