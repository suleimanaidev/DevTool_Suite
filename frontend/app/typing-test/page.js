"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./typing.css";

// ---------- Built-in paragraphs (hard ones include punctuation + numbers) ----------
const PARAGRAPHS = {
  easy: [
    "The sun is warm and the sky is blue. A little cat sits on the mat and looks at the birds in the tree.",
    "I like to read books on a rainy day. My mom makes hot tea and we sit by the window and listen to the rain.",
    "We went to the park with our dog. He ran fast and played with a red ball until it was time to go home.",
    "Fish swim in the sea and birds fly in the sky. Every day is a good day to learn something new and fun.",
    "My friend has a small garden. She grows green beans and red tomatoes, and she shares them with all of us.",
  ],
  medium: [
    "Learning to code is like learning a new language. At first the rules feel strange, but with daily practice you begin to think in logic and patterns.",
    "A good developer writes code that other people can understand. Clear names, small functions and helpful comments make a project easier to maintain over time.",
    "The internet connects millions of computers around the world. When you open a website, your browser sends a request and a server sends back the page you asked for.",
    "Practice makes progress, not perfection. Every bug you fix teaches you something, and every small project you finish builds the confidence to start a bigger one.",
    "Typing quickly without looking at the keyboard takes patience. Focus on accuracy first, and your speed will naturally improve as your fingers learn where each key lives.",
  ],
  hard: [
    "In 2024, the team shipped 3 major releases; each one fixed 47+ bugs (mostly edge cases!) and improved load time by 38%. \"Ship small, ship often,\" said the lead.",
    "Function calculateTotal(items, tax = 0.15) returns: sum(price * qty) + tax. For example, 12 x $4.50 = $54.00, plus 15% = $62.10 -- not bad, right?",
    "The server responded with status 404 at 10:45 p.m.; however, after 2 retries (and 1 cache purge), it returned 200 OK in 1.8 seconds. Mystery solved? Not quite!",
    "Password rules: use 12+ characters, include @, #, or $ symbols, avoid names/dates (e.g., 1990), and never reuse old ones. Security isn't optional -- it's essential.",
    "Order #8841 contains 6 items: 2 keyboards ($89.99 each), 3 mice ($24.50 each), and 1 monitor ($219.00). Total: $470.98 -- shipping is free over $300!",
  ],
};

const TIME_OPTIONS = [15, 30, 60];
const MIN_TIME = 5;
const MAX_TIME = 3600; // 60 minutes

// 90 -> "1:30", 45 -> "45s"
function formatLeft(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}
const MIN_CUSTOM_LENGTH = 20;

// Pick a random item that is different from `current` (when possible).
function pickRandom(list, current) {
  if (list.length <= 1) return list[0];
  let next = current;
  while (next === current) next = list[Math.floor(Math.random() * list.length)];
  return next;
}

export default function TypingTest() {
  // ----- Settings -----
  const [difficulty, setDifficulty] = useState("easy");
  const [duration, setDuration] = useState(30);
  const [text, setText] = useState(PARAGRAPHS.easy[0]);
  const [activeCustomId, setActiveCustomId] = useState(null);
  const [customTime, setCustomTime] = useState("");
  const [customUnit, setCustomUnit] = useState("sec"); // "sec" or "min"
  const [timeError, setTimeError] = useState("");

  // ----- Test state -----
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [keystrokes, setKeystrokes] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // ----- Saved data -----
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [customList, setCustomList] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const inputRef = useRef(null);
  const paragraphRef = useRef(null);
  const baseRef = useRef(PARAGRAPHS.easy[0]); // first paragraph of the current round
  const lastAddedRef = useRef(PARAGRAPHS.easy[0]); // last paragraph added (to avoid repeats)
  const startTime = useRef(0);

  // Load best score and custom paragraphs from localStorage once.
  useEffect(() => {
    setBest(Number(localStorage.getItem("typing-best")) || 0);
    try {
      setCustomList(JSON.parse(localStorage.getItem("typing-custom")) || []);
    } catch {
      setCustomList([]);
    }
    setLoaded(true);
  }, []);

  // Save the custom list whenever it changes (after the first load).
  useEffect(() => {
    if (loaded) localStorage.setItem("typing-custom", JSON.stringify(customList));
  }, [customList, loaded]);

  // Timer: updates every 100ms while the test is running.
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      const secs = (Date.now() - startTime.current) / 1000;
      if (secs >= duration) {
        setElapsed(duration);
        setFinished(true);
      } else {
        setElapsed(secs);
      }
    }, 100);
    return () => clearInterval(id);
  }, [started, finished, duration]);

  // ----- Live stats -----
  const correctChars = useMemo(() => {
    let n = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) n++;
    return n;
  }, [typed, text]);

  const minutes = Math.max(elapsed, 1) / 60; // avoid huge WPM in the first second
  const wpm = started ? Math.round(correctChars / 5 / minutes) : 0;
  const accuracy = keystrokes === 0 ? 100 : Math.round(((keystrokes - mistakes) / keystrokes) * 100);
  const timeLeft = Math.max(0, Math.ceil(duration - elapsed));

  // When the test ends, check for a new personal best.
  useEffect(() => {
    if (!finished) return;
    if (wpm > best) {
      setBest(wpm);
      setNewRecord(true);
      localStorage.setItem("typing-best", String(wpm));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  // Keep the current letter in the middle of the paragraph box while it scrolls.
  useEffect(() => {
    const box = paragraphRef.current;
    const current = box?.querySelector(".current");
    if (box && current) box.scrollTop = current.offsetTop - box.clientHeight / 2;
  }, [typed, text]);

  // ----- Actions -----
  // "Restart" goes back to the first paragraph of the round (not the extra ones added while typing).
  function resetTest(nextText = baseRef.current, nextDuration = duration) {
    baseRef.current = nextText;
    lastAddedRef.current = nextText;
    setTyped("");
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setKeystrokes(0);
    setMistakes(0);
    setNewRecord(false);
    setText(nextText);
    setDuration(nextDuration);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  // Use the time typed by the user, in seconds or minutes (between 5 seconds and 60 minutes).
  function applyCustomTime() {
    const secs = Math.round(Number(customTime) * (customUnit === "min" ? 60 : 1));
    if (!secs || secs < MIN_TIME || secs > MAX_TIME) {
      setTimeError("Enter a time between 5 seconds and 60 minutes.");
      return;
    }
    setTimeError("");
    resetTest(undefined, secs);
  }

  function changeDifficulty(level) {
    setDifficulty(level);
    setActiveCustomId(null);
    resetTest(PARAGRAPHS[level][0]);
  }

  function newParagraph() {
    setActiveCustomId(null);
    resetTest(pickRandom(PARAGRAPHS[difficulty], baseRef.current));
  }

  function handleChange(e) {
    if (finished) return;
    const value = e.target.value.slice(0, text.length);

    // Start the timer on the very first keystroke.
    if (!started) {
      startTime.current = Date.now();
      setStarted(true);
    }

    // Count a keystroke only when a character was added (not on backspace).
    if (value.length > typed.length) {
      const index = value.length - 1;
      setKeystrokes((k) => k + 1);
      if (value[index] !== text[index]) setMistakes((m) => m + 1);
    }

    setTyped(value);

    // Paragraph finished but time is not up yet: add the next paragraph and keep going.
    if (value.length === text.length) {
      setText(text + " " + nextParagraph());
    }
  }

  // Pick a different paragraph from the current pool (custom list or the chosen difficulty).
  function nextParagraph() {
    const customTexts = customList.map((c) => c.text);
    const pool = activeCustomId && customTexts.length ? customTexts : PARAGRAPHS[difficulty];
    const next = pickRandom(pool, lastAddedRef.current);
    lastAddedRef.current = next;
    return next;
  }

  // ----- Custom paragraphs -----
  function addCustom() {
    const clean = customInput.trim().replace(/\s+/g, " ");
    if (clean.length < MIN_CUSTOM_LENGTH) {
      setCustomError(`Paragraph must be at least ${MIN_CUSTOM_LENGTH} characters (now ${clean.length}).`);
      return;
    }
    setCustomList([{ id: Date.now(), text: clean }, ...customList]);
    setCustomInput("");
    setCustomError("");
  }

  function selectCustom(item) {
    setActiveCustomId(item.id);
    resetTest(item.text);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteCustom(id) {
    setCustomList(customList.filter((c) => c.id !== id));
    if (activeCustomId === id) setActiveCustomId(null);
  }

  return (
    <>
      <div className="page-title">
        <h1>Typing Speed Tester</h1>
        <p className="muted">The timer starts when you type your first character.</p>
      </div>

      {/* Settings */}
      <div className="card typing-settings">
        <div className="row">
          <span className="muted">Time:</span>
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${duration === t ? "btn-primary" : ""}`}
              disabled={started && !finished}
              onClick={() => resetTest(undefined, t)}
            >
              {t}s
            </button>
          ))}
          {/* Your own time */}
          <form
            className="custom-time"
            onSubmit={(e) => {
              e.preventDefault();
              applyCustomTime();
            }}
          >
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Custom"
              aria-label="Custom time in seconds"
              value={customTime}
              disabled={started && !finished}
              onChange={(e) => setCustomTime(e.target.value)}
            />
            <select
              value={customUnit}
              aria-label="Time unit"
              disabled={started && !finished}
              onChange={(e) => setCustomUnit(e.target.value)}
            >
              <option value="sec">seconds</option>
              <option value="min">minutes</option>
            </select>
            <button
              type="submit"
              className={`btn btn-sm ${!TIME_OPTIONS.includes(duration) ? "btn-primary" : ""}`}
              disabled={started && !finished}
            >
              Set
            </button>
          </form>
        </div>
        {timeError && <p className="error-text" style={{ width: "100%", margin: 0 }}>{timeError}</p>}
        <div className="row">
          <span className="muted">Difficulty:</span>
          {["easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              className={`btn btn-sm ${difficulty === d && !activeCustomId ? "btn-primary" : ""}`}
              onClick={() => changeDifficulty(d)}
            >
              {d[0].toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Live stats */}
      <div className="stats-grid">
        <Stat label="WPM" value={wpm} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Mistakes" value={mistakes} />
        <Stat label="Time left" value={formatLeft(started ? timeLeft : duration)} />
      </div>

      {/* Paragraph + input */}
      <div className="card">
        <div className="paragraph" ref={paragraphRef} onClick={() => inputRef.current?.focus()}>
          {/* Each letter: green = correct, red = wrong, highlighted = the one to type next */}
          {text.split("").map((ch, i) => {
            let cls = "pending";
            if (i < typed.length) cls = typed[i] === ch ? "correct" : "wrong";
            else if (i === typed.length && !finished) cls = "current";
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          className="typing-input"
          value={typed}
          onChange={handleChange}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          disabled={finished}
          placeholder="Start typing here..."
          rows={3}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        <div className="row" style={{ marginTop: "0.8rem" }}>
          <button className="btn" onClick={() => resetTest()}>
            Restart
          </button>
          <button className="btn" onClick={newParagraph}>
            New paragraph
          </button>
        </div>
      </div>

      {/* Result card */}
      <AnimatePresence>
      {finished && (
        <motion.div
          className="card result-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <h2>
            Time&apos;s up!{" "}
            {newRecord && (
              <motion.span
                className="record-badge"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
              >
                New Record!
              </motion.span>
            )}
          </h2>
          <div className="stats-grid">
            <Stat label="Final WPM" value={wpm} />
            <Stat label="Accuracy" value={`${accuracy}%`} />
            <Stat label="Mistakes" value={mistakes} />
          </div>
          <p className="muted">Best WPM: {best}</p>
          <button className="btn btn-primary" onClick={() => resetTest()}>
            Try again
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="best-line muted">Personal best: {best} WPM</div>

      {/* Custom paragraphs */}
      <div className="card" style={{ marginTop: "1.25rem" }}>
        <h2>Custom paragraphs</h2>
        <p className="muted">Add your own text to practice with (minimum {MIN_CUSTOM_LENGTH} characters).</p>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Paste or write your own paragraph..."
          rows={3}
        />
        {customError && <p className="error-text">{customError}</p>}
        <button className="btn btn-primary" style={{ marginTop: "0.6rem" }} onClick={addCustom}>
          + Add
        </button>

        {customList.length > 0 && (
          <ul className="custom-list">
            <AnimatePresence initial={false}>
            {customList.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={activeCustomId === c.id ? "active" : ""}
              >
                <button className="custom-text" onClick={() => selectCustom(c)} title="Click to practice">
                  {c.text.length > 120 ? c.text.slice(0, 120) + "..." : c.text}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteCustom(c.id)}>
                  Delete
                </button>
              </motion.li>
            ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </>
  );
}

// Small box showing one number.
function Stat({ label, value }) {
  return (
    <div className="card stat">
      <div className="stat-value gradient-text">{value}</div>
      <div className="muted">{label}</div>
    </div>
  );
}


