"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TEXT_STYLES } from "../lib/textStyles";

// Shows the editor text (or just the selected part) in many Unicode bold/italic styles.
// "source" is the text to convert. "onApply" puts a styled version back into the editor.
export default function StylePanel({ source, hasSelection, onApply, onCopyMessage }) {
  const [copiedId, setCopiedId] = useState("");

  async function copy(style, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(style.id);
      onCopyMessage(`${style.label} copied!`);
      setTimeout(() => setCopiedId(""), 1500);
    } catch {
      onCopyMessage("Copy failed - your browser blocked it.");
    }
  }

  return (
    <section className="style-panel">
      <div className="style-grid">
        {TEXT_STYLES.map((style, i) => {
          const output = style.convert(source || "Your text");
          return (
            <motion.div
              key={style.id}
              className="style-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="style-label">{style.label}</div>
              <div className="style-output">{output}</div>
              <div className="row">
                <button className="btn btn-sm btn-primary" onClick={() => copy(style, output)}>
                  {copiedId === style.id ? "Copied!" : "Copy"}
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => onApply(output)}
                  disabled={!hasSelection}
                  title={hasSelection ? "" : "Select text in the editor first"}
                >
                  Use in editor
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="muted" style={{ marginTop: "0.8rem" }}>
        These are special Unicode characters, not real Markdown. They look a little different in some apps.
      </p>
    </section>
  );
}
