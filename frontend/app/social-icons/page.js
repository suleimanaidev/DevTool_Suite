"use client";

// From Uiverse.io by wilsondesouza - https://uiverse.io/wilsondesouza/cowardly-swan-91
// MIT License, Copyright (c) PriyanshuGupta28 (Priyanshu Gupta), wilsondesouza (Wilson Souza)

import { useState } from "react";
import Toast from "../../components/Toast";
import "./social-icons.css";

const CREDIT =
  "From Uiverse.io by wilsondesouza - https://uiverse.io/wilsondesouza/cowardly-swan-91\nMIT License, Copyright (c) PriyanshuGupta28 (Priyanshu Gupta), wilsondesouza (Wilson Souza)";

const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/",
    social: "linkedin",
    path: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
  },
  {
    name: "GitHub",
    href: "https://www.github.com/",
    social: "github",
    path: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    social: "instagram",
    path: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334",
  },
  {
    name: "Youtube",
    href: "https://youtube.com/",
    social: "youtube",
    path: "M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z",
  },
];

const SOCIAL_MARKUP = SOCIALS.map(
  (social) => `  <li class="uiverse-social__item">
    <a href="${social.href}" aria-label="${social.name}" data-social="${social.social}" class="uiverse-social__link" target="_blank" rel="noopener noreferrer">
      <div class="uiverse-social__filled"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="${social.path}" fill="currentColor"></path>
      </svg>
    </a>
    <div class="uiverse-social__tip">${social.name}</div>
  </li>`
).join("\n");

const HTML_CODE = `<ul class="uiverse-social">
${SOCIAL_MARKUP}
</ul>`;

const CSS_CODE = `/* From Uiverse.io by wilsondesouza - https://uiverse.io/wilsondesouza/cowardly-swan-91
   MIT License, Copyright (c) PriyanshuGupta28 (Priyanshu Gupta), wilsondesouza (Wilson Souza) */

.uiverse-social {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.uiverse-social__item {
  margin: 0 10px;
  position: relative;
  padding: 0.5rem;
}

.uiverse-social__tip {
  position: absolute;
  top: 100%;
  right: 110%;
  transform: translateY(200%);
  color: #fff;
  padding: 6px 10px;
  border-radius: 5px;
  opacity: 0;
  visibility: hidden;
  font-size: 14px;
  transition: all 0.3s ease;
}

.uiverse-social__item:hover .uiverse-social__tip {
  opacity: 1;
  visibility: visible;
  top: -50px;
}

.uiverse-social__link {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: #4d4d4d;
  background-color: #fff;
  box-shadow: 0 3px 10px rgb(43 26 29 / 8%);
  transition: all 0.3s ease-in-out;
}

.uiverse-social__link:hover {
  box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 12%);
  color: white;
}

.uiverse-social__link svg {
  position: relative;
  z-index: 1;
  width: 30px;
  height: 30px;
}

.uiverse-social__filled {
  position: absolute;
  top: auto;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #000;
  transition: all 0.3s ease-in-out;
}

.uiverse-social__link:hover .uiverse-social__filled {
  height: 100%;
}

.uiverse-social__link[data-social="linkedin"] .uiverse-social__filled,
.uiverse-social__link[data-social="linkedin"] ~ .uiverse-social__tip {
  background-color: #0274b3;
}

.uiverse-social__link[data-social="github"] .uiverse-social__filled,
.uiverse-social__link[data-social="github"] ~ .uiverse-social__tip {
  background-color: #24262a;
}

.uiverse-social__link[data-social="instagram"] .uiverse-social__filled,
.uiverse-social__link[data-social="instagram"] ~ .uiverse-social__tip {
  background: linear-gradient(45deg, #405de6, #5b51db, #b33ab4, #c135b4, #e1306c, #fd1f1f);
}

.uiverse-social__link[data-social="youtube"] .uiverse-social__filled,
.uiverse-social__link[data-social="youtube"] ~ .uiverse-social__tip {
  background-color: #ff0000;
}`;

const STANDALONE_HTML = `<!--
${CREDIT}
-->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Social icons with tooltips</title>
  <style>
${CSS_CODE}

    /* Demo page only: an egg-white background matches the preview window. */
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background:
        radial-gradient(220px 180px at 50% 25%, rgba(215, 38, 56, 0.12), transparent 70%),
        #fff3e0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    .demo-stage { padding: 3rem 3rem 3rem 9rem; }
  </style>
</head>
<body>
  <div class="demo-stage">
${HTML_CODE}
  </div>
</body>
</html>`;

export default function SocialIconsPage() {
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
      anchor.download = "uiverse-social-icons.html";
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
        <h1>Social Icons</h1>
        <p className="muted">
          Round social buttons that lift a coloured fill and show a tooltip on hover. Preview them, then copy or
          download the code.
        </p>
      </div>
      <Toast message={message} />

      <div className="social-layout">
        <div className="card social-preview-card">
          <div className="social-preview-head">
            <div>
              <h2>Live preview</h2>
              <p className="muted">Hover any icon to see its tooltip. The links open in a new tab.</p>
            </div>
            <span className="badge">Pure CSS</span>
          </div>

          <div className="social-stage">
            <ul className="uiverse-social">
              {SOCIALS.map((social) => (
                <li className="uiverse-social__item" key={social.name}>
                  <a
                    className="uiverse-social__link"
                    href={social.href}
                    aria-label={social.name}
                    data-social={social.social}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="uiverse-social__filled" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d={social.path} fill="currentColor" />
                    </svg>
                  </a>
                  <div className="uiverse-social__tip">{social.name}</div>
                </li>
              ))}
            </ul>
          </div>

          <p className="muted social-hint">Hover an icon to see the coloured fill and its tooltip.</p>
        </div>

        <div className="card social-download-card">
          <h2>Get the code</h2>
          <p className="muted">
            Click Get code to copy a complete HTML file with the four buttons, the styles and the original credit.
            Paste it into any .html file and open it in a browser.
          </p>
          <div className="social-actions">
            <button type="button" className="btn btn-primary" onClick={() => copy(STANDALONE_HTML, "Code")}>
              Get code
            </button>
            <button type="button" className="btn" onClick={downloadHtml}>
              Download HTML
            </button>
          </div>
          <p className="muted social-license">
            The class names are prefixed with <code>uiverse-social</code>, so they will not clash with your own styles.
            Licensed under MIT; keep the credit comment when you reuse it.
          </p>
        </div>
      </div>
    </>
  );
}
