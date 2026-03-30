import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const jiraDashRoot = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo: evita que o Turbopack use o lockfile da raiz do opensquad. */
const nextConfig: NextConfig = {
  turbopack: {
    root: jiraDashRoot,
  },
};

export default nextConfig;
