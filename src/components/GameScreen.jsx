import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";

export default function GameScreen({
  role, word, round, totalRounds,
  players = [], playerId,
  currentTurnId: initialTurnId,
  currentTurnName: initialTurnName,
  onSubmit,
}) {
  const [text, setText]           = useState("");
  const [done, setDone]           = useState(false);
  const [timeLeft, setTimeLeft]   = useState(60);
  const [revealedDescs, setRevealedDescs]         = useState([]);
  const [currentTurnId, setCurrentTurnId]         = useState(initialTurnId || null);
  const [currentTurnName, setCurrentTurnName]     = useState(initialTurnName || "");
  const timerRef = useRef(null);

  const isMyTurn   = currentTurnId?.toString() === playerId?.toString();
  const isImpostor = role === "impostor";

  // Sync when parent sends initial turn info
  useEffect(() => {
    if (initialTurnId) {
      setCurrentTurnId(initialTurnId);
      setCurrentTurnName(initialTurnName || "");
    }
  }, [initialTurnId, initialTurnName]);

  // Socket listeners
  useEffect(() => {
    socket.on("turnChanged", ({ currentTurnId: tid, currentTurnName: tname, descriptions }) => {
      setCurrentTurnId(tid);
      setCurrentTurnName(tname || "");
      if (descriptions) setRevealedDescs(descriptions);
      setTimeLeft(60);
    });

    socket.on("descriptionRevealed", ({ playerId: pid, playerName, text: t }) => {
      setRevealedDescs(prev => {
        if (prev.find(d => d.playerId?.toString() === pid?.toString())) return prev;
        return [...prev, { playerId: pid, playerName, text: t }];
      });
    });

    return () => {
      socket.off("turnChanged");
      socket.off("descriptionRevealed");
    };
  }, []);

  // Timer — only when it's your turn
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!isMyTurn || done) return;
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setDone(true);
          onSubmit("...");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isMyTurn, currentTurnId, done]);

  const handleSubmit = () => {
    if (!text.trim() || done) return;
    clearInterval(timerRef.current);
    setDone(true);
    onSubmit(text.trim());
  };

  const timerColor = timeLeft <= 10 ? "#e63946" : timeLeft <= 20 ? "#ff9f1c" : "#2ec4b6";

  return (
    <div className="game-page">
      {/* Top bar */}
      <div className="game-topbar">
        <div className="round-badge">Round {round} / {totalRounds}</div>
        {isMyTurn ? (
          <div className="timer-ring">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#1e2535" strokeWidth="4"/>
              <circle cx="24" cy="24" r="20" fill="none"
                stroke={timerColor} strokeWidth="4"
                strokeDasharray={`${(timeLeft / 60) * 125.6} 125.6`}
                strokeLinecap="round" transform="rotate(-90 24 24)"
                style={{ transition: "stroke-dasharray 1s linear" }}
              />
            </svg>
            <span className="timer-num" style={{ color: timerColor }}>{timeLeft}</span>
          </div>
        ) : <div style={{ width: 64 }} />}
        <div className="sub-count">{revealedDescs.length}/{players.length} described</div>
      </div>

      {/* Word card */}
      <div className={`word-card ${isImpostor ? "impostor-card" : "crewmate-card"}`}>
        <p className="role-label">{isImpostor ? "🕵️ You are the IMPOSTOR" : "🧑‍🚀 Your secret word is"}</p>
        <h2 className="secret-word">{word}</h2>
        {isImpostor && <p className="impostor-hint">Blend in! Describe something that fits without revealing you don't know the real word.</p>}
      </div>

      {/* Turn indicator */}
      <div className="turn-indicator">
        {isMyTurn ? (
          <div className="your-turn-banner">⚡ It's YOUR turn to describe!</div>
        ) : (
          <div className="waiting-turn-banner">
            ⏳ Waiting for <strong>{currentTurnName || "..."}</strong> to describe…
          </div>
        )}
      </div>

      {/* Input box — only on your turn */}
      {isMyTurn && !done && (
        <div className="desc-section">
          <label className="desc-label">Describe in one sentence:</label>
          <textarea
            className="desc-input"
            placeholder={isImpostor ? "Blend in with a vague description…" : `Describe "${word}" in one sentence…`}
            maxLength={120}
            rows={3}
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
          <div className="desc-footer">
            <span className="char-count">{text.length}/120</span>
            <button className="btn btn-submit" onClick={handleSubmit} disabled={!text.trim()}>
              Submit →
            </button>
          </div>
        </div>
      )}

      {/* Submitted confirmation */}
      {done && <div className="submitted-msg">✓ Submitted! Waiting for others…</div>}

      {/* Revealed descriptions */}
      {revealedDescs.length > 0 && (
        <div className="desc-board" style={{ marginTop: "1rem", width: "100%", maxWidth: "600px" }}>
          {revealedDescs.map((d, i) => (
            <div key={i} className={`desc-card ${d.playerId?.toString() === playerId?.toString() ? "mine-desc" : ""}`}>
              <div className="desc-author">
                <div className="chip-av" style={{ background: avatarColor(i) }}>
                  {(d.playerName || "?")[0].toUpperCase()}
                </div>
                <strong>{d.playerName}</strong>
                {d.playerId?.toString() === playerId?.toString() && <span className="you-tag">YOU</span>}
              </div>
              <p className="desc-text">"{d.text}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Player status row */}
      <div className="players-status" style={{ marginTop: "1rem" }}>
        {players.map((p, i) => {
          const pid         = p?._id || p;
          const hasDesc     = revealedDescs.some(d => d.playerId?.toString() === pid?.toString());
          const isTheirTurn = currentTurnId?.toString() === pid?.toString();
          return (
            <div key={String(pid)} className={`status-chip
              ${pid?.toString() === playerId?.toString() ? "you-chip" : ""}
              ${isTheirTurn ? "active-chip" : ""}
              ${hasDesc ? "done-chip" : ""}
            `}>
              <div className="chip-av" style={{ background: avatarColor(i) }}>
                {(p?.name || "?")[0].toUpperCase()}
              </div>
              <span>{p?.name || "Player"}</span>
              {hasDesc     && <span style={{ color:"#2ec4b6", marginLeft:"4px" }}>✓</span>}
              {isTheirTurn && !hasDesc && <span style={{ color:"#ff9f1c", marginLeft:"4px" }}>✍️</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COLORS = ["#e63946","#457b9d","#2ec4b6","#ff9f1c","#8338ec","#06d6a0","#ef476f","#118ab2"];
function avatarColor(i) { return COLORS[i % COLORS.length]; }