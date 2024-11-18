/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i1.sndcdn.com",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@mongoose"],
  },
};

export default nextConfig;
