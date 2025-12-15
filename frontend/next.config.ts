import type { NextConfig } from "next";

const defaultApiUrl = "http://localhost:8000/api/v1";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl;

const remotePatterns = (() => {
  try {
    const url = new URL(apiUrl);
    const pattern = {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
    };
    return [pattern];
  } catch {
    return [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
    ];
  }
})();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;
