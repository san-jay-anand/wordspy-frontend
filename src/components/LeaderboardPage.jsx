// frontend/src/components/LeaderboardPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

//const API    = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API = "https://wordspy-backend-qth7.onrender.com";
const COLORS = ["#e63946","#457b9d","#2ec4b6","#ff9f1c","#8338ec","#06d6a0","#ef476f","#118ab2"];

export default function LeaderboardPage({ onBack }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/auth/leaderboard`)
      .then(({ data }) => { setPlayers(data.players); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="lb-page">
      <div className="profile-topbar">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <span className="logo-small">WORD<span>SPY</span></span>
        <button className="theme-toggle" onClick={toggleTheme}>{isDark ? "☀️" : "🌙"}</button>
      </div>

      <div className="lb-content">
        <h1 className="lb-title">🏆 Global Leaderboard</h1>
        <p className="lb-sub">Top players ranked by total score</p>

        {loading ? (
          <p className="loading-msg">Loading…</p>
        ) : (
          <div className="lb-table">
            {/* Header */}
            <div className="lb-header">
              <span>Rank</span>
              <span>Player</span>
              <span>Score</span>
              <span>Games</span>
              <span>Wins</span>
              <span>Win Rate</span>
            </div>

            {players.map((p, i) => {
              const winRate = p.gamesPlayed > 0
                ? Math.round((p.gamesWon / p.gamesPlayed) * 100)
                : 0;
              const isMe = p._id === user?._id;

              return (
                <div key={p._id} className={`lb-table-row ${isMe ? "lb-me" : ""} ${i < 3 ? `lb-top${i+1}` : ""}`}>
                  <span className="lb-rank-cell">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                  </span>
                  <span className="lb-player-cell">
                    <div className="lb-av" style={{ background: COLORS[p.username?.charCodeAt(0) % COLORS.length] }}>
                      {p.username?.[0]?.toUpperCase()}
                    </div>
                    {p.username}
                    {isMe && <span className="you-tag">YOU</span>}
                  </span>
                  <span className="lb-score-cell">{p.totalScore}</span>
                  <span className="lb-cell">{p.gamesPlayed}</span>
                  <span className="lb-cell">{p.gamesWon}</span>
                  <span className="lb-cell">{winRate}%</span>
                </div>
              );
            })}

            {players.length === 0 && (
              <p className="no-players">No players yet. Be the first! 🎮</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
