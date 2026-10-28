import Link from "next/link";
import ToolCards from "../components/ToolCards";
import Faq from "../components/Faq";
import JsonLd from "../components/JsonLd";
import { HOME_FAQ, SITE, homeJsonLd } from "../lib/seo";
import "./landing.css";

// The eleven tool cards (plain, honest descriptions).
// Page title and description for search engines (the root layout adds the rest).
export const metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: "/" },
};

const TOOLS = [
  {
    icon: "⌨️",
    title: "Typing Speed Test",
    href: "/typing-test",
    time: "about 3 hours",
    features: [
      "Shows your speed, accuracy and mistakes as you type",
      "Pick 15, 30 or 60 seconds, or set your own time",
      "Add your own paragraphs and type them",
      "Remembers your best score",
    ],
  },
  {
    icon: "📝",
    title: "Markdown Editor",
    href: "/markdown",
    time: "about 4 hours",
    features: [
      "Write on the left, see the result on the right",
      "Turn words into bold, italic or bold-italic text you can paste anywhere",
      "Saves what you write automatically",
      "Counts your words and characters",
    ],
  },
  {
    icon: "🧾",
    title: "Invoice Maker",
    href: "/invoice",
    time: "about 8 hours",
    features: [
      "Fill in a short form, see the invoice update live",
      "Pick any color and one of three layouts",
      "Works with 7 currencies",
      "Save it as a PDF or keep it for later",
    ],
  },
  {
    icon: "⏱️",
    title: "Stopwatch",
    href: "/stopwatch",
    time: "about 1 hour",
    features: [
      "Start, pause and carry on",
      "Record lap times",
      "Shows your fastest and slowest lap",
    ],
  },
  {
    icon: "🔤",
    title: "Word Counter",
    href: "/word-counter",
    time: "about 1 hour",
    features: [
      "Counts words and characters as you type",
      "Shows reading time at a glance",
      "Also counts sentences and paragraphs",
      "Saves your text in this browser",
    ],
  },
  {
    icon: "⏳",
    title: "Countdown Timer",
    href: "/countdown",
    time: "about 2 hours",
    features: [
      "Set any time in hours, minutes and seconds",
      "Pick a quick preset from 1 to 60 minutes",
      "Pause, resume and start again",
      "Plays a sound when time is up",
    ],
  },
  {
    icon: "🧮",
    title: "Calculator",
    href: "/calculator",
    time: "about 2 hours",
    features: [
      "Add, subtract, multiply and divide",
      "Percent and negative-number keys",
      "Works with your keyboard",
      "Keeps a history you can reuse",
    ],
  },
  {
    icon: "🖼️",
    title: "Image Metadata Viewer",
    href: "/image-metadata",
    time: "about 2 hours",
    features: [
      "See camera, date and file details",
      "Find GPS location when it is saved",
      "Shows image dimensions and size",
      "Your photo is never uploaded",
    ],
  },
  {
    icon: "🎨",
    title: "Color Palette Extractor",
    href: "/color-palette",
    time: "about 3 hours",
    features: [
      "Pull dominant colors from an image",
      "Get HEX codes and RGB values",
      "Choose 3 to 12 colors",
      "Copy one color or the whole palette",
    ],
  },
  {
    icon: "🔄",
    title: "CSV to JSON",
    href: "/csv-to-json",
    time: "about 2 hours",
    features: [
      "Paste CSV or open a file",
      "Detects commas, semicolons and tabs",
      "First row as keys, or plain rows",
      "Copy or download the JSON",
    ],
  },
  {
    icon: "🔳",
    title: "QR Code Generator",
    href: "/qr-code",
    time: "about 1 hour",
    features: [
      "Make a QR code for a link or text",
      "Choose size, colors and error correction",
      "Download it as a PNG or SVG",
      "Updates as you type",
    ],
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="land-header">
        <Link href="/" className="brand">
          <span className="brand-logo">&lt;/&gt;</span>
          <span>DevTools Suite</span>
        </Link>
        <Link href="/typing-test" className="btn btn-sm">
          Open a tool
        </Link>
      </header>

      {/* Hero: left aligned, plain words */}
      <section className="land-hero">
        <p className="eyebrow">Simple online tools for everyday work</p>
        <h1>
          Everything you need for daily tasks, <span className="underline">in one place.</span>
        </h1>
        <p className="lead">
          Eleven small, focused tools for text, images, files and time. Measure your typing, write Markdown,
          make invoices, count words, set timers, run calculations, inspect photos, convert CSV to JSON,
          pull color palettes and create QR codes. Each tool is free, and none of them needs an account.
        </p>
        <div className="hero-buttons">
          <a href="#tools" className="btn btn-primary">
            See the tools
          </a>
          <Link href="/invoice" className="btn">
            Make an invoice
          </Link>
        </div>
      </section>

      <section id="tools" className="land-section">
        <h2 className="section-title">The tools</h2>
        <ToolCards tools={TOOLS} />
      </section>

      {/* Honest notes instead of marketing points */}
      <section className="land-section notes">
        <h2 className="section-title">Good to know</h2>
        <ul>
          <li>
            <strong>Your stuff stays on your device.</strong> Files, images and text you load are handled in your
            browser. Scores, notes, invoices, drafts, history and settings are saved locally. Nothing is uploaded.
          </li>
          <li>
            <strong>PDFs come from your browser.</strong> Press &quot;Download PDF&quot; on the invoice page and choose
            &quot;Save as PDF&quot; in the print window.
          </li>
          <li>
            <strong>How it&apos;s built.</strong> Next.js and plain CSS. The
            Markdown converter is written by hand, with no libraries.
          </li>
        </ul>
      </section>

      {/* Questions and short answers (also sent to search engines as FAQ data) */}
      <section className="land-section faq-section">
        <h2 className="section-title">Frequently asked questions</h2>
        <Faq items={HOME_FAQ} />
      </section>

      <JsonLd data={homeJsonLd()} />

      <footer className="land-footer">DevTools Suite. Simple, reliable tools for everyday work.</footer>
    </div>
  );
}
