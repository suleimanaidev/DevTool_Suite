import JsonLd from "./JsonLd";
import Faq from "./Faq";
import { TOOL_SEO, toolJsonLd } from "../lib/seo";

// Text content shown under every tool: what it is, how to use it, and a FAQ.
// This is real visible content, so it also matches the JSON-LD data below.
export default function ToolInfo({ slug }) {
  const t = TOOL_SEO[slug];

  return (
    <section className="tool-info no-print" aria-label={`About the ${t.name}`}>
      <h2>About the {t.name}</h2>
      <p>{t.about}</p>

      <div className="info-columns">
        <div>
          <h3>How to use it</h3>
          <ol>
            {t.steps.map((s) => (
              <li key={s.name}>
                <strong>{s.name}.</strong> {s.text}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Features</h3>
          <ul>
            {t.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2>Frequently asked questions</h2>
      <Faq items={t.faq} />

      <JsonLd data={toolJsonLd(slug)} />
    </section>
  );
}
