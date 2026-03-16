import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const API = "https://wordspy-backend-qth7.onrender.com";
const COLORS = ["#e63946","#457b9d","#2ec4b6","#ff9f1c","#8338ec","#06d6a0","#ef476f","#118ab2"];

export default function ProfilePage({ onPlay, onLeaderboard }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/auth/leaderboard`)
      .then(({ data }) => setLeaderboard(data.players))
      .catch(console.error);
  }, []);

  const winRate = user?.gamesPlayed > 0
    ? Math.round((user.gamesWon / user.gamesPlayed) * 100)
    : 0;

  const avatarColor = COLORS[user?.username?.charCodeAt(0) % COLORS.length] || COLORS[0];

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <span className="logo-small">WORD<span>SPY</span></span>
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={toggleTheme}>{isDark ? "☀️" : "🌙"}</button>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar" style={{ background: avatarColor }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <h2 className="profile-name">{user?.username}</h2>
          <p className="profile-since">Member since {new Date(user?.createdAt).getFullYear()}</p>

          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-val">{user?.totalScore || 0}</span>
              <span className="stat-label">Total Score</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{user?.gamesPlayed || 0}</span>
              <span className="stat-label">Games Played</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{user?.gamesWon || 0}</span>
              <span className="stat-label">Games Won</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{winRate}%</span>
              <span className="stat-label">Win Rate</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{user?.crewmateWins || 0}</span>
              <span className="stat-label">Crewmate Wins</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{user?.impostorWins || 0}</span>
              <span className="stat-label">Impostor Wins</span>
            </div>
          </div>

          <button className="btn btn-start" onClick={onPlay} style={{ width:"100%", marginTop:"1.5rem" }}>
            ▶ Play Now
          </button>
          <button className="btn-leaderboard" onClick={onLeaderboard} style={{ width:"100%", marginTop:".75rem" }}>
            🏆 Leaderboard
          </button>
        </div>

        <div className="profile-leaderboard">
          <h3 className="section-title">🏆 Top Players</h3>
          {leaderboard.slice(0, 10).map((p, i) => (
            <div key={p._id} className={`lb-row ${p._id === user?._id ? "lb-me" : ""} ${i === 0 ? "lb-first" : ""}`}>
              <span className="lb-rank">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
              </span>
              <div className="lb-av" style={{ background: COLORS[p.username?.charCodeAt(0) % COLORS.length] }}>
                {p.username?.[0]?.toUpperCase()}
              </div>
              <span className="lb-name">{p.username} {p._id === user?._id && <span className="you-tag">YOU</span>}</span>
              <span className="lb-score">{p.totalScore} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}