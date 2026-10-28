// A list of questions and short, direct answers (good for answer engines and featured snippets).
export default function Faq({ items }) {
  return (
    <div className="faq-list">
      {items.map((f) => (
        <details key={f.q} className="faq-item">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
