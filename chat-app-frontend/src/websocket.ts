import io from 'socket.io-client';

// Create WebSocket connection
export const socket = io('http://localhost:4000');

// Listen for incoming messages from the server
export function onMessageReceived(callback: (message: any) => void) {
  socket.on('message', callback);
}

// Send a message to the server
export function sendMessage(message: any) {
  socket.emit('sendMessage', message);
}
