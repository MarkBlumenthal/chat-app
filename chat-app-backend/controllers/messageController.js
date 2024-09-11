// chat-app-backend/controllers/messageController.js
const Message = require('../models/Message');

// Get all messages for a conversation
exports.getMessages = async (req, res) => {  // Function renamed to getMessages
  const { conversationId } = req.params;

  const messages = await Message.findAll({
    where: { conversationId },
    include: 'User'  // Fetch the user who sent the message
  });

  res.json(messages);
};

