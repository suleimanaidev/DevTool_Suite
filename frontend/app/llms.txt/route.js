import { HOME_FAQ, SITE, TOOL_SEO, url } from "../../lib/seo";

// Served at /llms.txt - a plain-text summary of the site for AI assistants (GEO).
export const dynamic = "force-static";

export function GET() {
  const lines = [];
  lines.push(`# ${SITE.name}`, "");
  lines.push(`> ${SITE.description}`, "");
  lines.push(
    "DevTools Suite is a free website with ten browser-based tools. No account is needed. Typing scores, Markdown text, invoice data, word counter drafts and calculator history are stored only in the user's own browser. Images, CSV text and QR content are processed locally and never uploaded.",
    ""
  );

  lines.push("## Tools", "");
  for (const t of Object.values(TOOL_SEO)) {
    lines.push(`- [${t.name}](${url(t.path)}): ${t.description}`);
  }
  lines.push("");

  for (const t of Object.values(TOOL_SEO)) {
    lines.push(`## ${t.name}`, "", t.about, "");
    lines.push("Key features:");
    t.features.forEach((f) => lines.push(`- ${f}`));
    lines.push("", "Questions and answers:");
    t.faq.forEach((f) => lines.push(`- Q: ${f.q}`, `  A: ${f.a}`));
    lines.push("");
  }

  lines.push("## General questions", "");
  HOME_FAQ.forEach((f) => lines.push(`- Q: ${f.q}`, `  A: ${f.a}`));
  lines.push("", "## Sitemap", "", `- ${url("/sitemap.xml")}`, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
