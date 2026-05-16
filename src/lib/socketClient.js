/**
 * Socket.IO client init — for fallback relay via Node.js backend.
 * Primary stream uses direct WebSocket to FastAPI (Opsi B).
 * This client is available if direct connection is blocked.
 */
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let socket = null;

export function getSocket() {
  if (!socket && BACKEND_URL) {
    socket = io(BACKEND_URL, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
