// A tiny hand-written Markdown -> HTML converter (no libraries).
//
// Safety: the WHOLE input is HTML-escaped first, so users cannot inject tags
// or scripts. Only the HTML that we generate ourselves ends up in the output.
// Links/images are only allowed to use http, https (and mailto for links).

// Step 1: turn & < > " ' into harmless text.
export function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isSafeLink = (url) => /^(https?:\/\/|mailto:)/i.test(url);
const isSafeImage = (url) => /^https?:\/\//i.test(url);

// Inline formatting (bold, italic, code, links...). Input is ALREADY escaped.
function parseInline(text) {
  // Finished pieces of HTML are parked here and replaced by a placeholder,
  // so later rules (like italic) cannot damage them.
  const stash = [];
  const keep = (html) => {
    stash.push(html);
    return `\u0000${stash.length - 1}\u0000`;
  };

  // Inline code: `code`
  text = text.replace(/`([^`]+)`/g, (_, code) => keep(`<code>${code}</code>`));

  // Images: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\(([^\s)]+)\)/g, (_, alt, url) =>
    isSafeImage(url) ? keep(`<img src="${url}" alt="${alt}" />`) : alt
  );

  // Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, label, url) =>
    isSafeLink(url)
      ? keep(`<a href="${url}" target="_blank" rel="noopener noreferrer">${parseEmphasis(label)}</a>`)
      : label
  );

  text = parseEmphasis(text);

  // Put the parked HTML back (loop, because pieces can contain placeholders).
  while (/\u0000\d+\u0000/.test(text)) {
    text = text.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[Number(i)]);
  }
  return text;
}

// Bold, italic and strikethrough.
function parseEmphasis(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/(^|[^\w])_(.+?)_(?=[^\w]|$)/g, "$1<em>$2</em>");
}

// Block level parsing: works on escaped text, one line at a time.
function parseBlocks(escaped) {
  const lines = escaped.split("\n");
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block ``` ... ```
    if (/^\s*```/.test(line)) {
      const code = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
      i++; // skip the closing fence
      html.push(`<pre><code>${code.join("\n")}</code></pre>`);
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Heading: # to ######
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${parseInline(heading[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule: --- or *** or ___
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      html.push("<hr />");
      i++;
      continue;
    }

    // Blockquote: lines starting with > (shown as &gt; after escaping)
    if (/^\s*&gt;/.test(line)) {
      const quote = [];
      while (i < lines.length && /^\s*&gt;/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*&gt;\s?/, ""));
        i++;
      }
      html.push(`<blockquote>${parseBlocks(quote.join("\n"))}</blockquote>`);
      continue;
    }

    // Unordered list: - item, * item, + item
    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(`<li>${parseInline(lines[i].replace(/^\s*[-*+]\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Ordered list: 1. item
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${parseInline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // Paragraph: keep reading until a blank line or another block starts
    const para = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6}\s|\s*```|\s*&gt;|\s*[-*+]\s+|\s*\d+\.\s+)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    html.push(`<p>${para.map(parseInline).join("<br />\n")}</p>`);
  }

  return html.join("\n");
}

// Public function: Markdown string in, safe HTML string out.
export function markdownToHtml(markdown) {
  const normalized = markdown.replace(/\r\n?/g, "\n");
  return parseBlocks(escapeHtml(normalized));
}
