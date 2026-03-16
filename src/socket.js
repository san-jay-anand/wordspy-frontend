import { io } from "socket.io-client";

const socket = io("https://wordspy-backend-qth7.onrender.com", {
  transports: ["polling", "websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;