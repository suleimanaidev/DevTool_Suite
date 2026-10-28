"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { markdownToHtml } from "../../lib/markdown";
import Toast from "../../components/Toast";
import StylePanel from "../../components/StylePanel";
import "./markdown.css";

const SAMPLE = "# Hello Dev\n\nBuild faster\n\n- Learn Markdown";
const STORAGE_KEY = "markdown-text";

export default function MarkdownPage() {
  const [text, setText] = useState(SAMPLE);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("editor"); // mobile only
  const [message, setMessage] = useState("");
  const [sel, setSel] = useState({ start: 0, end: 0 }); // current selection in the editor

  const editorRef = useRef(null);
  const gutterRef = useRef(null);

  // Load the saved text (if any) on first render.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setText(saved);
    setLoaded(true);
  }, []);

  // Auto-save every change.
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, text);
  }, [text, loaded]);

  const html = useMemo(() => markdownToHtml(text), [text]);
  const lineCount = text.split("\n").length;
  const lineNumbers = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1).join("\n"), [lineCount]);
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // Text used by the styles panel: the selection, or everything if nothing is selected.
  const hasSelection = sel.end > sel.start && sel.end <= text.length;
  const styleSource = hasSelection ? text.slice(sel.start, sel.end) : text;

  // Keep the line numbers scrolled together with the textarea.
  function syncScroll() {
    if (gutterRef.current && editorRef.current) gutterRef.current.scrollTop = editorRef.current.scrollTop;
  }

  function trackSelection() {
    const el = editorRef.current;
    if (el) setSel({ start: el.selectionStart, end: el.selectionEnd });
  }

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }

  // Replace the selected text with its styled (Unicode bold/italic) version.
  function applyStyled(styled) {
    if (!hasSelection) return;
    const el = editorRef.current;
    setText(text.slice(0, sel.start) + styled + text.slice(sel.end));
    const newEnd = sel.start + styled.length;
    setSel({ start: sel.start, end: newEnd });
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(sel.start, newEnd);
    }, 0);
    flash("Styled text added to the editor.");
  }

  return (
    <>
      <div className="page-title">
        <h1>Markdown Previewer &amp; Text Styler</h1>
        <p className="muted">Write Markdown on the left and see the result on the right. Your text is saved in this browser.</p>
      </div>
      <Toast message={message} />

      {/* Mobile tabs */}
      <div className="tabs">
        <button className={`btn ${tab === "editor" ? "active" : ""}`} onClick={() => setTab("editor")}>
          Editor
        </button>
        <button className={`btn ${tab === "preview" ? "active" : ""}`} onClick={() => setTab("preview")}>
          Preview
        </button>
      </div>

      {/* Split view */}
      <div className="md-split">
        <div className={`card md-pane ${tab === "editor" ? "" : "hide-mobile"}`}>
          <div className="pane-head">Editor</div>
          <div className="editor-wrap">
            <pre className="gutter" ref={gutterRef} aria-hidden="true">
              {lineNumbers}
            </pre>
            <textarea
              ref={editorRef}
              className="editor"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                trackSelection();
              }}
              onSelect={trackSelection}
              onScroll={syncScroll}
              wrap="off"
              spellCheck={false}
              placeholder="Write Markdown here..."
            />
          </div>
        </div>

        <div className={`card md-pane ${tab === "preview" ? "" : "hide-mobile"}`}>
          <div className="pane-head">Preview</div>
          {/* Safe: markdownToHtml escapes all HTML before building output */}
          <div className="preview-scroll">
            <div className="preview" dangerouslySetInnerHTML={{ __html: html }} />

            {/* Bold, italic and bold-italic Unicode text, built from the editor text or selection */}
            <StylePanel source={styleSource} hasSelection={hasSelection} onApply={applyStyled} onCopyMessage={flash} />
          </div>
        </div>
      </div>

      <p className="muted counts">
        {words} words · {text.length} characters · {lineCount} lines
      </p>
    </>
  );
}
