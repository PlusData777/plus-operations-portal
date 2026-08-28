/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'grassrootsjusticenetwork.org',
      },
    ],
  },
};

export default nextConfig;
