"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Toast from "../../components/Toast";
import "./image-metadata.css";

const ACCEPT = "image/*,.heic,.heif,.tif,.tiff";
const HIDDEN_KEYS = new Set(["thumbnail", "makernote", "usercomment"]);

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "Unknown";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function formatExposure(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  if (number > 0 && number < 1) return `1/${Math.round(1 / number)} s`;
  return `${number} s`;
}

function gcd(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const rest = x % y;
    x = y;
    y = rest;
  }
  return x || 1;
}

function formatMetaValue(value) {
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
  }
  if (Array.isArray(value)) {
    return value.length > 12 ? `[${value.length} values]` : value.join(", ");
  }
  if (typeof ArrayBuffer !== "undefined" && (ArrayBuffer.isView(value) || value instanceof ArrayBuffer)) {
    return `${value.byteLength ?? value.length ?? 0} bytes of binary data`;
  }
  if (value && typeof value === "object") {
    try {
      const text = JSON.stringify(value);
      return text.length > 180 ? `${text.slice(0, 180)}…` : text;
    } catch {
      return "[object]";
    }
  }
  const text = String(value);
  return text.length > 220 ? `${text.slice(0, 220)}…` : text;
}

// Load a local preview and read the real pixel dimensions.
function loadPreview(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    const timer = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error("timeout"));
    }, 10000);
    image.onload = () => {
      clearTimeout(timer);
      resolve({ url, width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      reject(new Error("preview"));
    };
    image.src = url;
  });
}

export default function ImageMetadataPage() {
  const [fileInfo, setFileInfo] = useState(null);
  const [preview, setPreview] = useState("");
  const [dimensions, setDimensions] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [gps, setGps] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState("");

  const inputRef = useRef(null);
  const urlRef = useRef("");

  // Release the preview URL when the page closes.
  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const shownDimensions = useMemo(() => {
    if (dimensions) return dimensions;
    if (metadata && Number(metadata.ImageWidth) > 0 && Number(metadata.ImageHeight) > 0) {
      return { width: Number(metadata.ImageWidth), height: Number(metadata.ImageHeight) };
    }
    return null;
  }, [dimensions, metadata]);

  const facts = useMemo(() => {
    if (!fileInfo) return [];
    const list = [];
    list.push(["File name", fileInfo.name]);
    list.push(["Type", fileInfo.type || "Unknown"]);
    list.push(["Size", formatBytes(fileInfo.size)]);
    list.push(["Modified", formatDate(fileInfo.lastModified)]);
    if (shownDimensions) {
      const { width, height } = shownDimensions;
      const divisor = gcd(width, height);
      list.push(["Dimensions", `${width} × ${height} px`]);
      list.push(["Megapixels", `${((width * height) / 1_000_000).toFixed(1)} MP`]);
      list.push(["Aspect ratio", `${Math.round(width / divisor)}:${Math.round(height / divisor)}`]);
    }
    if (metadata) {
      const camera = [metadata.Make, metadata.Model].filter(Boolean).join(" ");
      if (camera) list.push(["Camera", camera]);
      if (metadata.LensModel || metadata.Lens) list.push(["Lens", metadata.LensModel || metadata.Lens]);
      const taken = metadata.DateTimeOriginal || metadata.CreateDate || metadata.ModifyDate;
      if (taken) list.push(["Date taken", formatDate(taken)]);
      if (metadata.ExposureTime) list.push(["Exposure", formatExposure(metadata.ExposureTime)]);
      if (metadata.FNumber) list.push(["Aperture", `f/${Number(metadata.FNumber).toFixed(1)}`]);
      if (metadata.ISO || metadata.ISOSpeedRatings) list.push(["ISO", metadata.ISO || metadata.ISOSpeedRatings]);
      if (metadata.FocalLength) list.push(["Focal length", `${metadata.FocalLength} mm`]);
      if (metadata.Orientation) list.push(["Orientation", metadata.Orientation]);
      if (metadata.Software) list.push(["Software", metadata.Software]);
      if (gps) list.push(["GPS", `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`]);
    }
    return list.filter(([, value]) => value !== null && value !== undefined && value !== "");
  }, [fileInfo, metadata, gps, shownDimensions]);

  const metadataRows = useMemo(() => {
    if (!metadata) return [];
    return Object.entries(metadata)
      .filter(([key, value]) => {
        if (value === null || value === undefined || value === "") return false;
        if (HIDDEN_KEYS.has(key.toLowerCase())) return false;
        if (typeof ArrayBuffer !== "undefined" && (ArrayBuffer.isView(value) || value instanceof ArrayBuffer)) return false;
        return true;
      })
      .sort(([a], [b]) => a.localeCompare(b));
  }, [metadata]);

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }

  async function handleFile(file) {
    if (!file) return;
    const looksLikeImage =
      file.type.startsWith("image/") ||
      /\.(jpe?g|png|tiff?|heic|heif|webp|gif|avif|bmp)$/i.test(file.name);

    if (!looksLikeImage) {
      setError("Please choose an image file (JPEG, PNG, TIFF, HEIC, WebP and similar).");
      return;
    }

    setBusy(true);
    setError("");
    setNote("");
    setMetadata(null);
    setGps(null);
    setDimensions(null);
    setFileInfo({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });

    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
    setPreview("");

    // A preview is optional; HEIC files may not decode in every browser.
    // Start it alongside metadata reading so a slow preview never delays the results.
    const previewTask = loadPreview(file)
      .then((info) => {
        urlRef.current = info.url;
        setPreview(info.url);
        setDimensions({ width: info.width, height: info.height });
      })
      .catch(() => {
        // Metadata and file details still work without a preview.
      });

    try {
      const exifr = (await import("exifr")).default;
      const parsed = await exifr.parse(file, {
        tiff: true,
        ifd0: true,
        exif: true,
        gps: true,
        interop: true,
        jfif: true,
        iptc: true,
        xmp: true,
        icc: false,
        reviveValues: true,
        translateValues: true,
        mergeOutput: true,
      });

      let coordinates = null;
      try {
        const found = await exifr.gps(file);
        if (found && Number.isFinite(found.latitude) && Number.isFinite(found.longitude)) coordinates = found;
      } catch {
        // GPS is optional.
      }

      const clean = parsed && typeof parsed === "object" ? parsed : {};
      setMetadata(clean);
      setGps(coordinates);
      if (Object.keys(clean).length === 0) {
        setNote("No EXIF or XMP metadata was found. This is common for images exported by websites and messaging apps.");
      }
    } catch {
      setMetadata({});
      setNote(
        "This file's metadata could not be read. File details and dimensions are still shown. Some formats, such as HEIC, need browser support for a preview."
      );
    }

    await previewTask;
    setBusy(false);
  }

  function onInputChange(e) {
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
    setFileInfo(null);
    setPreview("");
    setDimensions(null);
    setMetadata(null);
    setGps(null);
    setError("");
    setNote("");
  }

  async function copyJson() {
    try {
      const payload = {
        file: fileInfo,
        image: shownDimensions,
        gps,
        metadata,
      };
      const text = JSON.stringify(
        payload,
        (key, value) => {
          if (typeof ArrayBuffer !== "undefined" && (ArrayBuffer.isView(value) || value instanceof ArrayBuffer)) {
            return `[binary data: ${value.byteLength} bytes]`;
          }
          return value;
        },
        2
      );
      await navigator.clipboard.writeText(text);
      flash("Metadata copied as JSON.");
    } catch {
      flash("Copy failed - your browser blocked it.");
    }
  }

  return (
    <>
      <div className="page-title">
        <h1>Image Metadata Viewer</h1>
        <p className="muted">
          Inspect EXIF, camera settings, GPS and file details without uploading the image.
        </p>
      </div>
      <Toast message={message} />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onInputChange}
        className="meta-hidden-input"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        className={`card meta-drop ${dragOver ? "over" : ""}`}
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (inputRef.current) inputRef.current.click();
          }
        }}
      >
        <div className="meta-drop-icon">🖼️</div>
        <strong>Drop an image here</strong>
        <span className="muted">or click to choose a file</span>
        <span className="meta-drop-types">JPEG · PNG · TIFF · HEIC · WebP · GIF</span>
      </div>

      {error && <p className="error-text">{error}</p>}
      {busy && <p className="muted meta-status">Reading metadata…</p>}

      {fileInfo && (
        <>
          <div className="meta-grid">
            <div className="card meta-preview-card">
              <h2>Preview</h2>
              {preview ? (
                <img className="meta-image" src={preview} alt={fileInfo.name} />
              ) : (
                <div className="meta-no-preview">
                  <span aria-hidden="true">🖼️</span>
                  <span>Preview not available for this file type</span>
                </div>
              )}
              <div className="row meta-file-actions">
                <button className="btn btn-sm" onClick={() => inputRef.current && inputRef.current.click()}>
                  Choose another
                </button>
                <button className="btn btn-sm btn-danger" onClick={clear}>
                  Clear
                </button>
              </div>
            </div>

            <div className="card">
              <h2>File &amp; image</h2>
              <dl className="meta-facts">
                {facts.map(([label, value]) => (
                  <div className="meta-fact" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              {gps && (
                <a
                  className="meta-map-link"
                  href={`https://www.openstreetmap.org/?mlat=${gps.latitude}&mlon=${gps.longitude}#map=15/${gps.latitude}/${gps.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GPS location on OpenStreetMap ↗
                </a>
              )}
              <p className="muted meta-privacy">Read in your browser. The image is never uploaded.</p>
            </div>
          </div>

          {note && <p className="meta-note">{note}</p>}

          {metadataRows.length > 0 && (
            <div className="card meta-table-card">
              <div className="meta-table-head">
                <h2>
                  All metadata <span className="muted">({metadataRows.length} fields)</span>
                </h2>
                <button className="btn btn-sm" onClick={copyJson}>
                  Copy JSON
                </button>
              </div>
              <div className="meta-table-wrap">
                <table className="meta-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadataRows.map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{formatMetaValue(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
