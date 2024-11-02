/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i1.sndcdn.com",
      },
    ],
  },
};

export default nextConfig;
