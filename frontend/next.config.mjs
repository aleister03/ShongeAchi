/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-leaflet's map cleanup doesn't survive React Strict Mode's
  // deliberate dev-only mount→unmount→remount cycle — Leaflet sees a
  // stale _leaflet_id left on the container and throws "Map container is
  // already initialized." This only affects the dev double-render safety
  // check, not production behavior.
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
