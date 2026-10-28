// Helper data and functions for the Invoice Generator.

// ----- Currencies: symbol + number format locale -----
export const CURRENCIES = {
  PKR: { name: "Pakistani Rupee", symbol: "Rs", locale: "en-PK" },
  USD: { name: "US Dollar", symbol: "$", locale: "en-US" },
  EUR: { name: "Euro", symbol: "€", locale: "en-US" },
  GBP: { name: "British Pound", symbol: "£", locale: "en-GB" },
  AED: { name: "UAE Dirham", symbol: "AED", locale: "en-US" },
  SAR: { name: "Saudi Riyal", symbol: "SAR", locale: "en-US" },
  INR: { name: "Indian Rupee", symbol: "₹", locale: "en-IN" }, // INR uses lakh grouping: 1,23,456.00
};

// Example: formatMoney(1234.5, "USD") -> "$1,234.50"
export function formatMoney(amount, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.PKR;
  const number = new Intl.NumberFormat(c.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  // Word-like symbols (Rs, AED, SAR) get a space: "Rs 1,000.00"
  return /^[A-Za-z]/.test(c.symbol) ? `${c.symbol} ${number}` : `${c.symbol}${number}`;
}

// ----- Color themes -----
export const PRESET_COLORS = [
  { name: "Blue", value: "#2563eb" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Green", value: "#16a34a" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Teal", value: "#0d9488" },
  { name: "Pink", value: "#db2777" },
  { name: "Black / Gray", value: "#374151" },
];

// Pick white or dark text so it stays readable on any brand color.
export function contrastColor(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1f2937" : "#ffffff";
}

export const LAYOUTS = [
  { id: "classic", label: "Classic", hint: "Header bar" },
  { id: "modern", label: "Modern", hint: "Side stripe" },
  { id: "minimal", label: "Minimal", hint: "Clean lines" },
];

// ----- Dates / numbers -----
const pad = (n) => String(n).padStart(2, "0");

// Date -> "YYYY-MM-DD" (the format <input type="date"> uses)
export function toDateInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatInvoiceNumber(n) {
  return `INV-${String(n).padStart(4, "0")}`;
}

let idCounter = 0;
export const newId = () => `${Date.now()}-${idCounter++}`;

// ----- A fresh invoice (filled with sample data) -----
export function createSampleInvoice(number) {
  const today = new Date();
  const due = new Date();
  due.setDate(due.getDate() + 14);
  return {
    id: newId(),
    number: formatInvoiceNumber(number),
    issueDate: toDateInput(today),
    dueDate: toDateInput(due),
    business: {
      name: "Acme Studio",
      address: "12 Market Street, Springfield",
      email: "hello@acmestudio.com",
      phone: "+1 555 123 4567",
      logo: "",
    },
    client: {
      name: "Jane Smith",
      address: "45 Oak Avenue, Riverside",
      email: "jane@example.com",
    },
    items: [
      { id: newId(), description: "Website design", quantity: "1", rate: "45000" },
      { id: newId(), description: "Logo design", quantity: "1", rate: "15000" },
      { id: newId(), description: "Monthly support", quantity: "3", rate: "5000" },
    ],
    taxPercent: "5",
    discountType: "percent",
    discountValue: "10",
    currency: "PKR",
    notes: "Payment is due within 14 days.\nBank: Example Bank\nAccount No: 0123456789\nThank you for your business!",
    status: "unpaid", // "none" | "paid" | "unpaid" | "overdue"
  };
}

// ----- Maths -----
// Discount is taken off first, then tax is added on the discounted amount.
export function calculateTotals(invoice) {
  const num = (v) => Number(v) || 0;
  const subtotal = invoice.items.reduce((sum, it) => sum + num(it.quantity) * num(it.rate), 0);
  let discount =
    invoice.discountType === "percent"
      ? (subtotal * num(invoice.discountValue)) / 100
      : num(invoice.discountValue);
  discount = Math.min(discount, subtotal); // never discount more than the subtotal
  const taxable = subtotal - discount;
  const tax = (taxable * num(invoice.taxPercent)) / 100;
  return { subtotal, discount, tax, total: taxable + tax };
}

// ----- Validation: returns a list of error messages (empty = OK) -----
export function validateInvoice(invoice) {
  const errors = [];
  if (invoice.items.length === 0) errors.push("Add at least one line item.");
  if (!invoice.client.name.trim()) errors.push("Client name is required.");

  invoice.items.forEach((it, i) => {
    if (Number(it.quantity) < 0 || Number(it.rate) < 0) {
      errors.push(`Line item ${i + 1}: quantity and rate cannot be negative.`);
    }
  });
  if (Number(invoice.taxPercent) < 0) errors.push("Tax % cannot be negative.");
  if (Number(invoice.discountValue) < 0) errors.push("Discount cannot be negative.");
  if (invoice.discountType === "percent" && Number(invoice.discountValue) > 100) {
    errors.push("Discount percentage cannot be more than 100.");
  }
  return errors;
}

