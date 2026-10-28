"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const LINKS = [
  { href: "/typing-test", label: "Typing Test", icon: "⌨️" },
  { href: "/markdown", label: "Markdown", icon: "📝" },
  { href: "/invoice", label: "Invoice", icon: "🧾" },
  { href: "/stopwatch", label: "Stopwatch", icon: "⏱️" },
  { href: "/word-counter", label: "Word Counter", icon: "🔤" },
  { href: "/countdown", label: "Countdown", icon: "⏳" },
  { href: "/calculator", label: "Calculator", icon: "🧮" },
  { href: "/image-metadata", label: "Image Metadata", icon: "🖼️" },
  { href: "/color-palette", label: "Color Palette", icon: "🎨" },
  { href: "/csv-to-json", label: "CSV → JSON", icon: "🔄" },
  { href: "/qr-code", label: "QR Code", icon: "🔳" },
];

// Left sidebar with all tools. On small screens it turns into a scrollable top bar.
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <span className="brand-logo">&lt;/&gt;</span>
        <span>DevTools Suite</span>
      </Link>

      <div className="sidebar-label">Tools</div>
      <nav className="nav-links">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} href={l.href} className={`nav-link ${active ? "active" : ""}`}>
              {/* The colored pill glides between links */}
              {active && <motion.div layoutId="nav-pill" className="nav-bg" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="nav-icon">{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer muted">Free online dev tools</div>
    </aside>
  );
}
