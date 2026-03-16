import React, { useState } from "react";
import axios from "axios";

const API = "https://wordspy-backend-qth7.onrender.com";

export default function Lobby({ onJoined }) {
  const [tab, setTab]                 = useState("create");
  const [playerName, setPlayerName]   = useState("");
  const [lobbyName, setLobbyName]     = useState("");
  const [joinCode, setJoinCode]       = useState("");
  const [totalRounds, setTotalRounds] = useState(3);
  const [maxPlayers, setMaxPlayers]   = useState(8);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const handleCreate = async () => {
    setError("");
    if (!playerName.trim()) return setError("Enter your name.");
    if (!lobbyName.trim())  return setError("Enter a lobby name.");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/game/create`, {
        playerName:  playerName.trim(),
        lobbyName:   lobbyName.trim(),
        totalRounds: totalRounds,
        maxPlayers:  maxPlayers,
      });
      onJoined({ game: data.game, playerId: data.playerId, isHost: true });
    } catch (err) {
      setError(err.response?.data?.error || "Could not create room.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setError("");
    if (!playerName.trim()) return setError("Enter your name.");
    if (!joinCode.trim())   return setError("Enter a room code.");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/game/join`, {
        playerName: playerName.trim(),
        code:       joinCode.trim().toUpperCase(),
      });
      onJoined({ game: data.game, playerId: data.playerId, isHost: false });
    } catch (err) {
      setError(err.response?.data?.error || "Could not join room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lobby-page">
      <div className="lobby-hero">
        <h1 className="logo-text">WORD<span>SPY</span></h1>
        <p className="logo-sub">Describe the word. Find the impostor.</p>
      </div>

      <div className="lobby-card">
        <div className="tab-row">
          <button
            className={`tab-btn ${tab === "create" ? "active" : ""}`}
            onClick={() => { setTab("create"); setError(""); }}>
            Create Room
          </button>
          <button
            className={`tab-btn ${tab === "join" ? "active" : ""}`}
            onClick={() => { setTab("join"); setError(""); }}>
            Join Room
          </button>
        </div>

        <div className="field">
          <label>Your Name</label>
          <input
            className="inp"
            placeholder="e.g. NightOwl"
            maxLength={20}
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
          />
        </div>

        {tab === "create" && (
          <>
            <div className="field">
              <label>Room Name</label>
              <input
                className="inp"
                placeholder="e.g. Galaxy Station"
                value={lobbyName}
                onChange={e => setLobbyName(e.target.value)}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Rounds: <strong>{totalRounds}</strong></label>
                <input
                  type="number"
                  className="inp"
                  min={1} max={99}
                  value={totalRounds}
                  onChange={e => setTotalRounds(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div className="field">
                <label>Max Players: <strong>{maxPlayers}</strong></label>
                <input
                  type="range"
                  min={2} max={16}
                  value={maxPlayers}
                  className="slider"
                  onChange={e => setMaxPlayers(Number(e.target.value))}
                />
              </div>
            </div>

            <button className="btn btn-create" onClick={handleCreate} disabled={loading}>
              {loading ? "Creating…" : "✦ Create Room"}
            </button>
          </>
        )}

        {tab === "join" && (
          <>
            <div className="field">
              <label>Room Code</label>
              <input
                className="inp code-inp"
                placeholder="XXXXXX"
                maxLength={6}
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleJoin()}
              />
            </div>
            <button className="btn btn-join" onClick={handleJoin} disabled={loading}>
              {loading ? "Joining…" : "→ Join Room"}
            </button>
          </>
        )}

        {error && <p className="err-msg">{error}</p>}
      </div>
    </div>
  );
}