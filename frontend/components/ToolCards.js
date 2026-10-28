"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Parent: tells the children to animate one after another.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// Each card fades in while sliding up.
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ToolCards({ tools }) {
  return (
    <motion.section className="tool-grid" variants={container} initial="hidden" animate="show">
      {tools.map((t) => (
        <motion.article
          key={t.href}
          className="card tool-card"
          variants={item}
          whileHover={{ y: -6 }}
        >
          <div className="tool-icon">{t.icon}</div>
          <h2>{t.title}</h2>
          <ul className="feature-list">
            {t.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="tool-footer">
            <span className="muted">Build time: {t.time}</span>
            <Link href={t.href} className="btn btn-primary btn-sm">
              Open
            </Link>
          </div>
        </motion.article>
      ))}
    </motion.section>
  );
}
