const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

module.exports = (io) => {
  // JWT Middleware for WebSocket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token provided'));
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error: Invalid token'));
      socket.user = decoded;
      next();
    });
  });

  // WebSocket connection
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Handle message event
    socket.on('sendMessage', async (message) => {
      try {
        const newMessage = await Message.create(message);
        io.emit('message', newMessage);  // Broadcast the message to all clients
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket encountered an error:', error);
    });
  });
};
