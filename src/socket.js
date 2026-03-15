import { io } from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

let socket;

try {
  socket = io(BACKEND_URL, {
    transports: ["polling"],
    autoConnect: false,
    reconnection: false,
  });
} catch (err) {
  console.log("Socket not available");
  socket = {
    on: () => {},
    off: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {},
  };
}

export default socket;