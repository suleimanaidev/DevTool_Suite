"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ToolIcon from "./ToolIcon";

// Parent: tells the children to animate one after another.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Each card fades in while sliding up.
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ToolCards({ tools }) {
  return (
    <motion.section className="tool-grid" variants={container} initial="hidden" animate="show">
      {tools.map((tool) => (
        <motion.article key={tool.href} className="tool-card-shell" variants={item} whileHover={{ y: -5 }}>
          <Link href={tool.href} className="card tool-card" aria-label={`Open ${tool.title}`}>
            <div className="tool-icon">
              <ToolIcon name={tool.icon} size={20} />
            </div>
            <h2>{tool.title}</h2>
            <ul className="feature-list">
              {tool.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="tool-footer">
              <span className="muted">Build time: {tool.time}</span>
              <span className="btn btn-primary btn-sm" aria-hidden="true">
                Open
              </span>
            </div>
          </Link>
        </motion.article>
      ))}
    </motion.section>
  );
}
