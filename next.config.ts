import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: false, // 🔹 Si usas Pages Router (`pages/`), desactiva App Router
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = {
        formidable: "commonjs formidable",
        "mongodb-client-encryption": "commonjs mongodb-client-encryption",
        kerberos: "commonjs kerberos",
      };

      // 🚀 Permite módulos de Node.js en Webpack 5
      config.resolve.fallback = {
        async_hooks: false, // 🔹 Evita error con "node:async_hooks"
        crypto: false, // 🔹 Evita error con `crypto`
        fs: false, // 🔹 Evita error con `fs`
      };

      // 🔹 Evita errores con `react-dom/server.edge`
      config.resolve.alias = {
        "react-dom/server": "react-dom/server.browser",
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
