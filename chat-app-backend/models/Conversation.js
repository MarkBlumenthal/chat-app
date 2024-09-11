// chat-app-backend/models/Conversation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Conversation = sequelize.define('Conversation', {
  // Add more fields if needed
});

// Define relationships
Conversation.belongsTo(User, { as: 'user1', foreignKey: 'user1Id' });
Conversation.belongsTo(User, { as: 'user2', foreignKey: 'user2Id' });

module.exports = Conversation;
