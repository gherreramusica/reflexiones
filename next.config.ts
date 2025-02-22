import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = {
        formidable: "commonjs formidable",
        "mongodb-client-encryption": "commonjs mongodb-client-encryption",
        kerberos: "commonjs kerberos",
      };

      // 🚀 Permite módulos de Node.js en Webpack 5
      config.resolve.fallback = {
        async_hooks: false, // Evita error con "node:async_hooks"
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default nextConfig;
