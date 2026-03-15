import React, { useEffect, useState } from "react";

export default function RoundResult({ eliminatedName, wasImpostor, players, round, tally }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="result-page">
      <div className={`result-banner ${wasImpostor ? "caught" : "survived"}`}>
        {wasImpostor ? "🎉 Impostor Caught!" : "😈 Impostor Survived!"}
      </div>
      <div className="elim-card">
        <p className="elim-label">Eliminated this round:</p>
        <h2 className="elim-name">{eliminatedName}</h2>
        <p className="elim-verdict">
          {wasImpostor
            ? `${eliminatedName} was the impostor! Correct voters earn +1 point.`
            : `${eliminatedName} was NOT the impostor! The impostor earns +2 points.`}
        </p>
      </div>
      <div className="tally-section">
        <h3>Vote Tally</h3>
        {Object.entries(tally || {}).sort((a,b) => b[1]-a[1]).map(([id, count]) => {
          const player = players.find(p => p._id === id || p._id?.toString() === id);
          return (
            <div key={id} className="tally-row">
              <span>{player?.name || "Unknown"}</span>
              <div className="tally-bar-wrap">
                <div className="tally-bar" style={{ width: `${(count / players.length) * 100}%` }}/>
              </div>
              <span>{count} vote{count !== 1 ? "s" : ""}</span>
            </div>
          );
        })}
      </div>
      <div className="score-section">
        <h3>Scores</h3>
        {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
          <div key={p._id} className="score-row">
            <span className="score-rank">#{i+1}</span>
            <span className="score-name">{p.name}</span>
            <span className="score-pts">{p.score} pts</span>
          </div>
        ))}
      </div>
      <p className="next-round-msg">Next round in <strong>{countdown}s</strong>…</p>
    </div>
  );
}