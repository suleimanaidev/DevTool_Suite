"use client";

import { useMemo, useRef, useState } from "react";
import Toast from "../../components/Toast";
import "./csv-to-json.css";

const SAMPLE = `name,email,role,city
Ayesha Khan,ayesha@example.com,Designer,Karachi
Bilal Ahmed,bilal@example.com,Developer,Lahore
Sara Ali,sara@example.com,Writer,Islamabad
Omar Farooq,omar@example.com,Manager,Multan`;

const DELIMITER_NAMES = { ",": "comma", ";": "semicolon", "\t": "tab", "|": "pipe" };

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/)[0] || "";
  let best = ",";
  let bestCount = -1;
  for (const candidate of [",", ";", "\t", "|"]) {
    let count = 0;
    let inQuotes = false;
    for (let i = 0; i < firstLine.length; i++) {
      const char = firstLine[i];
      if (char === '"') {
        if (inQuotes && firstLine[i + 1] === '"') i++;
        else inQuotes = !inQuotes;
      } else if (char === candidate && !inQuotes) {
        count++;
      }
    }
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }
  return best;
}

// Handles quoted fields, escaped quotes ("") and line breaks inside quotes.
function parseCsv(text, delimiter) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (char === delimiter) {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (char === "\r" || char === "\n") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }

    field += char;
    i++;
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Blank lines are ignored, including a trailing newline.
  return {
    rows: rows.filter((item) => item.length > 1 || item[0] !== ""),
    unclosed: inQuotes,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CsvToJsonPage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [delimiter, setDelimiter] = useState("auto");
  const [hasHeader, setHasHeader] = useState(true);
  const [trim, setTrim] = useState(true);
  const [pretty, setPretty] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const result = useMemo(() => {
    if (!text.trim()) {
      return { json: "", rows: 0, columns: 0, warnings: [], delimiter: null };
    }

    try {
      const activeDelimiter = delimiter === "auto" ? detectDelimiter(text) : delimiter;
      const parsed = parseCsv(text, activeDelimiter);
      const warnings = [];

      if (!parsed.rows.length) {
        return { json: "", rows: 0, columns: 0, warnings, delimiter: activeDelimiter };
      }
      if (parsed.unclosed) warnings.push("A quoted field is not closed. Check the last quoted value.");

      let data;
      let columns;
      if (hasHeader) {
        const seen = new Set();
        const headers = parsed.rows[0].map((header, index) => {
          const base = (trim ? header.trim() : header) || `column_${index + 1}`;
          let name = base;
          let suffix = 2;
          while (seen.has(name)) {
            name = `${base}_${suffix}`;
            suffix++;
          }
          if (name !== base) warnings.push(`Duplicate column "${base}" renamed to "${name}".`);
          seen.add(name);
          return name;
        });

        data = parsed.rows.slice(1).map((row) => {
          const item = {};
          headers.forEach((header, index) => {
            const value = row[index] ?? "";
            item[header] = trim ? value.trim() : value;
          });
          return item;
        });
        columns = headers.length;
      } else {
        data = parsed.rows.map((row) => row.map((value) => (trim ? value.trim() : value)));
        columns = Math.max(...parsed.rows.map((row) => row.length));
      }

      return {
        json: JSON.stringify(data, null, pretty ? 2 : 0),
        rows: data.length,
        columns,
        warnings: [...new Set(warnings)],
        delimiter: activeDelimiter,
      };
    } catch {
      return { json: "", rows: 0, columns: 0, warnings: [], delimiter: null, failed: true };
    }
  }, [text, delimiter, hasHeader, trim, pretty]);

  const outputBytes = useMemo(() => (result.json ? new TextEncoder().encode(result.json).length : 0), [result.json]);

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }

  async function handleFile(file) {
    if (!file) return;
    try {
      const content = await file.text();
      setText(content);
      setFileName(file.name);
      setError("");
    } catch {
      setError("Could not read this file. Try opening it in a text editor and pasting the text.");
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

  function loadSample() {
    setText(SAMPLE);
    setFileName("sample.csv");
    setError("");
  }

  function clear() {
    setText("");
    setFileName("");
    setError("");
  }

  async function copyJson() {
    if (!result.json) return;
    try {
      await navigator.clipboard.writeText(result.json);
      flash("JSON copied!");
    } catch {
      flash("Copy failed - your browser blocked it.");
    }
  }

  function downloadJson() {
    if (!result.json) return;
    const blob = new Blob([result.json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const base = fileName ? fileName.replace(/\.[^.]+$/, "") : "data";
    anchor.href = url;
    anchor.download = `${base || "data"}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash("JSON file downloaded.");
  }

  return (
    <>
      <div className="page-title">
        <h1>CSV to JSON Converter</h1>
        <p className="muted">Paste CSV text or open a file. Everything is converted in your browser.</p>
      </div>
      <Toast message={message} />

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt,text/csv,text/plain,text/tab-separated-values"
        onChange={onFileChange}
        className="csv-hidden-input"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="card csv-options">
        <div className="field">
          <label htmlFor="csv-delimiter">Delimiter</label>
          <select id="csv-delimiter" value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
            <option value="auto">Detect automatically</option>
            <option value=",">Comma ( , )</option>
            <option value=";">Semicolon ( ; )</option>
            <option value={"\t"}>Tab</option>
            <option value="|">Pipe ( | )</option>
          </select>
        </div>
        <label className="csv-check">
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />
          <span>First row is the header</span>
        </label>
        <label className="csv-check">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
          <span>Trim whitespace</span>
        </label>
        <label className="csv-check">
          <input type="checkbox" checked={pretty} onChange={(e) => setPretty(e.target.checked)} />
          <span>Pretty print JSON</span>
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="csv-layout">
        <div
          className={`card csv-pane ${dragOver ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <div className="csv-pane-head">
            <h2>CSV input</h2>
            <div className="row">
              <button className="btn btn-sm" onClick={() => inputRef.current && inputRef.current.click()}>
                Open file
              </button>
              <button className="btn btn-sm" onClick={loadSample}>
                Sample
              </button>
              <button className="btn btn-sm btn-danger" onClick={clear} disabled={!text}>
                Clear
              </button>
            </div>
          </div>
          <textarea
            className="csv-textarea"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFileName("");
            }}
            placeholder={'Paste CSV here, for example:\nname,city\nAyesha,Karachi\nBilal,Lahore'}
            spellCheck={false}
            aria-label="CSV input"
          />
          <p className="muted csv-foot">
            {text
              ? `${fileName || "Pasted text"} · ${text.length.toLocaleString()} characters`
              : "You can also drop a .csv or .tsv file onto this box."}
          </p>
        </div>

        <div className="card csv-pane">
          <div className="csv-pane-head">
            <h2>JSON output</h2>
            <div className="row">
              <button className="btn btn-sm" onClick={copyJson} disabled={!result.json}>
                Copy
              </button>
              <button className="btn btn-sm btn-primary" onClick={downloadJson} disabled={!result.json}>
                Download
              </button>
            </div>
          </div>

          <div className="csv-output-wrap">
            {result.json ? (
              <pre className="csv-output">{result.json}</pre>
            ) : (
              <div className="csv-empty">
                {result.failed ? "This CSV could not be converted." : "Paste some CSV to see the JSON here."}
              </div>
            )}
          </div>

          <div className="csv-stats muted">
            <span>{result.rows.toLocaleString()} rows</span>
            <span>{result.columns.toLocaleString()} columns</span>
            {result.json && <span>{formatBytes(outputBytes)} output</span>}
            {result.delimiter && <span>Using {DELIMITER_NAMES[result.delimiter]} delimiter</span>}
          </div>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="csv-warning" role="status">
          {result.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}
    </>
  );
}
