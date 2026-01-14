/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "img.clerk.com" }
    ],
  },
};

export default nextConfig;
