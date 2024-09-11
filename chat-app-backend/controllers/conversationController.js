// chat-app-backend/controllers/conversationController.js
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Create or Get a conversation based on username
exports.startConversation = async (req, res) => {
  const { username } = req.body;  // Get the friend's username from the request
  const userId = req.user.id;  // The logged-in user's ID

  // Find the friend by username
  const friend = await User.findOne({ where: { username } });
  if (!friend) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if a conversation already exists
  let conversation = await Conversation.findOne({
    where: {
      user1Id: [userId, friend.id],
      user2Id: [userId, friend.id],
    },
  });

  // If no conversation exists, create a new one
  if (!conversation) {
    conversation = await Conversation.create({ user1Id: userId, user2Id: friend.id });
  }

  res.json(conversation);  // Return the conversation object
};

