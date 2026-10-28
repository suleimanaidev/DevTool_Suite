"use client";

import { useEffect, useReducer, useState } from "react";
import "./calculator.css";

const STORAGE_KEY = "calculator-history";
const MAX_HISTORY = 30;
const MAX_DIGITS = 15;

const initialState = {
  display: "0",
  stored: null,
  operator: null,
  waiting: false,
  expression: "",
  lastOp: null,
  lastOperand: null,
  error: false,
  history: [],
  nextId: 1,
};

function compute(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

// Plain number string (no grouping) used for state and parsing.
function formatNumber(value) {
  if (!Number.isFinite(value)) return "Error";
  if (Object.is(value, -0)) return "0";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-9)) {
    return value.toExponential(6).replace(/\.?0+e/, "e");
  }
  return String(Number.parseFloat(value.toPrecision(12)));
}

// Add thousands separators for the screen only.
function formatForDisplay(value) {
  if (value === "Error") return value;
  const [integer, decimals] = String(value).split(".");
  const sign = integer.startsWith("-") ? "-" : "";
  const digits = sign ? integer.slice(1) : integer;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + grouped + (decimals !== undefined ? `.${decimals}` : "");
}

function resetWithHistory(state, extra = {}) {
  return { ...initialState, history: state.history, nextId: state.nextId, ...extra };
}

function reducer(state, action) {
  switch (action.type) {
    case "digit": {
      if (state.error) {
        return resetWithHistory(state, { display: action.value });
      }
      if (state.waiting) {
        return {
          ...state,
          display: action.value,
          waiting: false,
          expression: state.operator ? state.expression : "",
          lastOp: null,
          lastOperand: null,
        };
      }
      if (state.display === "0") {
        return { ...state, display: action.value, lastOp: null, lastOperand: null };
      }
      if (state.display === "-0") {
        return {
          ...state,
          display: action.value === "0" ? "-0" : `-${action.value}`,
          lastOp: null,
          lastOperand: null,
        };
      }
      if (state.display.replace(/[-.]/g, "").length >= MAX_DIGITS) return state;
      return { ...state, display: state.display + action.value, lastOp: null, lastOperand: null };
    }

    case "decimal": {
      if (state.error) return resetWithHistory(state, { display: "0." });
      if (state.waiting) {
        return {
          ...state,
          display: "0.",
          waiting: false,
          expression: state.operator ? state.expression : "",
          lastOp: null,
          lastOperand: null,
        };
      }
      if (state.display.includes(".")) return state;
      return { ...state, display: `${state.display}.`, lastOp: null, lastOperand: null };
    }

    case "clear":
      return { ...initialState, history: state.history, nextId: state.nextId };

    case "backspace": {
      if (state.error) return { ...initialState, history: state.history, nextId: state.nextId };
      if (state.waiting) return state;
      const next =
        state.display.length <= 1 || (state.display.length === 2 && state.display.startsWith("-"))
          ? "0"
          : state.display.slice(0, -1);
      return { ...state, display: next };
    }

    case "sign": {
      if (state.error) return state;
      // Just after an operator, start a negative operand.
      if (state.operator !== null && state.stored !== null && state.waiting) {
        return { ...state, display: "-0", waiting: false, lastOp: null, lastOperand: null };
      }
      if (state.display === "0") return state;
      const negated = state.display.startsWith("-") ? state.display.slice(1) : `-${state.display}`;
      return { ...state, display: negated, lastOp: null, lastOperand: null };
    }

    case "percent": {
      if (state.error) return state;
      const value = Number.parseFloat(state.display);
      if (!Number.isFinite(value)) return state;
      // For + and −, percent means a share of the first number (200 + 10% = 220).
      const fromStored = state.stored !== null && (state.operator === "+" || state.operator === "−");
      const converted = fromStored ? state.stored * (value / 100) : value / 100;
      return {
        ...state,
        display: formatNumber(converted),
        waiting: true,
        lastOp: null,
        lastOperand: null,
      };
    }

    case "operator": {
      if (state.error) return state;
      const value = Number.parseFloat(state.display);
      if (!Number.isFinite(value)) return state;
      const nextOp = action.value;

      if (state.operator !== null && state.stored !== null) {
        // Pressing another operator just switches it.
        if (state.waiting) {
          return {
            ...state,
            operator: nextOp,
            expression: `${formatForDisplay(formatNumber(state.stored))} ${nextOp}`,
          };
        }
        // Otherwise finish the pending operation first.
        const result = compute(state.stored, value, state.operator);
        if (!Number.isFinite(result)) {
          return resetWithHistory(state, {
            display: "Error",
            error: true,
            expression: "Cannot divide by zero",
          });
        }
        const formatted = formatNumber(result);
        return {
          ...state,
          display: formatted,
          stored: result,
          operator: nextOp,
          waiting: true,
          expression: `${formatForDisplay(formatted)} ${nextOp}`,
          lastOp: null,
          lastOperand: null,
        };
      }

      return {
        ...state,
        stored: value,
        operator: nextOp,
        waiting: true,
        expression: `${formatForDisplay(formatNumber(value))} ${nextOp}`,
        lastOp: null,
        lastOperand: null,
      };
    }

    case "equals": {
      if (state.error) return state;
      const value = Number.parseFloat(state.display);
      if (!Number.isFinite(value)) return state;

      let left;
      let operand;
      let op;

      if (state.operator !== null && state.stored !== null) {
        left = state.stored;
        operand = value;
        op = state.operator;
      } else if (state.lastOp !== null && state.lastOperand !== null) {
        // Pressing = again repeats the last operation.
        left = value;
        operand = state.lastOperand;
        op = state.lastOp;
      } else {
        return { ...state, expression: `${formatForDisplay(state.display)} =`, waiting: true };
      }

      const result = compute(left, operand, op);
      if (!Number.isFinite(result)) {
        return resetWithHistory(state, {
          display: "Error",
          error: true,
          expression: "Cannot divide by zero",
        });
      }

      const expression = `${formatForDisplay(formatNumber(left))} ${op} ${formatForDisplay(formatNumber(operand))}`;
      const entry = {
        id: state.nextId,
        expression,
        result: formatNumber(result),
      };

      return {
        ...state,
        display: formatNumber(result),
        stored: null,
        operator: null,
        waiting: true,
        expression: `${expression} =`,
        lastOp: op,
        lastOperand: operand,
        history: [entry, ...state.history].slice(0, MAX_HISTORY),
        nextId: state.nextId + 1,
      };
    }

    case "load-history": {
      const maxId = action.history.reduce((max, entry) => Math.max(max, entry.id || 0), 0);
      return { ...state, history: action.history, nextId: Math.max(state.nextId, maxId + 1) };
    }

    case "clear-history":
      return { ...state, history: [] };

    case "use-result":
      return {
        ...state,
        display: action.value,
        stored: null,
        operator: null,
        waiting: true,
        expression: "",
        lastOp: null,
        lastOperand: null,
        error: false,
      };

    default:
      return state;
  }
}

export default function CalculatorPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Load the saved history once.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) {
        const history = saved
          .filter((entry) => entry && typeof entry.expression === "string" && typeof entry.result === "string")
          .slice(0, MAX_HISTORY)
          .map((entry, i) => ({
            id: Number.isFinite(entry.id) ? entry.id : i + 1,
            expression: entry.expression,
            result: entry.result,
          }));
        dispatch({ type: "load-history", history });
      }
    } catch {
      // Ignore bad saved data.
    }
    setHistoryLoaded(true);
  }, []);

  // Save history after every finished calculation or clear.
  useEffect(() => {
    if (historyLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
  }, [state.history, historyLoaded]);

  // Keyboard support. Escape clears, Enter calculates, Backspace deletes.
  useEffect(() => {
    function onKeyDown(e) {
      const el = e.target;
      const tag = el && el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (el && el.isContentEditable)) return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        dispatch({ type: "digit", value: e.key });
        return;
      }

      switch (e.key) {
        case ".":
        case ",":
          e.preventDefault();
          dispatch({ type: "decimal" });
          break;
        case "+":
          e.preventDefault();
          dispatch({ type: "operator", value: "+" });
          break;
        case "-":
          e.preventDefault();
          dispatch({ type: "operator", value: "−" });
          break;
        case "*":
        case "x":
        case "X":
          e.preventDefault();
          dispatch({ type: "operator", value: "×" });
          break;
        case "/":
          e.preventDefault();
          dispatch({ type: "operator", value: "÷" });
          break;
        case "Enter":
        case "=":
          e.preventDefault();
          dispatch({ type: "equals" });
          break;
        case "Backspace":
          e.preventDefault();
          dispatch({ type: "backspace" });
          break;
        case "Escape":
          e.preventDefault();
          dispatch({ type: "clear" });
          break;
        case "%":
          e.preventDefault();
          dispatch({ type: "percent" });
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shown = state.error ? "Error" : formatForDisplay(state.display);
  const sizeClass = shown.length > 18 ? "tiny" : shown.length > 12 ? "small" : "";
  const expressionText = state.error
    ? "Cannot divide by zero"
    : state.operator !== null && state.stored !== null
      ? `${formatForDisplay(formatNumber(state.stored))} ${state.operator}${
          state.waiting ? "" : ` ${formatForDisplay(state.display)}`
        }`
      : state.expression;

  const operatorClass = (op) => `calc-key op ${state.operator === op ? "active" : ""}`;

  return (
    <>
      <div className="page-title">
        <h1>Calculator</h1>
        <p className="muted">Quick everyday arithmetic with a saved history and full keyboard support.</p>
      </div>

      <div className="calc-layout">
        <div className="card calc-card">
          <div className="calc-screen">
            <div className="calc-expression" aria-hidden="true">
              {expressionText || "\u00A0"}
            </div>
            <div className={`calc-display ${sizeClass}`} aria-live="polite" aria-atomic="true">
              {shown}
            </div>
          </div>

          <div className="calc-keys">
            <button className="calc-key fn" onClick={() => dispatch({ type: "clear" })} aria-label="Clear">
              AC
            </button>
            <button className="calc-key fn" onClick={() => dispatch({ type: "backspace" })} aria-label="Backspace">
              ⌫
            </button>
            <button className="calc-key fn" onClick={() => dispatch({ type: "percent" })} aria-label="Percent">
              %
            </button>
            <button
              className={operatorClass("÷")}
              onClick={() => dispatch({ type: "operator", value: "÷" })}
              aria-label="Divide"
            >
              ÷
            </button>

            {["7", "8", "9"].map((digit) => (
              <button
                key={digit}
                className="calc-key"
                onClick={() => dispatch({ type: "digit", value: digit })}
                aria-label={digit}
              >
                {digit}
              </button>
            ))}
            <button
              className={operatorClass("×")}
              onClick={() => dispatch({ type: "operator", value: "×" })}
              aria-label="Multiply"
            >
              ×
            </button>

            {["4", "5", "6"].map((digit) => (
              <button
                key={digit}
                className="calc-key"
                onClick={() => dispatch({ type: "digit", value: digit })}
                aria-label={digit}
              >
                {digit}
              </button>
            ))}
            <button
              className={operatorClass("−")}
              onClick={() => dispatch({ type: "operator", value: "−" })}
              aria-label="Minus"
            >
              −
            </button>

            {["1", "2", "3"].map((digit) => (
              <button
                key={digit}
                className="calc-key"
                onClick={() => dispatch({ type: "digit", value: digit })}
                aria-label={digit}
              >
                {digit}
              </button>
            ))}
            <button
              className={operatorClass("+")}
              onClick={() => dispatch({ type: "operator", value: "+" })}
              aria-label="Plus"
            >
              +
            </button>

            <button className="calc-key fn" onClick={() => dispatch({ type: "sign" })} aria-label="Change sign">
              ±
            </button>
            <button className="calc-key" onClick={() => dispatch({ type: "digit", value: "0" })} aria-label="Zero">
              0
            </button>
            <button className="calc-key" onClick={() => dispatch({ type: "decimal" })} aria-label="Decimal point">
              .
            </button>
            <button className="calc-key equals" onClick={() => dispatch({ type: "equals" })} aria-label="Equals">
              =
            </button>
          </div>

          <p className="muted calc-hint">
            Keyboard: 0–9, + − * /, Enter to calculate, Backspace to delete, Esc to clear.
          </p>
        </div>

        <div className="card calc-history">
          <div className="calc-history-head">
            <h2>History</h2>
            {state.history.length > 0 && (
              <button className="btn btn-sm" onClick={() => dispatch({ type: "clear-history" })}>
                Clear
              </button>
            )}
          </div>

          {state.history.length === 0 ? (
            <p className="calc-history-empty">
              Finished calculations will appear here. Click one to use its result again.
            </p>
          ) : (
            <div className="calc-history-list">
              {state.history.map((entry) => (
                <button
                  key={entry.id}
                  className="calc-history-item"
                  onClick={() => dispatch({ type: "use-result", value: entry.result })}
                  title="Use this result"
                >
                  <span className="calc-history-expr">{entry.expression} =</span>
                  <span className="calc-history-result">{formatForDisplay(entry.result)}</span>
                </button>
              ))}
            </div>
          )}

          <p className="muted calc-history-note">Your history is saved in this browser.</p>
        </div>
      </div>
    </>
  );
}
