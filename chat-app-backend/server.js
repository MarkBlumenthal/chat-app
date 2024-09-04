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
const io = socketIo(server, {
  cors: {
    origin: '*',  // Replace with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
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

// WebSocket for real-time chat
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('sendMessage', async (message) => {
    const newMessage = await Message.create(message);
    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
