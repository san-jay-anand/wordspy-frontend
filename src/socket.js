import { io } from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const socket = io(BACKEND_URL, {
  transports: ["polling"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 2000,
  timeout: 10000,
});

export default socket;