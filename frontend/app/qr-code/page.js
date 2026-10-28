"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "../../components/Toast";
import "./qr-code.css";

const SIZES = [128, 256, 320, 512, 1024];

// QR codes stay pure black and white for the best scanning contrast.
const QR_COLORS = { dark: "#000000", light: "#FFFFFF" };

export default function QrCodePage() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [level, setLevel] = useState("M");
  const [src, setSrc] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const bytes = useMemo(() => new TextEncoder().encode(text).length, [text]);

  // Regenerate after a short pause so typing stays smooth.
  useEffect(() => {
    let cancelled = false;

    if (!text.trim()) {
      setSrc("");
      setError("");
      setGenerating(false);
      return undefined;
    }

    setGenerating(true);
    const timer = setTimeout(async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const dataUrl = await QRCode.toDataURL(text, {
          width: size,
          margin,
          errorCorrectionLevel: level,
          color: QR_COLORS,
        });
        if (!cancelled) {
          setSrc(dataUrl);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setSrc("");
          setError("This content is too long for a QR code. Shorten it or choose a lower error-correction level.");
        }
      } finally {
        if (!cancelled) setGenerating(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, size, margin, level]);

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }

  async function downloadSvg() {
    if (!text.trim()) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const svg = await QRCode.toString(text, {
        type: "svg",
        margin,
        errorCorrectionLevel: level,
        color: QR_COLORS,
      });
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "qr-code.svg";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      flash("SVG downloaded.");
    } catch {
      flash("Could not download the SVG.");
    }
  }

  async function copyImage() {
    if (!src) return;
    try {
      if (!navigator.clipboard || typeof ClipboardItem === "undefined") throw new Error("unsupported");
      const blob = await (await fetch(src)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("QR code image copied!");
    } catch {
      flash("Copying images is not supported in this browser. Download the PNG instead.");
    }
  }

  return (
    <>
      <div className="page-title">
        <h1>QR Code Generator</h1>
        <p className="muted">Create a QR code for a link or text, then download it as a PNG or SVG.</p>
      </div>
      <Toast message={message} />

      <div className="qr-layout">
        <div className="card qr-preview-card">
          <h2>Preview</h2>
          <div className="qr-stage">
            {src ? (
              <img src={src} alt="Generated QR code" />
            ) : (
              <span className="qr-placeholder">
                {generating ? "Generating…" : "Type something to create a QR code."}
              </span>
            )}
          </div>

          {error && <p className="error-text qr-error">{error}</p>}

          <p className="muted qr-meta">
            {text
              ? `${text.length.toLocaleString()} characters · ${bytes.toLocaleString()} bytes${generating ? " · Updating…" : ""}`
              : "Ready when you are."}
          </p>

          <div className="row qr-actions">
            {src ? (
              <a className="btn btn-primary btn-sm" href={src} download="qr-code.png">
                Download PNG
              </a>
            ) : (
              <button className="btn btn-primary btn-sm" disabled>
                Download PNG
              </button>
            )}
            <button className="btn btn-sm" onClick={downloadSvg} disabled={!src || Boolean(error)}>
              Download SVG
            </button>
            <button className="btn btn-sm" onClick={copyImage} disabled={!src || Boolean(error)}>
              Copy image
            </button>
          </div>
        </div>

        <div className="card qr-settings">
          <h2>Content</h2>
          <textarea
            className="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a link or type any text..."
            spellCheck={false}
            aria-label="QR code content"
          />

          <div className="qr-settings-grid">
            <div className="field">
              <label htmlFor="qr-size">Size</label>
              <select id="qr-size" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                {SIZES.map((option) => (
                  <option key={option} value={option}>
                    {option} × {option} px
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="qr-level">Error correction</label>
              <select id="qr-level" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>

            <div className="field qr-margin-field">
              <label htmlFor="qr-margin">
                Margin <span className="muted">{margin}</span>
              </label>
              <input
                id="qr-margin"
                type="range"
                min="0"
                max="8"
                step="1"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              />
            </div>
          </div>

          <p className="muted qr-note">
            Codes are always black on white for reliable scanning. Higher error correction makes the pattern denser
            but keeps it readable if part of it is covered.
          </p>
        </div>
      </div>
    </>
  );
}
