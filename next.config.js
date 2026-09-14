const path = require("path");

// Force production environment during build even if deployment platform (Netlify) injects NODE_ENV=development
if (process.argv.some((arg) => arg.includes("build")) || process.env.NEXT_PHASE === "phase-production-build") {
  process.env.NODE_ENV = "production";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
