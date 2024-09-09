// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();

// Models
const User = require('./models/User');
const Message = require('./models/Message');

// Connect to the database
const sequelize = require('./db');
sequelize.sync(); // Sync models to the database

const app = express();
const server = http.createServer(app);

// WebSocket setup
const io = socketIo(server, {
  cors: {
    origin: '*',  // Replace with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware for HTTP requests
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword });
  res.json(newUser);
});

// User Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
  res.json({ token });
});

// REST API to fetch all messages (for a room)
app.get('/messages', authenticateToken, async (req, res) => {
  const messages = await Message.findAll();
  res.json(messages);
});

// JWT Middleware for WebSocket Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.user = decoded;
    next();
  });
});

// Handle WebSocket connection
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

  // Handle WebSocket disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${reason}`);
  });

  // Catch any unexpected errors
  socket.on('error', (error) => {
    console.error('Socket encountered an error:', error);
  });
});

// Global Error Handling for Unhandled Rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Gracefully shutdown or log error to external service
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // Exit the process or restart server depending on your setup
});

// Start server
const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
