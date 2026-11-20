import type { NextConfig } from "next";

/**
 * No GitHub Pages o site fica em https://<usuario>.github.io/<repositorio>/,
 * então o basePath é derivado do nome do repositório durante o deploy.
 * Para domínio próprio, defina CUSTOM_DOMAIN=1 no workflow (basePath vazio).
 */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const usaBasePath =
  process.env.GITHUB_ACTIONS === "true" && !process.env.CUSTOM_DOMAIN && repo && !repo.endsWith(".github.io");
const basePath = usaBasePath ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
