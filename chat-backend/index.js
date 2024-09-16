// chat-backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Sample questions
const questions = [
  "How was your day?",
  "What was the best part of your day?",
  "Did anything interesting happen today?"
];

let currentQuestion = 0;

// Endpoint to get the bot's next question
app.get('/api/question', (req, res) => {
  const question = questions[currentQuestion];
  res.json({ question });
});

// Endpoint to handle the user's response
app.post('/api/answer', (req, res) => {
  const userAnswer = req.body.answer;

  let botResponse;
  if (userAnswer.includes('good') || userAnswer.includes('great')) {
    botResponse = "I'm glad to hear that!";
  } else if (userAnswer.includes('bad') || userAnswer.includes('not well')) {
    botResponse = "Sorry to hear that. Hopefully, tomorrow will be better!";
  } else {
    botResponse = "Interesting! Tell me more.";
  }

  // Cycle through questions
  currentQuestion = (currentQuestion + 1) % questions.length;

  res.json({ botResponse });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
