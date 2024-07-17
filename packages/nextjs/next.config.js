// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  env: {
    // SIPPP_APP_KEY: '0x243d056548b2ed6b732f834fd3800a6cd838bc0bca1df7001d9afdb915d80739',
    SIPPP_APP_KEY: process.env.NEXT_PUBLIC_SIPPP_APP_KEY ?? "",
    // SIPPP_APP_KEY: '39ba82e1faefdb970761ace6a1fc72cd8f29b56db8545236a5ac74416549f232'
  },
};

module.exports = nextConfig;

// 0x3f15B8c6F9939879Cb030D6dd935348E57109637
// 0x3f15B8c6F9939879Cb030D6dd935348E57109637
