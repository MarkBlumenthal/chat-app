// backend/models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Conversation = require('./Conversation');

const Message = sequelize.define('Message', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add more fields if needed
});

// Define relationships
Message.belongsTo(User, { foreignKey: 'userId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

module.exports = Message;

