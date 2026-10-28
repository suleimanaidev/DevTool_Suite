"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "../../components/Toast";
import "./word-counter.css";

const STORAGE_KEY = "word-counter-text";

// Very common words are left out so the "most used words" list is actually useful.
const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "had", "her", "was",
  "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now",
  "old", "see", "two", "way", "who", "did", "she", "use", "that", "with", "have", "this",
  "will", "your", "from", "they", "know", "want", "been", "good", "much", "some", "time",
  "very", "when", "come", "here", "just", "like", "long", "make", "many", "more", "only",
  "over", "such", "take", "than", "them", "well", "were", "what", "into", "also", "about",
  "would", "there", "their", "which", "could", "other", "these", "those", "then", "being",
  "because", "after", "before", "should", "through", "where", "while", "again", "between",
  "during", "without", "under", "above", "below", "once", "same", "both", "each", "few",
  "most", "own", "too", "don", "doesn", "didn", "isn", "aren", "wasn", "weren", "won",
]);

// 95 seconds -> "1 min 35 sec"
function formatDuration(seconds) {
  if (!seconds) return "0 sec";
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) return rest ? `${minutes} min ${rest} sec` : `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return restMinutes ? `${hours} hr ${restMinutes} min` : `${hours} hr`;
}

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  // Load the saved draft (if any) on first render.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setText(saved);
    setLoaded(true);
  }, []);

  // Auto-save every change.
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, text);
  }, [text, loaded]);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed
      ? (text.match(/[^.!?]+[.!?]*/g) || []).filter((part) => /[\p{L}\p{N}]/u.test(part)).length
      : 0;
    const paragraphs = trimmed ? text.split(/\n\s*\n/).filter((part) => part.trim()).length : 0;
    return {
      words,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      sentences,
      paragraphs,
      lines: text ? text.split("\n").length : 0,
      readingSeconds: words ? Math.ceil((words / 200) * 60) : 0,
      speakingSeconds: words ? Math.ceil((words / 130) * 60) : 0,
    };
  }, [text]);

  const topWords = useMemo(() => {
    if (!stats.words) return [];
    const counts = new Map();
    const matches = text.toLowerCase().match(/[\p{L}][\p{L}\p{N}'’-]*/gu) || [];
    for (const raw of matches) {
      const word = raw.replace(/^['’-]+|['’-]+$/g, "");
      if (word.length < 3 || STOP_WORDS.has(word)) continue;
      counts.set(word, (counts.get(word) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([word, count]) => ({ word, count, percent: (count / stats.words) * 100 }));
  }, [text, stats.words]);

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1800);
  }

  async function copyText() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      flash("Text copied!");
    } catch {
      flash("Copy failed - your browser blocked it.");
    }
  }

  function clearText() {
    setText("");
    flash("Text cleared.");
  }

  return (
    <>
      <div className="page-title">
        <h1>Word Counter</h1>
        <p className="muted">Count words, characters and reading time as you type. Your text stays in this browser.</p>
      </div>
      <Toast message={message} />

      <div className="wc-stats">
        <div className="card wc-stat primary">
          <div className="wc-stat-value">{stats.words.toLocaleString()}</div>
          <div className="wc-stat-label">Words</div>
        </div>
        <div className="card wc-stat">
          <div className="wc-stat-value">{stats.characters.toLocaleString()}</div>
          <div className="wc-stat-label">Characters</div>
        </div>
        <div className="card wc-stat">
          <div className="wc-stat-value">{formatDuration(stats.readingSeconds)}</div>
          <div className="wc-stat-label">Reading time</div>
          <div className="wc-stat-hint">at 200 words per minute</div>
        </div>
        <div className="card wc-stat">
          <div className="wc-stat-value">{stats.charactersNoSpaces.toLocaleString()}</div>
          <div className="wc-stat-label">No spaces</div>
        </div>
        <div className="card wc-stat">
          <div className="wc-stat-value">{stats.sentences.toLocaleString()}</div>
          <div className="wc-stat-label">Sentences</div>
        </div>
        <div className="card wc-stat">
          <div className="wc-stat-value">{stats.paragraphs.toLocaleString()}</div>
          <div className="wc-stat-label">Paragraphs</div>
        </div>
      </div>

      <div className="card">
        <div className="wc-toolbar">
          <h2>Your text</h2>
          <div className="row">
            <button className="btn btn-sm" onClick={copyText} disabled={!text}>
              Copy
            </button>
            <button className="btn btn-sm btn-danger" onClick={clearText} disabled={!text}>
              Clear
            </button>
          </div>
        </div>

        <textarea
          className="wc-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          spellCheck={false}
          aria-label="Text to count"
        />

        <div className="wc-foot">
          <span className="muted">
            {stats.lines.toLocaleString()} {stats.lines === 1 ? "line" : "lines"} ·{" "}
            {formatDuration(stats.speakingSeconds)} speaking time
          </span>
          <span className="muted">Saved in this browser</span>
        </div>
      </div>

      <div className="card wc-keywords-card">
        <div className="wc-keywords-head">
          <h2>Most used words</h2>
          <span className="muted">Common short words are ignored</span>
        </div>
        {topWords.length === 0 ? (
          <p className="muted">Start typing to see your most used words.</p>
        ) : (
          <div className="wc-chips">
            {topWords.map((item) => (
              <span key={item.word} className="wc-chip">
                <b>{item.word}</b>
                {item.count}× <span>{item.percent.toFixed(1)}%</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
