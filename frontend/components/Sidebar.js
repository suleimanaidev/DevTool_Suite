"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ToolIcon from "./ToolIcon";

const NAV_GROUPS = [
  {
    label: "Text & Writing",
    links: [
      { href: "/typing-test", label: "Typing Test", icon: "typing-test" },
      { href: "/markdown", label: "Markdown", icon: "markdown" },
      { href: "/word-counter", label: "Word Counter", icon: "word-counter" },
    ],
  },
  {
    label: "Time",
    links: [
      { href: "/stopwatch", label: "Stopwatch", icon: "stopwatch" },
      { href: "/countdown", label: "Countdown", icon: "countdown" },
    ],
  },
  {
    label: "Files & Data",
    links: [
      { href: "/invoice", label: "Invoice", icon: "invoice" },
      { href: "/image-metadata", label: "Image Metadata", icon: "image-metadata" },
      { href: "/csv-to-json", label: "CSV → JSON", icon: "csv-to-json" },
      { href: "/qr-code", label: "QR Code", icon: "qr-code" },
    ],
  },
  {
    label: "Utilities",
    links: [{ href: "/calculator", label: "Calculator", icon: "calculator" }],
  },
];

// Left sidebar with collapsible tool categories. On small screens it becomes a bar
// with a "Tools" button that opens the same menu.
export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeGroup = NAV_GROUPS.find((group) => group.links.some((link) => link.href === pathname))?.label;
  const [openGroups, setOpenGroups] = useState(() => (activeGroup ? { [activeGroup]: true } : {}));

  // Close the mobile menu and reveal the category that owns the current page.
  useEffect(() => {
    setOpen(false);
    setOpenGroups(activeGroup ? { [activeGroup]: true } : {});
  }, [pathname, activeGroup]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function toggleGroup(label) {
    setOpenGroups((current) => ({ ...current, [label]: !current[label] }));
  }

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <span className="brand-logo">&lt;/&gt;</span>
        <span>DevTools Suite</span>
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="tool-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span>Tools</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <nav id="tool-nav" className={`nav-links ${open ? "open" : ""}`} aria-label="Tools">
        {NAV_GROUPS.map((group, index) => {
          const groupOpen = Boolean(openGroups[group.label]);
          const hasActive = group.links.some((link) => link.href === pathname);
          return (
            <div className="nav-group" key={group.label}>
              <button
                type="button"
                className={`nav-group-toggle ${hasActive ? "has-active" : ""}`}
                aria-expanded={groupOpen}
                aria-controls={`nav-group-${index}`}
                onClick={() => toggleGroup(group.label)}
              >
                <span>{group.label}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {groupOpen && (
                <div className="nav-group-links" id={`nav-group-${index}`}>
                  {group.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link key={link.href} href={link.href} className={`nav-link ${active ? "active" : ""}`}>
                        {/* The colored pill glides between links */}
                        {active && (
                          <motion.div
                            layoutId="nav-pill"
                            className="nav-bg"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                        <span className="nav-icon">
                          <ToolIcon name={link.icon} size={18} />
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer muted">Free online dev tools</div>
    </aside>
  );
}
