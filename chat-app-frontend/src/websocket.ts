import { io } from 'socket.io-client';

// Get token from localStorage or session
const token = localStorage.getItem('jwtToken');

// Establish WebSocket connection with token
const socket = io('http://localhost:4000', {
  auth: {
    token: token,  // Pass the JWT token in the WebSocket connection
  },
});

export function sendMessage(message: any) {
  socket.emit('sendMessage', message);
}

export function onMessageReceived(callback: (message: any) => void) {
  socket.on('message', callback);
}

