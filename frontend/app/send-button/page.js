"use client";

// From Uiverse.io by adamgiebl - https://uiverse.io/adamgiebl/smart-moth-68
// MIT License, Copyright (c) adamgiebl (Adam Giebl)

import { useState } from "react";
import Toast from "../../components/Toast";
import "./send-button.css";

const CREDIT =
  "From Uiverse.io by adamgiebl - https://uiverse.io/adamgiebl/smart-moth-68\nMIT License, Copyright (c) adamgiebl (Adam Giebl)";

const HTML_CODE = `<button type="button" class="uiverse-send-btn">
  <span class="uiverse-send-btn__icon-outer">
    <span class="uiverse-send-btn__icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
      </svg>
    </span>
  </span>
  <span class="uiverse-send-btn__label">Send</span>
</button>`;

const CSS_CODE = `/* From Uiverse.io by adamgiebl - https://uiverse.io/adamgiebl/smart-moth-68
   MIT License, Copyright (c) adamgiebl (Adam Giebl) */

.uiverse-send-btn {
  font-family: inherit;
  font-size: 20px;
  background: royalblue;
  color: white;
  padding: 0.7em 1em;
  padding-left: 0.9em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.uiverse-send-btn__icon-outer,
.uiverse-send-btn__icon {
  display: block;
}

.uiverse-send-btn__label {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

.uiverse-send-btn svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

.uiverse-send-btn:hover .uiverse-send-btn__icon {
  animation: uiverse-send-fly 0.6s ease-in-out infinite alternate;
}

.uiverse-send-btn:hover svg {
  transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

.uiverse-send-btn:hover .uiverse-send-btn__label {
  transform: translateX(5em);
}

.uiverse-send-btn:active {
  transform: scale(0.95);
}

@keyframes uiverse-send-fly {
  from {
    transform: translateY(0.1em);
  }

  to {
    transform: translateY(-0.1em);
  }
}`;

const STANDALONE_HTML = `<!--
${CREDIT}
-->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Send button</title>
  <style>
${CSS_CODE}

    /* Demo page only. */
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #fff3e0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    .demo-stage { padding: 2rem; }
  </style>
</head>
<body>
  <div class="demo-stage">
${HTML_CODE}
  </div>
</body>
</html>`;

export default function SendButtonPage() {
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
      anchor.download = "uiverse-send-button.html";
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
        <h1>Send Button</h1>
        <p className="muted">
          A blue Send button with a paper plane that rocks and flies on hover. Preview it, then copy or download the
          code.
        </p>
      </div>
      <Toast message={message} />

      <div className="send-layout">
        <div className="card send-preview-card">
          <div className="send-preview-head">
            <div>
              <h2>Live preview</h2>
              <p className="muted">Hover the button to see the plane fly and the label slide out.</p>
            </div>
            <span className="badge">Pure CSS</span>
          </div>

          <div className="send-stage">
            <button type="button" className="uiverse-send-btn">
              <span className="uiverse-send-btn__icon-outer">
                <span className="uiverse-send-btn__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    aria-hidden="true"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      fill="currentColor"
                      d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                    />
                  </svg>
                </span>
              </span>
              <span className="uiverse-send-btn__label">Send</span>
            </button>
          </div>

          <p className="muted send-hint">Hover the button, then press it to see the press animation.</p>
        </div>

        <div className="card send-download-card">
          <h2>Get the code</h2>
          <p className="muted">
            Click Get code to copy a complete HTML file with the button, the styles and the original credit. Paste it
            into any .html file and open it in a browser.
          </p>
          <div className="send-actions">
            <button type="button" className="btn btn-primary" onClick={() => copy(STANDALONE_HTML, "Code")}>
              Get code
            </button>
            <button type="button" className="btn" onClick={downloadHtml}>
              Download HTML
            </button>
          </div>
          <p className="muted send-license">
            The class names are prefixed with <code>uiverse-send-btn</code>, so they will not clash with your own
            styles. Licensed under MIT; keep the credit comment when you reuse it.
          </p>
        </div>
      </div>
    </>
  );
}
