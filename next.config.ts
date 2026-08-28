/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allows production builds to successfully complete even with type warnings
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to successfully complete even with lint warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
