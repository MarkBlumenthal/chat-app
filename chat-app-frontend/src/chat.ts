import { sendMessage, onMessageReceived } from './websocket';

// Fetch user conversations
export async function fetchUserConversations(token: string) {
  const response = await fetch('http://localhost:4000/conversations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Fetch messages for a specific conversation
export async function fetchMessagesForConversation(token: string, conversationId: number) {
  const response = await fetch(`http://localhost:4000/messages/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Set up message form submission
export function setupMessageForm(token: string, conversationId: number, messageForm: HTMLFormElement, messageInput: HTMLInputElement) {
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = {
      text: messageInput.value,
      token,
      conversationId,  // Attach conversation ID to the message
    };

    sendMessage(message);  // Send the message through WebSocket
    messageInput.value = '';  // Clear input field
  });
}

// Handle receiving new messages
export function handleIncomingMessages(messageList: HTMLElement) {
  onMessageReceived((message) => {
    const messageElement = document.createElement('li');
    messageElement.textContent = `${message.username}: ${message.text}`;
    messageList.appendChild(messageElement);
  });
}


