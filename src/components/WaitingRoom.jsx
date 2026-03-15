import React, { useState } from "react";

export default function WaitingRoom({ game, playerId, isHost, onStartGame }) {
  const [rounds, setRounds] = useState(game.totalRounds || 3);

  const handleStart = () => {
    if (game.players.length < 2) return alert("Need at least 2 players!");
    onStartGame(rounds);
  };

  // Safety check — make sure players array exists
  const players = game.players || [];

  return (
    <div className="waiting-page">
      <div className="waiting-header">
        <h2 className="room-title">{game.lobbyName}</h2>
        <div className="code-badge">
          <span className="code-label">ROOM CODE</span>
          <span className="code-value">{game.code}</span>
        </div>
      </div>

      <p className="waiting-hint">Share the room code with friends!</p>

      <div className="player-grid">
        {players.map((p, i) => {
          // Handle both populated {_id, name} and raw ObjectId strings
          const name = p?.name || "Player";
          const id   = p?._id  || p;
          return (
            <div key={id} className={`player-slot ${id?.toString() === playerId?.toString() ? "you" : ""}`}>
              <div className="player-avatar" style={{ background: avatarColor(i) }}>
                {name[0].toUpperCase()}
              </div>
              <span className="player-slot-name">{name}</span>
              {id?.toString() === playerId?.toString() && <span className="you-tag">YOU</span>}
            </div>
          );
        })}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, (game.maxPlayers || 8) - players.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="player-slot empty">
            <div className="player-avatar empty-av">?</div>
            <span className="player-slot-name">Waiting…</span>
          </div>
        ))}
      </div>

      <div className="waiting-footer">
        <p className="player-count">{players.length} / {game.maxPlayers || 8} players</p>

        {isHost ? (
          <div className="host-controls">
            <div className="field inline-field">
              <label>Rounds:</label>
              <input
                type="number"
                className="inp small-inp"
                min={1} max={99}
                value={rounds}
                onChange={e => setRounds(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <button
              className="btn btn-start"
              onClick={handleStart}
              disabled={players.length < 2}
            >
              ▶ Start Game
            </button>
          </div>
        ) : (
          <p className="waiting-msg">⏳ Waiting for the host to start…</p>
        )}
      </div>
    </div>
  );
}

const COLORS = ["#e63946","#457b9d","#2ec4b6","#ff9f1c","#8338ec","#06d6a0","#ef476f","#118ab2"];
function avatarColor(i) { return COLORS[i % COLORS.length]; }