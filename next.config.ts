import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for production builds (Netlify edge function compatibility)
  experimental: {},
};

export default nextConfig;
