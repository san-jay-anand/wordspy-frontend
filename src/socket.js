// ============================================================
// src/socket.js — Single shared Socket.IO instance
// Import this wherever you need the socket
// ============================================================
import { io } from "socket.io-client";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const socket = io(BACKEND, { autoConnect: true });

export default socket;
