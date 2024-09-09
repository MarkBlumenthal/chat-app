const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Create or Get a conversation between two users
exports.getOrCreateConversation = async (req, res) => {
  const { user1Id, user2Id } = req.body;

  // Check if the conversation already exists
  let conversation = await Conversation.findOne({
    where: {
      user1Id: [user1Id, user2Id],
      user2Id: [user1Id, user2Id],
    }
  });

  // If not, create a new conversation
  if (!conversation) {
    conversation = await Conversation.create({ user1Id, user2Id });
  }

  res.json(conversation);
};

// Get all conversations for a user
exports.getUserConversations = async (req, res) => {
  const { userId } = req.params;
  
  const conversations = await Conversation.findAll({
    where: {
      [sequelize.Op.or]: [
        { user1Id: userId },
        { user2Id: userId }
      ]
    },
    include: [{ model: User, as: 'user1' }, { model: User, as: 'user2' }]
  });

  res.json(conversations);
};
