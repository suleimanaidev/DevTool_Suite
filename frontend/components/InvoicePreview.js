"use client";

import { useEffect, useRef, useState } from "react";
import { calculateTotals, contrastColor, formatMoney } from "../lib/invoice";

const A4_WIDTH_PX = 794; // 210mm at 96 dpi
const STATUS_LABELS = { paid: "PAID", unpaid: "UNPAID", overdue: "OVERDUE" };

// "2025-01-31" -> "31 Jan 2025"
function showDate(value) {
  if (!value) return "-";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Renders the A4 invoice. ONE css variable (--accent) drives every color.
export default function InvoicePreview({ invoice, color, layout }) {
  const wrapRef = useRef(null);
  const sheetRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(1123);

  // On screen the A4 sheet is shrunk to fit its column.
  useEffect(() => {
    const update = () => {
      const w = wrapRef.current?.clientWidth;
      if (!w) return; // hidden (mobile tab) - skip
      setScale(Math.min(1, w / A4_WIDTH_PX));
      setHeight(sheetRef.current.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrapRef.current);
    observer.observe(sheetRef.current);
    return () => observer.disconnect();
  }, []);

  const totals = calculateTotals(invoice);
  const money = (n) => formatMoney(n, invoice.currency);
  const { business, client } = invoice;

  const cssVars = {
    "--accent": color,
    "--accent-text": contrastColor(color),
    width: A4_WIDTH_PX,
    transform: `scale(${scale})`,
  };

  return (
    <div ref={wrapRef} className="sheet-wrap" style={{ height: height * scale }}>
      <div ref={sheetRef} id="invoice-sheet" className={`invoice-sheet layout-${layout}`} style={cssVars}>
        {/* ----- Header ----- */}
        <header className="inv-header">
          <div className="inv-business">
            {business.logo && <img src={business.logo} alt="Logo" className="inv-logo" />}
            <div>
              <div className="inv-business-name">{business.name || "Your Business"}</div>
              <div className="inv-small pre">{business.address}</div>
              <div className="inv-small">{business.email}</div>
              <div className="inv-small">{business.phone}</div>
            </div>
          </div>
          <div className="inv-title-box">
            <div className="inv-title">INVOICE</div>
            <div className="inv-small"># {invoice.number}</div>
          </div>
        </header>

        {/* ----- Bill to + dates ----- */}
        <section className="inv-meta">
          <div>
            <div className="inv-label">Billed to</div>
            <div className="inv-client-name">{client.name || "Client name"}</div>
            <div className="inv-small pre">{client.address}</div>
            <div className="inv-small">{client.email}</div>
          </div>
          {/* Status stamp (optional): sits between the client and the dates */}
          {invoice.status !== "none" && (
            <div className="inv-stamp-slot">
              <div className="inv-stamp">{STATUS_LABELS[invoice.status]}</div>
            </div>
          )}
          <div className="inv-dates">
            <div>
              <span className="inv-label">Issue date</span>
              <div>{showDate(invoice.issueDate)}</div>
            </div>
            <div>
              <span className="inv-label">Due date</span>
              <div>{showDate(invoice.dueDate)}</div>
            </div>
          </div>
        </section>

        {/* ----- Items ----- */}
        <table className="inv-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Qty</th>
              <th className="num">Price</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.length === 0 && (
              <tr>
                <td colSpan={4} className="inv-empty">
                  No line items
                </td>
              </tr>
            )}
            {invoice.items.map((it) => (
              <tr key={it.id}>
                <td>{it.description || "-"}</td>
                <td className="num">{Number(it.quantity) || 0}</td>
                <td className="num">{money(Number(it.rate) || 0)}</td>
                <td className="num">{money((Number(it.quantity) || 0) * (Number(it.rate) || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ----- Totals ----- */}
        <div className="inv-totals-wrap">
          <div className="inv-totals">
            <div className="line">
              <span>Subtotal</span>
              <span>{money(totals.subtotal)}</span>
            </div>
            <div className="line">
              <span>
                Discount
                {invoice.discountType === "percent" && ` (${Number(invoice.discountValue) || 0}%)`}
              </span>
              <span>- {money(totals.discount)}</span>
            </div>
            <div className="line">
              <span>Tax ({Number(invoice.taxPercent) || 0}%)</span>
              <span>{money(totals.tax)}</span>
            </div>
            <div className="line grand">
              <span>Total</span>
              <span>{money(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* ----- Notes ----- */}
        {invoice.notes.trim() && (
          <section className="inv-notes">
            <div className="inv-label">Notes / Payment terms</div>
            <div className="inv-small pre">{invoice.notes}</div>
          </section>
        )}
      </div>
    </div>
  );
}

