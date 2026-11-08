/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site is fully static, so it is exported to `out/` and deployed to
  // Cloudflare Pages (no Node server needed).
  output: "export",
};

export default nextConfig;
