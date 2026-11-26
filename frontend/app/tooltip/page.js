"use client";

// From Uiverse.io by vnuny - https://uiverse.io/vnuny/stale-mouse-74
// MIT License, Copyright (c) vnuny (Diaa)

import { useState } from "react";
import Toast from "../../components/Toast";
import "./tooltip.css";

const CREDIT = "From Uiverse.io by vnuny - https://uiverse.io/vnuny/stale-mouse-74\nMIT License, Copyright (c) vnuny (Diaa)";

const HTML_CODE = `<!--
${CREDIT}
-->
<div class="uiverse-tip">
  <div class="uiverse-tip__hint" data-position="4">
    <span class="uiverse-tip__radius"></span>
    <button type="button" class="uiverse-tip__dot" aria-describedby="uiverse-tip-content">Tip</button>
    <div class="uiverse-tip__content" id="uiverse-tip-content">
      <p>Use Navbar to navigate the website quickly and easily.</p>
    </div>
  </div>
</div>`;

const CSS_CODE = `/* From Uiverse.io by vnuny - https://uiverse.io/vnuny/stale-mouse-74
   MIT License, Copyright (c) vnuny (Diaa) */

.uiverse-tip {
  --purple: #720c8f;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
}

.uiverse-tip__hint {
  margin: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.uiverse-tip__dot {
  z-index: 3;
  border: 1px solid #720c8f;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  -webkit-transform: translate(-0%, -0%) scale(0.95);
  transform: translate(-0%, -0%) scale(0.95);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #720c8f;
  background: transparent;
  padding: 0;
  -webkit-appearance: none;
  appearance: none;
  font: inherit;
  cursor: pointer;
}

.uiverse-tip__radius {
  background-color: rgba(114, 12, 143, 0.08);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -125px 0 0 -125px;
  opacity: 0;
  visibility: hidden;
  -webkit-transform: scale(0);
  transform: scale(0);
}

.uiverse-tip__content {
  width: 300px;
  position: absolute;
  z-index: 5;
  padding: 35px 0;
  opacity: 0;
  transition: opacity 0.7s ease, visibility 0.7s ease;
  color: #2b1a1d;
  visibility: hidden;
  pointer-events: none;
}

.uiverse-tip__hint:hover .uiverse-tip__content,
.uiverse-tip__hint:focus-within .uiverse-tip__content {
  opacity: 1;
  transition: opacity 0.7s ease, visibility 0.7s ease;
  visibility: visible;
}

.uiverse-tip__content::before {
  width: 0px;
  bottom: 29px;
  left: 0;
  content: "";
  background-color: #720c8f;
  height: 1px;
  position: absolute;
  transition: width 0.4s;
}

.uiverse-tip__hint:hover .uiverse-tip__content::before,
.uiverse-tip__hint:focus-within .uiverse-tip__content::before {
  width: 180px;
  transition: width 0.4s;
}

.uiverse-tip__content::after {
  -webkit-transform-origin: 0 50%;
  transform-origin: 0 50%;
  -webkit-transform: rotate(-225deg);
  transform: rotate(-225deg);
  bottom: 29px;
  left: 0;
  width: 80px;
  content: "";
  background-color: #720c8f;
  height: 1px;
  position: absolute;
  opacity: 1;
  transition: opacity 0.5s ease;
  transition-delay: 0s;
}

.uiverse-tip__hint:hover .uiverse-tip__content::after,
.uiverse-tip__hint:focus-within .uiverse-tip__content::after {
  opacity: 1;
  visibility: visible;
}

.uiverse-tip__hint[data-position="1"] .uiverse-tip__content {
  top: 85px;
  left: 50%;
  margin-left: 56px;
}

.uiverse-tip__hint[data-position="4"] .uiverse-tip__content {
  bottom: 85px;
  left: 50%;
  margin-left: 56px;
}

.uiverse-tip__dot:focus-visible {
  outline: 2px solid #720c8f;
  outline-offset: 4px;
}`;

const STANDALONE_HTML = `<!--
${CREDIT}
-->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tip tooltip</title>
  <style>
${CSS_CODE}

    /* Demo page only: an egg-white background matches the preview window. */
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background:
        radial-gradient(220px 180px at 18% 22%, rgba(215, 38, 56, 0.12), transparent 70%),
        #fff3e0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    .demo-stage { padding: 2rem 2rem 2rem 3rem; }
  </style>
</head>
<body>
  <div class="demo-stage">
${HTML_CODE}
  </div>
</body>
</html>`;

export default function TooltipPage() {
  const [message, setMessage] = useState("");

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      flash(`${label} copied.`);
    } catch {
      flash("Could not copy. Use the download button instead.");
    }
  }

  function downloadHtml() {
    try {
      const blob = new Blob([STANDALONE_HTML], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "uiverse-tip-tooltip.html";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      flash("HTML file downloaded.");
    } catch {
      flash("Could not download the file.");
    }
  }

  return (
    <>
      <div className="page-title">
        <h1>Tooltip</h1>
        <p className="muted">
          A circular Tip badge that reveals a short hint when you hover or focus it. Preview it live, then copy or
          download the code.
        </p>
      </div>
      <Toast message={message} />

      <div className="tooltip-layout">
        <div className="card tooltip-preview-card">
          <div className="tooltip-preview-head">
            <div>
              <h2>Live preview</h2>
              <p className="muted">Hover the badge, or press Tab to focus it. On touch screens, tap the badge.</p>
            </div>
            <span className="badge">Pure CSS</span>
          </div>

          <div className="tooltip-stage">
            <div className="uiverse-tip">
              <div className="uiverse-tip__hint" data-position="4">
                <span className="uiverse-tip__radius" />
                <button type="button" className="uiverse-tip__dot" aria-describedby="tip-demo-content">
                  Tip
                </button>
                <div className="uiverse-tip__content" id="tip-demo-content">
                  <p>Use Navbar to navigate the website quickly and easily.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="muted tooltip-hint">
            The dot, the fade and the thin guide lines are all done with CSS.
          </p>
        </div>

        <div className="card tooltip-download-card">
          <h2>Get the code</h2>
          <p className="muted">
            Click Get code to copy a complete HTML file with the markup, the styles and the original credit. Paste it
            into any .html file and open it in a browser.
          </p>
          <div className="tooltip-actions">
            <button type="button" className="btn btn-primary" onClick={() => copy(STANDALONE_HTML, "Code")}>
              Get code
            </button>
            <button type="button" className="btn" onClick={downloadHtml}>
              Download HTML
            </button>
          </div>
          <p className="muted tooltip-license">
            The class names are prefixed with <code>uiverse-tip</code>, so they will not clash with your own styles.
            Licensed under MIT; keep the credit comment when you reuse it.
          </p>
        </div>
      </div>
    </>
  );
}
