import React, { useState, useEffect } from "react";
import socket from "./socket";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import AuthPage        from "./components/AuthPage";
import ProfilePage     from "./components/ProfilePage";
import LeaderboardPage from "./components/LeaderboardPage";
import Lobby           from "./components/Lobby";
import WaitingRoom     from "./components/WaitingRoom";
import GameScreen      from "./components/GameScreen";
import VoteScreen      from "./components/VoteScreen";
import RoundResult     from "./components/RoundResult";
import GameOver        from "./components/GameOver";
import "./styles/main.css";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const { user, loading, updateStats } = useAuth();
  const { isDark } = useTheme();
  const [screen, setScreen]             = useState("profile");
  const [game, setGame]                 = useState(null);
  const [playerId, setPlayerId]         = useState(null);
  const [isHost, setIsHost]             = useState(false);
  const [myRole, setMyRole]             = useState(null);
  const [myWord, setMyWord]             = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds]   = useState(3);
  const [descriptions, setDescriptions] = useState([]);
  const [votedCount, setVotedCount]     = useState(0);
  const [mySubmitted, setMySubmitted]   = useState(false);
  const [roundResultData, setRoundResultData] = useState(null);
  const [gameOverData, setGameOverData]       = useState(null);
  const [currentTurnId, setCurrentTurnId]     = useState(null);
  const [currentTurnName, setCurrentTurnName] = useState("");

  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    socket.on("lobbyUpdated", ({ game: g }) => setGame(g));

    socket.on("gameStarted", ({ role, word, round, totalRounds: tr, players, currentTurnId: tid, currentTurnName: tname }) => {
      setMyRole(role); setMyWord(word); setCurrentRound(round); setTotalRounds(tr);
      setMySubmitted(false); setGame(g => ({ ...g, players }));
      if (tid) { setCurrentTurnId(tid); setCurrentTurnName(tname || ""); }
    });

    socket.on("phaseChanged", ({ phase: p, descriptions: descs, round, totalRounds: tr, currentTurnId: tid, currentTurnName: tname }) => {
      setScreen(p);
      if (descs) setDescriptions(descs);
      if (round) setCurrentRound(round);
      if (tr)    setTotalRounds(tr);
      if (tid)   { setCurrentTurnId(tid); setCurrentTurnName(tname || ""); }
      if (p === "describing") { setMySubmitted(false); setVotedCount(0); setDescriptions([]); }
      if (p === "voting") setVotedCount(0);
    });

    socket.on("turnChanged", ({ currentTurnId: tid, currentTurnName: tname }) => {
      setCurrentTurnId(tid); setCurrentTurnName(tname || "");
    });

    socket.on("voteUpdate", ({ voted }) => setVotedCount(voted));

    socket.on("roundResult", ({ eliminatedName, wasImpostor, tally, round, players }) => {
      setRoundResultData({ eliminatedName, wasImpostor, tally, round });
      setGame(g => ({ ...g, players }));
      setScreen("roundResult");
    });

    socket.on("newRound", ({ role, word, round, totalRounds: tr, currentTurnId: tid, currentTurnName: tname }) => {
      setMyRole(role); setMyWord(word); setCurrentRound(round); setTotalRounds(tr);
      setMySubmitted(false); setVotedCount(0); setDescriptions([]);
      if (tid) { setCurrentTurnId(tid); setCurrentTurnName(tname || ""); }
    });

    socket.on("gameOver", async (data) => {
      setGameOverData(data);
      setGame(g => ({ ...g, players: data.players }));
      setScreen("gameOver");
      if (user) {
        const myPlayer = data.players.find(p => p._id?.toString() === playerId?.toString());
        const scoreEarned = myPlayer?.score || 0;
        const won = data.impostorCaught ? myRole !== "impostor" : myRole === "impostor";
        await updateStats(scoreEarned, won, myRole);
      }
    });

    return () => {
      socket.off("lobbyUpdated"); socket.off("gameStarted");
      socket.off("phaseChanged"); socket.off("turnChanged");
      socket.off("voteUpdate");   socket.off("roundResult");
      socket.off("newRound");     socket.off("gameOver");
    };
  }, [user, playerId, myRole]);

  const handleJoined = ({ game: g, playerId: pid, isHost: host }) => {
    setGame(g); setPlayerId(pid); setIsHost(host); setScreen("waiting");
    try { socket.connect(); socket.emit("joinLobbyRoom", { lobbyCode: g.code, playerId: pid }); }
    catch (err) { console.log("Socket error:", err); }
  };

  const handleStartGame  = (rounds)   => socket.emit("startGame", { lobbyCode: game.code, totalRounds: rounds });
  const handleSubmitDesc = (text)     => { setMySubmitted(true); socket.emit("submitDescription", { lobbyCode: game.code, playerId, text }); };
  const handleVote       = (targetId) => socket.emit("castVote", { lobbyCode: game.code, voterId: playerId, targetId });

  const handlePlayAgain = () => {
    setScreen("profile"); setGame(null); setPlayerId(null);
    setIsHost(false); setMyRole(null); setMyWord(null);
    setRoundResultData(null); setGameOverData(null);
    setCurrentTurnId(null); setCurrentTurnName("");
  };

  if (loading) return <LoadingScreen />;

  if (!user) return <AuthPage />;

  if (screen === "profile")      return <ProfilePage onPlay={() => setScreen("lobby")} onLeaderboard={() => setScreen("leaderboard")} />;
  if (screen === "leaderboard")  return <LeaderboardPage onBack={() => setScreen("profile")} />;
  if (screen === "lobby")        return <Lobby onJoined={handleJoined} onBack={() => setScreen("profile")} username={user.username} />;
  if (screen === "waiting")      return <WaitingRoom game={game} playerId={playerId} isHost={isHost} onStartGame={handleStartGame} />;
  if (screen === "describing")   return <GameScreen role={myRole} word={myWord} round={currentRound} totalRounds={totalRounds} players={game?.players || []} playerId={playerId} submitted={mySubmitted} currentTurnId={currentTurnId} currentTurnName={currentTurnName} totalCount={game?.players?.length || 0} onSubmit={handleSubmitDesc} />;
  if (screen === "voting")       return <VoteScreen descriptions={descriptions} players={game?.players || []} playerId={playerId} votedCount={votedCount} totalCount={game?.players?.length || 0} round={currentRound} totalRounds={totalRounds} onVote={handleVote} />;
  if (screen === "roundResult")  return <RoundResult eliminatedName={roundResultData?.eliminatedName} wasImpostor={roundResultData?.wasImpostor} tally={roundResultData?.tally} round={roundResultData?.round} players={game?.players || []} />;
  if (screen === "gameOver")     return <GameOver impostorName={gameOverData?.impostorName} impostorCaught={gameOverData?.impostorCaught} players={game?.players || []} onPlayAgain={handlePlayAgain} />;

  return null;
}