const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const sequelize = require('./db');  // Database connection
const { register, login } = require('./controllers/authController');
const { getMessages } = require('./controllers/messageController');
const authenticateToken = require('./middleware/authenticateToken');

// Express app setup
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: {
    origin: '*',  // Replace with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

// WebSocket Setup
require('./websocket/socket')(io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/register', register);
app.post('/login', login);
app.get('/messages', authenticateToken, getMessages);

// Error handling for unhandled promise rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

