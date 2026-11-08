import { TOOL_SEO, url } from "../lib/seo";

// Required for `output: "export"` (Cloudflare Pages static export).
export const dynamic = "force-static";

// Served at /sitemap.xml - lists every page for search engines.
export default function sitemap() {
  const now = new Date();
  return [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/sitemap"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ...Object.values(TOOL_SEO).map((t) => ({
      url: url(t.path),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
