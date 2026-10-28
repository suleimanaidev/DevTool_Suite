"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playLap, playReset, playStart } from "../../lib/sounds";
import "./stopwatch.css";

// 83456 ms -> "01:23.45" (and "1:01:23.45" after one hour)
function formatTime(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60) % 60;
  const hours = Math.floor(totalSec / 3600);
  const two = (n) => String(n).padStart(2, "0");
  return `${hours > 0 ? hours + ":" : ""}${two(min)}:${two(sec)}.${two(cs)}`;
}

export default function StopwatchPage() {
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]); // newest first: { n, split, total }
  const startRef = useRef(0); // the moment (Date.now) that elapsed = 0 would have been

  // While running, refresh the display every 10 ms.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 10);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    playStart();
    startRef.current = Date.now() - elapsed; // continue from where we paused
    setRunning(true);
  }

  function pause() {
    setElapsed(Date.now() - startRef.current);
    setRunning(false);
  }

  function reset() {
    playReset();
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  function lap() {
    playLap();
    const total = Date.now() - startRef.current;
    const previousTotal = laps.length ? laps[0].total : 0;
    setLaps([{ n: laps.length + 1, split: total - previousTotal, total }, ...laps]);
  }

  // Highlight the fastest and slowest lap (needs at least 2 laps).
  const splits = laps.map((l) => l.split);
  const fastest = laps.length > 1 ? Math.min(...splits) : null;
  const slowest = laps.length > 1 ? Math.max(...splits) : null;

  return (
    <>
      <div className="page-title">
        <h1>Stopwatch</h1>
        <p className="muted">Start, pause and record lap times.</p>
      </div>

      <div className="card stopwatch-card">
        <motion.div
          className={`sw-display ${running ? "running" : ""}`}
          animate={running ? { scale: [1, 1.01, 1] } : { scale: 1 }}
          transition={{ repeat: running ? Infinity : 0, duration: 1 }}
        >
          {formatTime(elapsed)}
        </motion.div>

        <div className="sw-buttons">
          {running ? (
            <button className="btn btn-primary sw-main" onClick={pause}>
              Pause
            </button>
          ) : (
            <button className="btn btn-primary sw-main" onClick={start}>
              {elapsed > 0 ? "Resume" : "Start"}
            </button>
          )}
          <button className="btn sw-main" onClick={lap} disabled={!running}>
            Lap
          </button>
          <button className="btn btn-danger sw-main" onClick={reset} disabled={elapsed === 0 && !running}>
            Reset
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.25rem" }}>
        <h2>Laps ({laps.length})</h2>
        {laps.length === 0 && <p className="muted">Press Lap while the stopwatch is running to record a lap.</p>}

        {laps.length > 0 && (
          <div className="lap-table">
            <div className="lap-row lap-head">
              <span>Lap</span>
              <span>Lap time</span>
              <span>Total</span>
            </div>
            <AnimatePresence initial={false}>
              {laps.map((l) => (
                <motion.div
                  key={l.n}
                  className={`lap-row ${l.split === fastest ? "fast" : ""} ${l.split === slowest ? "slow" : ""}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <span>
                    Lap {l.n}{l.split === fastest && " (fastest)"}{l.split === slowest && " (slowest)"}
                  </span>
                  <span>{formatTime(l.split)}</span>
                  <span>{formatTime(l.total)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
