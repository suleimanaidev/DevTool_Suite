"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playFinish, playReset, playStart, playTick, unlockSound } from "../../lib/sounds";
import "./countdown.css";

const STORAGE_KEY = "countdown-settings";
const RADIUS = 96;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "25 min", seconds: 1500 },
  { label: "30 min", seconds: 1800 },
  { label: "60 min", seconds: 3600 },
];

const pad = (n) => String(n).padStart(2, "0");

// 65000 ms -> "01:05", 3665000 ms -> "1:01:05"
function formatClock(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return `${hours > 0 ? `${hours}:` : ""}${pad(minutes)}:${pad(seconds)}`;
}

export default function CountdownPage() {
  const [duration, setDuration] = useState(5 * 60); // total time in seconds
  const [remaining, setRemaining] = useState(5 * 60 * 1000); // milliseconds left
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [label, setLabel] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const endAtRef = useRef(0); // the moment the countdown should reach zero
  const doneRef = useRef(false); // stops the finish sound firing twice
  const lastTickRef = useRef(null); // last whole second we played a tick for
  const soundRef = useRef(soundOn);
  const baseTitleRef = useRef("");

  const totalMs = duration * 1000;
  const fullRing = totalMs > 0;
  const fraction = fullRing ? Math.max(0, Math.min(1, remaining / totalMs)) : 0;
  const started = remaining < totalMs;
  const urgent = running && remaining > 0 && remaining <= 10000;

  // Load the saved settings once.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && Number.isFinite(saved.duration) && saved.duration > 0) {
        const secs = Math.min(Math.floor(saved.duration), 99 * 3600 + 59 * 60 + 59);
        setDuration(secs);
        setRemaining(secs * 1000);
      }
      if (saved && typeof saved.label === "string") setLabel(saved.label.slice(0, 40));
      if (saved && typeof saved.soundOn === "boolean") setSoundOn(saved.soundOn);
    } catch {
      // Ignore bad saved data and keep the defaults.
    }
    setLoaded(true);
  }, []);

  // Remember the chosen duration, label and sound setting.
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ duration, label, soundOn }));
  }, [duration, label, soundOn, loaded]);

  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  // Tick from the clock, not by adding 1 second, so pauses and tab switches stay accurate.
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = Math.max(0, endAtRef.current - Date.now());
      setRemaining(left);

      // Tik-tik in the last 10 seconds: one short tick for each whole second.
      if (soundRef.current) {
        if (left > 0 && left <= 10000) {
          const second = Math.ceil(left / 1000);
          if (second !== lastTickRef.current) {
            lastTickRef.current = second;
            playTick(second % 2 === 1);
          }
        } else if (left > 10000) {
          lastTickRef.current = null;
        }
      }

      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        setRunning(false);
        setFinished(true);
        if (soundRef.current) playFinish();
      }
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [running]);

  // Keep the tab title useful while the timer runs (restored when it stops).
  useEffect(() => {
    baseTitleRef.current = document.title;
    return () => {
      const current = document.title;
      if (baseTitleRef.current && (current.includes(" · Countdown") || current.startsWith("Time's up!"))) {
        document.title = baseTitleRef.current;
      }
    };
  }, []);

  useEffect(() => {
    if (running) {
      document.title = `${formatClock(remaining)} · ${label.trim() || "Countdown"}`;
    } else if (finished) {
      document.title = "Time's up! · Countdown";
    } else if (baseTitleRef.current) {
      document.title = baseTitleRef.current;
    }
  }, [running, remaining, finished, label]);

  function changeDuration(seconds) {
    const clamped = Math.max(0, Math.min(Math.floor(seconds), 99 * 3600 + 59 * 60 + 59));
    setDuration(clamped);
    setRemaining(clamped * 1000);
    setFinished(false);
    setRunning(false);
    doneRef.current = false;
    lastTickRef.current = null;
  }

  function changePart(part, value) {
    const parsed = Number.parseInt(value, 10);
    const n = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    const h = Math.floor(duration / 3600);
    const m = Math.floor(duration / 60) % 60;
    const s = duration % 60;
    if (part === "hours") changeDuration(Math.min(n, 99) * 3600 + m * 60 + s);
    else if (part === "minutes") changeDuration(h * 3600 + Math.min(n, 59) * 60 + s);
    else changeDuration(h * 3600 + m * 60 + Math.min(n, 59));
  }

  function start() {
    if (duration <= 0) return;
    const ms = remaining > 0 ? remaining : totalMs;
    doneRef.current = false;
    lastTickRef.current = null;
    unlockSound();
    if (soundOn) playStart();
    setFinished(false);
    endAtRef.current = Date.now() + ms;
    setRunning(true);
  }

  function pause() {
    setRemaining(Math.max(0, endAtRef.current - Date.now()));
    setRunning(false);
  }

  function reset() {
    unlockSound();
    if (soundOn) playReset();
    lastTickRef.current = null;
    setRunning(false);
    setFinished(false);
    doneRef.current = false;
    setRemaining(totalMs);
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    if (next) unlockSound();
  }

  // Space starts or pauses the timer (except while typing in a field or using a button).
  useEffect(() => {
    function onKeyDown(e) {
      const el = e.target;
      const tag = el && el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || (el && el.isContentEditable)) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        if (running) pause();
        else start();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [running, remaining, duration, soundOn, totalMs]);

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60) % 60;
  const seconds = duration % 60;
  const status = finished ? "Time's up!" : running ? "Counting down" : started ? "Paused" : "Ready";
  const startLabel = finished ? "Start again" : started ? "Resume" : "Start";

  return (
    <>
      <div className="page-title">
        <h1>Countdown Timer</h1>
        <p className="muted">Set any duration and count down to zero. The timer keeps running if you switch tabs.</p>
      </div>

      <div className="cd-layout">
        <div className={`card cd-display-card ${finished ? "finished" : ""}`}>
          {label.trim() && <div className="cd-label">{label.trim()}</div>}

          <div className="cd-ring-wrap">
            <svg className="cd-ring" viewBox="0 0 240 240" aria-hidden="true">
              <circle className="cd-ring-bg" cx="120" cy="120" r={RADIUS} />
              <circle
                className={`cd-ring-progress ${urgent ? "urgent" : ""}`}
                cx="120"
                cy="120"
                r={RADIUS}
                transform="rotate(-90 120 120)"
                style={{
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: CIRCUMFERENCE * (1 - fraction),
                }}
              />
            </svg>
            <div className="cd-center">
              <motion.div
                className={`cd-time ${urgent ? "urgent" : ""} ${duration >= 3600 ? "long" : ""}`}
                role="timer"
                aria-live="off"
                animate={finished ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {formatClock(remaining)}
              </motion.div>
              <div className={`cd-status ${finished ? "finished" : ""}`} aria-live="polite">
                {status}
              </div>
            </div>
          </div>

          <div className="cd-controls">
            {running ? (
              <button className="btn btn-primary cd-main" onClick={pause}>
                Pause
              </button>
            ) : (
              <button className="btn btn-primary cd-main" onClick={start} disabled={duration <= 0}>
                {startLabel}
              </button>
            )}
            <button className="btn cd-main" onClick={reset} disabled={!started && !finished && !running}>
              Reset
            </button>
          </div>

          <p className="muted cd-hint">Press Space to start or pause</p>
        </div>

        <div className="card cd-settings">
          <h2>Set the time</h2>
          <div className="cd-duration">
            <div>
              <label htmlFor="cd-hours">Hours</label>
              <input
                id="cd-hours"
                type="number"
                min="0"
                max="99"
                inputMode="numeric"
                value={hours}
                onChange={(e) => changePart("hours", e.target.value)}
                disabled={running}
              />
            </div>
            <div>
              <label htmlFor="cd-minutes">Minutes</label>
              <input
                id="cd-minutes"
                type="number"
                min="0"
                max="59"
                inputMode="numeric"
                value={minutes}
                onChange={(e) => changePart("minutes", e.target.value)}
                disabled={running}
              />
            </div>
            <div>
              <label htmlFor="cd-seconds">Seconds</label>
              <input
                id="cd-seconds"
                type="number"
                min="0"
                max="59"
                inputMode="numeric"
                value={seconds}
                onChange={(e) => changePart("seconds", e.target.value)}
                disabled={running}
              />
            </div>
          </div>

          <h3>Quick presets</h3>
          <div className="cd-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.seconds}
                className={`btn btn-sm ${duration === preset.seconds ? "active" : ""}`}
                onClick={() => changeDuration(preset.seconds)}
                disabled={running}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="field">
            <label htmlFor="cd-label">Label (optional)</label>
            <input
              id="cd-label"
              type="text"
              value={label}
              maxLength={40}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Tea, Exam, Workout"
            />
          </div>

          <label className="cd-check" htmlFor="cd-sound">
            <input id="cd-sound" type="checkbox" checked={soundOn} onChange={toggleSound} />
            <span>Play sounds</span>
          </label>

          <p className="muted cd-note">
            Changing the time resets the countdown. Start and reset play a short tone, the last 10 seconds tick, and a
            chime marks the end. Your settings are saved in this browser.
          </p>
        </div>
      </div>
    </>
  );
}
