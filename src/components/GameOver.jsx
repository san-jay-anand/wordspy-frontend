import React from "react";
import { useEffect } from "react";
import { playWin, playLose } from "../utils/sounds";
import { launchConfetti } from "../utils/confetti";

export default function GameOver({ impostorName, impostorCaught, players, onPlayAgain }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  useEffect(() => {
  if (impostorCaught) {
    playWin();
    launchConfetti();
  } else {
    playLose();
  }
}, []);
  return (
    <div className="gameover-page">
      <div className={`gameover-banner ${impostorCaught ? "crew-win" : "imp-win"}`}>
        {impostorCaught ? "🧑‍🚀 Crewmates Win!" : "🕵️ Impostor Wins!"}
      </div>
      <div className="impostor-reveal">
        <p>The impostor was…</p>
        <h2 className="impostor-name">{impostorName}</h2>
        <p className="impostor-result">
          {impostorCaught
            ? "The crew successfully identified the impostor! 🎉"
            : "The impostor fooled everyone and survived all rounds! 😈"}
        </p>
      </div>
      <div className="leaderboard">
        <h3>Final Scores</h3>
        {sorted.map((p, i) => (
          <div key={p._id} className={`lb-row ${i === 0 ? "lb-first" : ""}`}>
            <span className="lb-rank">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
            </span>
            <span className="lb-name">{p.name}</span>
            <span className="lb-score">{p.score} pts</span>
          </div>
        ))}
      </div>
      <button className="btn btn-again" onClick={onPlayAgain}>
        🔄 Play Again
      </button>
    </div>
  );
}