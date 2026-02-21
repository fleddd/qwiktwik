import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/database", "@repo/validation"],
};

export default nextConfig;
