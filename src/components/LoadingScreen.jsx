import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      {/* Ambient orbs */}
      <div className="loading-orb loading-orb-1" />
      <div className="loading-orb loading-orb-2" />

      {/* S letter with rings */}
      <div className="loading-letter-wrap">
        {/* Outer spinning ring */}
        <div className="loading-ring loading-ring-1" />
        {/* Inner spinning ring */}
        <div className="loading-ring loading-ring-2" />
        {/* Particle dots */}
        <div className="loading-particle loading-particle-1" />
        <div className="loading-particle loading-particle-2" />
        <div className="loading-particle loading-particle-3" />
        <div className="loading-particle loading-particle-4" />
        {/* The S letter */}
        <div className="loading-s">S</div>
      </div>

      {/* Text */}
      <div className="loading-text-wrap">
        <span className="loading-title">WORD<span>SPY</span></span>
        <span className="loading-sub">Loading{dots}</span>
      </div>
    </div>
  );
}