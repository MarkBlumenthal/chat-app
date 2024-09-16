// chat-frontend/src/components/Chat.tsx
import React, { useState, useEffect } from 'react';

const apiBaseUrl = 'http://localhost:3000/api';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');

  // Fetch the first question when the component mounts
  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    const response = await fetch(`${apiBaseUrl}/question`);
    const data = await response.json();
    setMessages((prevMessages) => [...prevMessages, { sender: 'Bot', text: data.question }]);
  };

  const sendAnswer = async (answer: string) => {
    setMessages((prevMessages) => [...prevMessages, { sender: 'User', text: answer }]);
    setUserInput('');

    const response = await fetch(`${apiBaseUrl}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer }),
    });

    const data = await response.json();
    setMessages((prevMessages) => [...prevMessages, { sender: 'Bot', text: data.botResponse }]);

    fetchQuestion();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendAnswer(userInput);
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <p key={index} className={message.sender === 'Bot' ? 'bot' : 'user'}>
            {message.sender}: {message.text}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type your response"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
