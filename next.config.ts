import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  // Disable Turbopack for production builds (Windows junction point issue with @prisma/client)
  // Use `next dev --turbopack` for fast local dev if desired
};

export default nextConfig;
