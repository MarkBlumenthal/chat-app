// chat-app-backend/websocket/socket.js
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

module.exports = (io) => {
  // JWT Middleware for WebSocket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token provided'));
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error: Invalid token'));
      socket.user = decoded;  // Store user info in the socket
      next();
    });
  });

  // WebSocket connection
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Handle message event
    socket.on('sendMessage', async (message) => {
      try {
        // Include the sender's username in the message
        const messageWithUser = {
          username: socket.user.username,  // Add the username to the message
          text: message.text,
        };
        const newMessage = await Message.create(messageWithUser);  // Save to DB

        // Broadcast the message to all clients
        io.emit('message', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle WebSocket disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket encountered an error:', error);
    });
  });
};

