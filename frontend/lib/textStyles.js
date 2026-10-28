// Unicode "fancy text" generator (like yaytext.com/bold-italic).
// The styled letters come from Unicode's Mathematical Alphanumeric Symbols block,
// so they keep their look when pasted anywhere (no HTML or CSS needed).

// Build a converter from the first code point of A, a and 0 in a style.
function makeStyle(upper, lower, digit, exceptions = {}) {
  return (ch) => {
    if (exceptions[ch]) return exceptions[ch];
    const code = ch.codePointAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(upper + code - 65); // A-Z
    if (code >= 97 && code <= 122) return String.fromCodePoint(lower + code - 97); // a-z
    if (digit && code >= 48 && code <= 57) return String.fromCodePoint(digit + code - 48); // 0-9
    return ch; // anything else stays the same
  };
}

const plain = (ch) => ch;
const boldSerif = makeStyle(0x1d400, 0x1d41a, 0x1d7ce);
const italicSerif = makeStyle(0x1d434, 0x1d44e, 0, { h: "\u210e" }); // italic "h" lives elsewhere in Unicode
const boldItalicSerif = makeStyle(0x1d468, 0x1d482, 0x1d7ce);
const boldSans = makeStyle(0x1d5d4, 0x1d5ee, 0x1d7ec);
const italicSans = makeStyle(0x1d608, 0x1d622, 0);
const boldItalicSans = makeStyle(0x1d63c, 0x1d656, 0x1d7ec);

// Convert text with one style for every character.
const convert = (style) => (text) => Array.from(text).map(style).join("");

// Alternate between two styles on every LETTER (spaces and symbols don't count).
function alternate(styleA, styleB) {
  return (text) => {
    let letters = 0;
    return Array.from(text)
      .map((ch) => {
        if (!/[A-Za-z]/.test(ch)) return styleA(ch);
        return letters++ % 2 === 0 ? styleA(ch) : styleB(ch);
      })
      .join("");
  };
}

export const TEXT_STYLES = [
  { id: "bold-serif", label: "Bold (serif)", convert: convert(boldSerif) },
  { id: "italic-serif", label: "Italic (serif)", convert: convert(italicSerif) },
  { id: "bold-italic-serif", label: "Bold / italic (serif)", convert: convert(boldItalicSerif) },
  { id: "bold-sans", label: "Bold (sans)", convert: convert(boldSans) },
  { id: "italic-sans", label: "Italic (sans)", convert: convert(italicSans) },
  { id: "bold-italic-sans", label: "Bold / italic (sans)", convert: convert(boldItalicSans) },
  { id: "alt-bold", label: "Alternating bold", convert: alternate(boldSerif, plain) },
  { id: "alt-italic", label: "Alternating italic", convert: alternate(italicSerif, plain) },
  { id: "bold-alt-italic", label: "Bold with alternating italic", convert: alternate(boldSerif, boldItalicSerif) },
  { id: "italic-switch", label: "Italic switch serifs", convert: alternate(italicSerif, italicSans) },
];
