"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Toast from "../../components/Toast";
import "./color-palette.css";

const ACCEPT = "image/*";
const MAX_SIDE = 240;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function contrastColor(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#2b1a1d" : "#FFF8EE";
}

function distance(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// Group near-identical buckets so the palette has distinct colors, then pick the most common.
function buildPalette(buckets, count) {
  if (!buckets.length) return [];
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const chosen = [];

  for (const bucket of buckets) {
    if (chosen.length < count) {
      const close = chosen.find((color) => distance(color, bucket) < 28);
      if (close) close.count += bucket.count;
      else chosen.push({ ...bucket });
    } else {
      break;
    }
  }

  return chosen
    .sort((a, b) => b.count - a.count)
    .map((color) => ({
      ...color,
      hex: rgbToHex(color.r, color.g, color.b),
      text: contrastColor(color.r, color.g, color.b),
      percent: total ? (color.count / total) * 100 : 0,
    }));
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = url;
  });
}

async function extractBuckets(file) {
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("canvas");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const buckets = new Map();
    let sampled = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) continue; // ignore transparent pixels
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3); // 5 bits per channel
      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = { r: 0, g: 0, b: 0, count: 0 };
        buckets.set(key, bucket);
      }
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.count++;
      sampled++;
    }

    const list = [...buckets.values()]
      .map((bucket) => ({
        r: bucket.r / bucket.count,
        g: bucket.g / bucket.count,
        b: bucket.b / bucket.count,
        count: bucket.count,
      }))
      .sort((a, b) => b.count - a.count);

    return { url, width, height, buckets: list, sampled };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

export default function ColorPalettePage() {
  const [image, setImage] = useState(null); // { url, name, size, width, height }
  const [buckets, setBuckets] = useState([]);
  const [sampled, setSampled] = useState(0);
  const [colorCount, setColorCount] = useState(8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState("");

  const inputRef = useRef(null);
  const urlRef = useRef("");

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const palette = useMemo(() => buildPalette(buckets, colorCount), [buckets, colorCount]);

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }

  async function handleFile(file) {
    if (!file) return;
    const looksLikeImage =
      file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|avif|svg)$/i.test(file.name);
    if (!looksLikeImage) {
      setError("Please choose an image file.");
      return;
    }

    setBusy(true);
    setError("");
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
    setImage(null);
    setBuckets([]);
    setSampled(0);

    try {
      const result = await extractBuckets(file);
      urlRef.current = result.url;
      setImage({
        url: result.url,
        name: file.name,
        size: file.size,
        width: result.width,
        height: result.height,
      });
      setBuckets(result.buckets);
      setSampled(result.sampled);
      if (!result.sampled) {
        setError("No visible pixels were found. Try an image without full transparency.");
      }
    } catch {
      setError("Could not read this image. Try a JPEG, PNG, WebP or GIF file.");
    } finally {
      setBusy(false);
    }
  }

  async function loadSample() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 400;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas");

      const gradient = context.createLinearGradient(0, 0, 640, 400);
      gradient.addColorStop(0, "#D72638");
      gradient.addColorStop(0.35, "#F59E0B");
      gradient.addColorStop(0.7, "#FFF3E0");
      gradient.addColorStop(1, "#15803D");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 640, 400);

      context.fillStyle = "rgba(43, 26, 29, 0.88)";
      context.beginPath();
      context.arc(480, 118, 104, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "rgba(255, 252, 247, 0.78)";
      context.fillRect(40, 250, 220, 100);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("blob");
      const file = new File([blob], "sample-colors.png", { type: "image/png" });
      await handleFile(file);
    } catch {
      setError("Could not create the sample image.");
    }
  }

  function onFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function clear() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
    setImage(null);
    setBuckets([]);
    setSampled(0);
    setError("");
  }

  async function copyHex(hex) {
    try {
      await navigator.clipboard.writeText(hex);
      flash(`${hex} copied!`);
    } catch {
      flash("Copy failed - your browser blocked it.");
    }
  }

  async function copyAll() {
    if (!palette.length) return;
    try {
      await navigator.clipboard.writeText(palette.map((color) => color.hex).join("\n"));
      flash("All HEX codes copied!");
    } catch {
      flash("Copy failed - your browser blocked it.");
    }
  }

  async function copyCss() {
    if (!palette.length) return;
    const css = `:root {\n${palette.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join("\n")}\n}`;
    try {
      await navigator.clipboard.writeText(css);
      flash("CSS variables copied!");
    } catch {
      flash("Copy failed - your browser blocked it.");
    }
  }

  return (
    <>
      <div className="page-title">
        <h1>Image Color Palette Extractor</h1>
        <p className="muted">Pull the dominant colors out of an image and copy their HEX codes.</p>
      </div>
      <Toast message={message} />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onFileChange}
        className="palette-hidden-input"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="palette-layout">
        <div
          className={`card palette-image-card ${dragOver ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <h2>Image</h2>

          {image ? (
            <>
              <img className="palette-image" src={image.url} alt={image.name} />
              <p className="muted palette-file">
                {image.name} · {image.width} × {image.height} px · {formatBytes(image.size)}
              </p>
              <div className="row palette-image-actions">
                <button className="btn btn-sm" onClick={() => inputRef.current && inputRef.current.click()}>
                  Choose another
                </button>
                <button className="btn btn-sm" onClick={loadSample}>
                  Sample
                </button>
                <button className="btn btn-sm btn-danger" onClick={clear}>
                  Clear
                </button>
              </div>
            </>
          ) : (
            <div
              className="palette-drop"
              onClick={() => inputRef.current && inputRef.current.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (inputRef.current) inputRef.current.click();
                }
              }}
            >
              <div className="palette-drop-icon" aria-hidden="true">
                🎨
              </div>
              <strong>Drop an image here</strong>
              <span className="muted">or click to choose a file</span>
              <span className="palette-drop-types">JPEG · PNG · WebP · GIF · SVG</span>
            </div>
          )}

          {!image && (
            <div className="row palette-image-actions">
              <button className="btn btn-sm btn-primary" onClick={() => inputRef.current && inputRef.current.click()}>
                Choose image
              </button>
              <button className="btn btn-sm" onClick={loadSample}>
                Try a sample
              </button>
            </div>
          )}

          {error && <p className="error-text palette-error">{error}</p>}
        </div>

        <div className="card palette-results-card">
          <div className="palette-head">
            <div>
              <h2>Dominant colors</h2>
              <p className="muted">Click a swatch to copy its HEX code.</p>
            </div>
            <div className="row palette-actions">
              <label className="palette-count">
                Colors
                <select value={colorCount} onChange={(e) => setColorCount(Number(e.target.value))}>
                  {[3, 4, 5, 6, 7, 8, 9, 10, 12].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn btn-sm" onClick={copyAll} disabled={!palette.length}>
                Copy HEX
              </button>
              <button className="btn btn-sm" onClick={copyCss} disabled={!palette.length}>
                Copy CSS
              </button>
            </div>
          </div>

          {busy ? (
            <p className="muted palette-empty">Extracting colors…</p>
          ) : palette.length > 0 ? (
            <>
              <div className="palette-grid">
                {palette.map((color, index) => (
                  <button
                    key={`${color.hex}-${index}`}
                    className={`palette-swatch ${index === 0 ? "first" : ""}`}
                    style={{ backgroundColor: color.hex, color: color.text }}
                    onClick={() => copyHex(color.hex)}
                    title={`Copy ${color.hex}`}
                  >
                    <span className="palette-hex">{color.hex}</span>
                    <span className="palette-meta">
                      rgb({Math.round(color.r)}, {Math.round(color.g)}, {Math.round(color.b)})
                    </span>
                    <span className="palette-meta">
                      {color.percent < 0.1 ? "<0.1" : color.percent.toFixed(1)}% of pixels
                    </span>
                  </button>
                ))}
              </div>
              <p className="muted palette-note">
                {sampled.toLocaleString()} pixels sampled from the image. Colors are grouped, so the percentages do not
                always add up to 100%.
              </p>
            </>
          ) : (
            <div className="palette-empty">
              <span aria-hidden="true">🎨</span>
              <p>Upload an image to see its palette.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
