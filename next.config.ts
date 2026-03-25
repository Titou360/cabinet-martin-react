import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Windows junction point issue with @prisma/client and Turbopack
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
