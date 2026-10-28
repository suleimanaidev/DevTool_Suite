"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InvoicePreview from "../../components/InvoicePreview";
import Toast from "../../components/Toast";
import {
  CURRENCIES,
  LAYOUTS,
  PRESET_COLORS,
  calculateTotals,
  createSampleInvoice,
  formatInvoiceNumber,
  formatMoney,
  newId,
  validateInvoice,
} from "../../lib/invoice";
import "./invoice.css";

// localStorage keys
const DRAFT_KEY = "invoice-draft"; // current form + color + layout
const NEXT_KEY = "invoice-next"; // next invoice number (auto-increment)
const SAVED_KEY = "invoice-saved"; // list of saved invoices

const MAX_LOGO_BYTES = 500 * 1024;

// Read JSON from localStorage safely.
function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function InvoicePage() {
  const [invoice, setInvoice] = useState(null); // null until loaded from localStorage
  const [color, setColor] = useState(PRESET_COLORS[0].value);
  const [layout, setLayout] = useState("classic");
  const [saved, setSaved] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [errors, setErrors] = useState([]);
  const [tab, setTab] = useState("form"); // mobile only
  const [message, setMessage] = useState("");

  // ----- Load everything once -----
  useEffect(() => {
    const next = Number(localStorage.getItem(NEXT_KEY)) || 1;
    const draft = readJson(DRAFT_KEY, null);
    setNextNumber(next);
    setSaved(readJson(SAVED_KEY, []));
    if (draft && draft.invoice) {
      setInvoice(draft.invoice);
      setColor(draft.color || PRESET_COLORS[0].value);
      setLayout(draft.layout || "classic");
    } else {
      setInvoice(createSampleInvoice(next)); // sample data on first visit
    }
  }, []);

  // ----- Auto-save the draft on every change -----
  useEffect(() => {
    if (!invoice) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ invoice, color, layout }));
    } catch {
      /* storage full (e.g. very large logo) - ignore */
    }
  }, [invoice, color, layout]);

  if (!invoice) return <p className="muted">Loading invoice...</p>;

  const totals = calculateTotals(invoice);

  // ----- Small update helpers -----
  const setField = (field, value) => setInvoice({ ...invoice, [field]: value });
  const setBusiness = (field, value) => setInvoice({ ...invoice, business: { ...invoice.business, [field]: value } });
  const setClient = (field, value) => setInvoice({ ...invoice, client: { ...invoice.client, [field]: value } });

  function setItem(id, field, value) {
    setField("items", invoice.items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  const addItem = () =>
    setField("items", [...invoice.items, { id: newId(), description: "", quantity: "1", rate: "" }]);
  const removeItem = (id) => setField("items", invoice.items.filter((it) => it.id !== id));

  function flash(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 2200);
  }

  // ----- Logo upload -----
  function handleLogo(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return flash("Please choose an image file.");
    if (file.size > MAX_LOGO_BYTES) return flash("Logo is too large (max 500 KB).");
    const reader = new FileReader();
    reader.onload = () => setBusiness("logo", reader.result);
    reader.readAsDataURL(file);
  }

  // ----- Invoice number counter -----
  function advanceCounter(n) {
    localStorage.setItem(NEXT_KEY, String(n + 1));
    setNextNumber(n + 1);
  }

  // ----- Buttons -----
  function handleReset() {
    if (!confirm("Reset the form back to the sample invoice?")) return;
    setInvoice(createSampleInvoice(nextNumber));
    setColor(PRESET_COLORS[0].value);
    setLayout("classic");
    setErrors([]);
    flash("Form reset.");
  }

  function persistSaved(list) {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(list));
      setSaved(list);
      return true;
    } catch {
      flash("Could not save - browser storage is full.");
      return false;
    }
  }

  function handleSave() {
    const problems = validateInvoice(invoice);
    setErrors(problems);
    if (problems.length) return;

    const entry = { id: invoice.id, savedAt: new Date().toISOString(), invoice, color, layout };
    const exists = saved.some((s) => s.id === invoice.id);
    const list = exists ? saved.map((s) => (s.id === invoice.id ? entry : s)) : [entry, ...saved];
    if (!persistSaved(list)) return;

    // Move the counter forward so the next new invoice gets a fresh number.
    const n = parseInt(invoice.number.replace(/\D/g, ""), 10);
    if (!isNaN(n) && n >= nextNumber) advanceCounter(n);
    flash("Invoice saved!");
  }

  function handlePdf() {
    const problems = validateInvoice(invoice);
    setErrors(problems);
    if (problems.length) {
      setTab("form");
      return;
    }
    // The file name of the PDF comes from the page title.
    const oldTitle = document.title;
    document.title = invoice.number;
    window.print();
    document.title = oldTitle;
  }

  function openSaved(entry) {
    setInvoice(entry.invoice);
    setColor(entry.color);
    setLayout(entry.layout);
    setErrors([]);
    setTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function duplicateSaved(entry) {
    const copy = { ...entry.invoice, id: newId(), number: formatInvoiceNumber(nextNumber) };
    setInvoice(copy);
    setColor(entry.color);
    setLayout(entry.layout);
    setErrors([]);
    flash(`Duplicated as ${copy.number}. Click "Save invoice" to keep it.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteSaved(id) {
    persistSaved(saved.filter((s) => s.id !== id));
  }

  return (
    <>
      <div className="page-title no-print">
        <h1>Invoice Generator</h1>
        <p className="muted">Fill in the form on the left. Your invoice updates instantly on the right.</p>
      </div>

      {/* Mobile tabs */}
      <div className="tabs no-print">
        <button className={`btn ${tab === "form" ? "active" : ""}`} onClick={() => setTab("form")}>
          Form
        </button>
        <button className={`btn ${tab === "preview" ? "active" : ""}`} onClick={() => setTab("preview")}>
          Preview
        </button>
      </div>

      <div className="invoice-layout">
        {/* ================= FORM ================= */}
        <div className={`invoice-form no-print ${tab === "form" ? "" : "hide-mobile"}`}>
          {/* Step 1: client */}
          <Step number={1} title="Who is this invoice for?">
            <TextField
              label="Client name *"
              placeholder="e.g. Jane Smith or Acme Ltd"
              value={invoice.client.name}
              onChange={(v) => setClient("name", v)}
            />
            <TextField
              label="Client email"
              type="email"
              placeholder="client@example.com"
              value={invoice.client.email}
              onChange={(v) => setClient("email", v)}
            />
            <div className="field">
              <label>Client address</label>
              <textarea
                rows={2}
                placeholder="Street, city, country"
                value={invoice.client.address}
                onChange={(e) => setClient("address", e.target.value)}
              />
            </div>
          </Step>

          {/* Step 2: items */}
          <Step number={2} title="What are you charging for?">
            <div className="items-head">
              <span>Item</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>
            <AnimatePresence initial={false}>
              {invoice.items.map((it) => (
                <motion.div
                  key={it.id}
                  className="item-row"
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="text"
                    placeholder="What did you sell?"
                    aria-label="Item description"
                    value={it.description}
                    onChange={(e) => setItem(it.id, "description", e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    aria-label="Quantity"
                    value={it.quantity}
                    onChange={(e) => setItem(it.id, "quantity", e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    aria-label="Price"
                    value={it.rate}
                    onChange={(e) => setItem(it.id, "rate", e.target.value)}
                  />
                  <span className="item-amount">
                    {formatMoney((Number(it.quantity) || 0) * (Number(it.rate) || 0), invoice.currency)}
                  </span>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(it.id)} aria-label="Remove item">
                    Remove
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {invoice.items.length === 0 && <p className="muted">No items yet. Add your first one below.</p>}
            <button type="button" className="btn btn-sm" onClick={addItem} style={{ marginTop: "0.5rem" }}>
              + Add item
            </button>

            <div className="two-col" style={{ marginTop: "1rem" }}>
              <TextField
                label="Tax (%)"
                type="number"
                placeholder="0"
                value={invoice.taxPercent}
                onChange={(v) => setField("taxPercent", v)}
              />
              <div className="field">
                <label>Discount</label>
                <div className="discount-row">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={invoice.discountValue}
                    onChange={(e) => setField("discountValue", e.target.value)}
                  />
                  <select value={invoice.discountType} onChange={(e) => setField("discountType", e.target.value)}>
                    <option value="percent">% off</option>
                    <option value="fixed">Amount</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mini-totals">
              <div><span>Subtotal</span><span>{formatMoney(totals.subtotal, invoice.currency)}</span></div>
              <div><span>Discount</span><span>- {formatMoney(totals.discount, invoice.currency)}</span></div>
              <div><span>Tax</span><span>{formatMoney(totals.tax, invoice.currency)}</span></div>
              <div className="grand"><span>Total</span><span>{formatMoney(totals.total, invoice.currency)}</span></div>
            </div>
          </Step>

          {/* Step 3: details */}
          <Step number={3} title="Invoice details">
            <div className="two-col">
              <TextField label="Invoice number" value={invoice.number} onChange={(v) => setField("number", v)} />
              <div className="field">
                <label>Currency</label>
                <select value={invoice.currency} onChange={(e) => setField("currency", e.target.value)}>
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c}>
                      {c} - {CURRENCIES[c].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="two-col">
              <TextField label="Invoice date" type="date" value={invoice.issueDate} onChange={(v) => setField("issueDate", v)} />
              <TextField label="Payment due date" type="date" value={invoice.dueDate} onChange={(v) => setField("dueDate", v)} />
            </div>
            <div className="field">
              <label>Payment status stamp (optional)</label>
              <select value={invoice.status} onChange={(e) => setField("status", e.target.value)}>
                <option value="none">No stamp</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </Step>

          {/* Extra sections are collapsed to keep the form short */}
          <details className="card more">
            <summary>
              <span className="step-badge">4</span> Your business <small>name, contact, logo</small>
            </summary>
            <div className="more-body">
              <TextField label="Business name" value={invoice.business.name} onChange={(v) => setBusiness("name", v)} />
              <div className="two-col">
                <TextField label="Email" type="email" value={invoice.business.email} onChange={(v) => setBusiness("email", v)} />
                <TextField label="Phone" value={invoice.business.phone} onChange={(v) => setBusiness("phone", v)} />
              </div>
              <div className="field">
                <label>Address</label>
                <textarea rows={2} value={invoice.business.address} onChange={(e) => setBusiness("address", e.target.value)} />
              </div>
              <div className="field">
                <label>Logo (optional, up to 500 KB)</label>
                <input type="file" accept="image/*" onChange={handleLogo} />
                {invoice.business.logo && (
                  <button type="button" className="btn btn-sm btn-danger" style={{ marginTop: "0.4rem" }} onClick={() => setBusiness("logo", "")}>
                    Remove logo
                  </button>
                )}
              </div>
            </div>
          </details>

          <details className="card more">
            <summary>
              <span className="step-badge">5</span> Notes &amp; payment info <small>bank details, terms</small>
            </summary>
            <div className="more-body">
              <textarea
                rows={4}
                placeholder="Bank details, payment terms, thank-you message..."
                value={invoice.notes}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </div>
          </details>

          <details className="card more" open>
            <summary>
              <span className="step-badge">6</span> Colors &amp; style <small>pick a color and layout</small>
            </summary>
            <div className="more-body">
              <label>Color</label>
              <div className="swatches">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`swatch ${color.toLowerCase() === c.value ? "selected" : ""}`}
                    style={{ background: c.value }}
                    title={c.name}
                    aria-label={c.name}
                    onClick={() => setColor(c.value)}
                  />
                ))}
                <label className="custom-color" title="Pick any color">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                  <span>Custom color</span>
                </label>
              </div>

              <label style={{ marginTop: "0.9rem" }}>Layout</label>
              <div className="layout-options">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`btn ${layout === l.id ? "btn-primary" : ""}`}
                    onClick={() => setLayout(l.id)}
                  >
                    {l.label}
                    <small>{l.hint}</small>
                  </button>
                ))}
              </div>
            </div>
          </details>

          {/* Errors */}
          <AnimatePresence>
            {errors.length > 0 && (
              <motion.div
                className="card error-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <strong>Please fix the following:</strong>
                <ul>
                  {errors.map((er) => (
                    <li key={er}>{er}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="row actions">
            <button className="btn btn-primary" onClick={handlePdf}>
              Download PDF
            </button>
            <button className="btn" onClick={handleSave}>
              Save invoice
            </button>
            <button className="btn btn-danger" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* ================= PREVIEW ================= */}
        <div className={`invoice-preview-pane ${tab === "preview" ? "" : "hide-mobile"}`}>
          <InvoicePreview invoice={invoice} color={color} layout={layout} />
          <div className="row no-print preview-actions">
            <button className="btn btn-primary" onClick={handlePdf}>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* ================= SAVED INVOICES ================= */}
      <section className="card saved-box no-print">
        <h2>Saved invoices ({saved.length})</h2>
        {saved.length === 0 && <p className="muted">Nothing saved yet. Click &quot;Save invoice&quot; to keep a copy here.</p>}
        <ul className="saved-list">
          <AnimatePresence initial={false}>
            {saved.map((s) => (
              <motion.li
                key={s.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30 }}
              >
                <span className="saved-dot" style={{ background: s.color }} />
                <div className="saved-info">
                  <strong>{s.invoice.number}</strong> · {s.invoice.client.name}
                  <div className="muted">
                    {formatMoney(calculateTotals(s.invoice).total, s.invoice.currency)} ·{" "}
                    {new Date(s.savedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="row">
                  <button className="btn btn-sm" onClick={() => openSaved(s)}>
                    Open
                  </button>
                  <button className="btn btn-sm" onClick={() => duplicateSaved(s)}>
                    Duplicate
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteSaved(s.id)}>
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      <Toast message={message} />
    </>
  );
}

// A numbered card section of the form.
function Step({ number, title, children }) {
  return (
    <section className="card">
      <h2 className="step-title">
        <span className="step-badge">{number}</span> {title}
      </h2>
      {children}
    </section>
  );
}

// A label + input pair used many times in the form.
function TextField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
