import type { NextConfig } from "next";

import { getSecurityHeaders } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  cacheComponents: true,
  headers: getSecurityHeaders(),
  reactCompiler: true,
};

export default nextConfig;
