import React, { useState, useEffect, useRef } from 'react';

interface SessionTimerProps {
  startTime: string;
  elapsed: number;
  cost: number;
  ratePerHour: number;
  compact?: boolean;
}

function getTimerColor(hours: number): string {
  if (hours >= 4) return '#EF4444';
  if (hours >= 2) return '#F59E0B';
  return '#06B6D4';
}

const SessionTimer: React.FC<SessionTimerProps> = ({ startTime, elapsed: initialElapsed, cost: initialCost, ratePerHour, compact }) => {
  const [display, setDisplay] = useState({ elapsed: initialElapsed, cost: initialCost });
  const startTimeRef = useRef(Date.parse(startTime));
  const rafRef = useRef<number>(0);
  const initialElapsedRef = useRef(initialElapsed);
  const initialCostRef = useRef(initialCost);

  useEffect(() => {
    startTimeRef.current = Date.parse(startTime);
    initialElapsedRef.current = initialElapsed;
    initialCostRef.current = initialCost;
    setDisplay({ elapsed: initialElapsed, cost: initialCost });
  }, [startTime, initialElapsed, initialCost]);

  useEffect(() => {
    let lastTick = Date.now();

    const tick = () => {
      const now = Date.now();
      const diff = now - startTimeRef.current;
      const elapsedSec = Math.floor(diff / 1000);
      const costVal = (diff / 3600000) * ratePerHour;
      setDisplay({ elapsed: elapsedSec, cost: costVal });
      lastTick = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ratePerHour]);

  const hours = Math.floor(display.elapsed / 3600);
  const minutes = Math.floor((display.elapsed % 3600) / 60);
  const seconds = display.elapsed % 60;

  const timeString = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  const timerColor = getTimerColor(hours);

  if (compact) {
    return (
      <div className="session-timer-compact">
        <span className="timer-time" style={{ color: timerColor, textShadow: `0 0 20px ${timerColor}40` }}>
          {timeString}
        </span>
        <span className="cost-value" style={{ color: timerColor }}>
          ${display.cost.toFixed(2)}
        </span>
      </div>
    );
  }

  return (
    <div className="session-timer">
      <div className="session-timer-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={timerColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="session-timer-label" style={{ color: timerColor }}>Session Active</span>
      </div>
      <div className="session-timer-display">
        <span
          className="timer-time"
          style={{
            color: timerColor,
            textShadow: `0 0 30px ${timerColor}60, 0 0 60px ${timerColor}30`,
            fontFamily: "'Orbitron', 'SF Mono', 'Fira Code', monospace",
            fontSize: compact ? '20px' : '48px',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          {timeString}
        </span>
      </div>
      <div className="session-timer-cost">
        <span className="cost-label">Running Cost:</span>
        <span className="cost-value" style={{ color: timerColor }}>${display.cost.toFixed(2)}</span>
      </div>
      <div className="session-timer-rate">
        <span className="rate-label">Rate:</span>
        <span className="rate-value">${ratePerHour.toFixed(2)}/hr</span>
      </div>
      <div className="session-timer-start">
        <span className="start-label">Started:</span>
        <span className="start-value">{new Date(startTimeRef.current).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default SessionTimer;
