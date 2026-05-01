import React, { useState, useEffect } from 'react';
import './Pomodoro.css';

const FOCUS_TIME = 30 * 60;
const BREAK_TIME = 5 * 60;
const TOTAL_SESSIONS = 4;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [session, setSession] = useState(1);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!isBreak) {
            setIsBreak(true);
            setTimeLeft(BREAK_TIME);
          } else {
            setIsBreak(false);
            setSession(s => Math.min(s + 1, TOTAL_SESSIONS));
            setTimeLeft(FOCUS_TIME);
          }
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  function handleStartPause() {
    setIsRunning(!isRunning);
  }

  function handleReset() {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
    setSession(1);
  }

  return (
    <div className="pomodoro">
      <div className="pomo-label">{isBreak ? 'break' : 'focus'}</div>
      <div className="pomo-time">{formatTime(timeLeft)}</div>
      <div className="pomo-dots">
        {Array.from({ length: TOTAL_SESSIONS }).map((_, i) => (
          <div key={i} className={`pomo-dot ${i < session ? 'active' : ''}`} />
        ))}
      </div>
      <div className="pomo-btns">
        <button className="pomo-btn sec" onClick={handleReset}>reset</button>
        <button className="pomo-btn" onClick={handleStartPause}>
          {isRunning ? 'pause' : 'start'}
        </button>
      </div>
    </div>
  );
}

export default Pomodoro;