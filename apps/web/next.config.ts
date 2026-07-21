import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @rewire/core ships raw TypeScript source; Next must transpile it.
  transpilePackages: ["@rewire/core"],
};

export default nextConfig;
