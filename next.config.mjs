/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       canvas: "./empty-module.ts",
  //     },
  //   },
  // },
};

export default nextConfig;
