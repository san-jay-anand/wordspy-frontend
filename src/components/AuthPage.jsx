import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [tab, setTab]           = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!username.trim() || !password.trim()) return setError("Please fill in all fields.");
    if (tab === "register") {
      if (password !== confirm) return setError("Passwords do not match.");
      if (password.length < 6)  return setError("Password must be at least 6 characters.");
    }
    setLoading(true);
    try {
      if (tab === "login") await login(username.trim(), password);
      else                 await register(username.trim(), password);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="theme-toggle" onClick={toggleTheme}>{isDark ? "☀️" : "🌙"}</button>
      <div className="auth-hero">
        <h1 className="logo-text">WORD<span>SPY</span></h1>
        <p className="logo-sub">Describe the word. Find the impostor.</p>
      </div>
      <div className="auth-card">
        <div className="tab-row">
          <button className={`tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
          <button className={`tab-btn ${tab === "register" ? "active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}>Register</button>
        </div>
        <div className="field">
          <label>Username</label>
          <input className="inp" placeholder="e.g. NightOwl99" maxLength={20}
            value={username} onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="inp" type="password" placeholder="Min. 6 characters"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        {tab === "register" && (
          <div className="field">
            <label>Confirm Password</label>
            <input className="inp" type="password" placeholder="Repeat password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
        )}
        <button className="btn btn-create" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "→ Sign In" : "✦ Create Account"}
        </button>
        {error && <p className="err-msg">{error}</p>}
      </div>
    </div>
  );
}