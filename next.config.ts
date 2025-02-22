import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = {
        formidable: "commonjs formidable",
        "mongodb-client-encryption": "commonjs mongodb-client-encryption", // Evita error con MongoDB Encryption
        kerberos: "commonjs kerberos", // 🚀 Evita error con Kerberos
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

