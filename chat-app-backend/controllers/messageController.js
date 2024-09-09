const Message = require('../models/Message');

// Get all messages
exports.getMessages = async (req, res) => {
  const messages = await Message.findAll();
  res.json(messages);
};
