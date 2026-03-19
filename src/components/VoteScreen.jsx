import React, { useState } from "react";
import { playPop } from "../utils/sounds";
export default function VoteScreen({
  descriptions = [],
  players = [],
  playerId,
  votedCount = 0,
  totalCount = 0,
  round = 1,
  totalRounds = 3,
  onVote,
}) {
  const [voted, setVoted] = useState(null);

  const handleVote = (targetId) => {
  if (voted) return;
  setVoted(targetId);
  playPop();
  onVote(targetId);
};

  return (
    <div className="vote-page">
      <div className="vote-header">
        <div className="round-badge">Round {round} / {totalRounds}</div>
        <h2 className="vote-title">🗳️ Who is the Impostor?</h2>
        <p className="vote-sub">Read the descriptions carefully and vote!</p>
        <div className="vote-progress">
          <div className="vote-bar" style={{ width: `${totalCount > 0 ? (votedCount/totalCount)*100 : 0}%` }}/>
        </div>
        <p className="vote-count">{votedCount}/{totalCount} voted</p>
      </div>

      {/* All descriptions shown */}
      <div className="desc-board">
        {descriptions.map((d, i) => (
          <div key={i} className={`desc-card ${d.playerId?.toString() === playerId?.toString() ? "mine-desc" : ""}`}>
            <div className="desc-author">
              <div className="chip-av" style={{ background: avatarColor(i) }}>
                {(d.playerName || "?")[0].toUpperCase()}
              </div>
              <strong>{d.playerName || "Unknown"}</strong>
              {d.playerId?.toString() === playerId?.toString() && <span className="you-tag">YOU</span>}
            </div>
            <p className="desc-text">"{d.text}"</p>
          </div>
        ))}
      </div>

      {/* Vote buttons */}
      <div className="vote-section">
        <h3 className="vote-instruct">Vote out who you think is the IMPOSTOR:</h3>
        <div className="vote-grid">
          {players.map((p, i) => {
            const pid = p?._id || p;
            if (pid?.toString() === playerId?.toString()) return null;
            return (
              <button
                key={pid}
                className={`vote-player-btn ${voted?.toString() === pid?.toString() ? "voted-btn" : ""}`}
                onClick={() => handleVote(pid)}
                disabled={!!voted}
              >
                <div className="vote-av" style={{ background: avatarColor(i) }}>
                  {(p?.name || "?")[0].toUpperCase()}
                </div>
                <span>{p?.name || "Player"}</span>
                {voted?.toString() === pid?.toString() && <span className="voted-check">✓</span>}
              </button>
            );
          })}
        </div>
        {voted && <p className="voted-msg">✓ Vote cast! Waiting for others…</p>}
      </div>
    </div>
  );
}

const COLORS = ["#e63946","#457b9d","#2ec4b6","#ff9f1c","#8338ec","#06d6a0","#ef476f","#118ab2"];
function avatarColor(i) { return COLORS[i % COLORS.length]; }