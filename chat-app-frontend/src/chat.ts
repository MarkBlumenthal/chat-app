import { sendMessage, onMessageReceived } from './websocket';

export function setupMessageForm(token: string, messageForm: HTMLFormElement, messageInput: HTMLInputElement) {
  // Handle sending messages
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = {
      text: messageInput.value,
      token, // Include the JWT token
    };
    sendMessage(message); // Send message through WebSocket
    messageInput.value = ''; // Clear input field
  });
}

// Handle receiving messages
export function displayReceivedMessage(messageList: HTMLElement) {
  onMessageReceived((message) => {
    const messageElement = document.createElement('li');
    messageElement.classList.add('list-group-item');
    messageElement.textContent = `${message.username}: ${message.text}`;
    messageList.appendChild(messageElement);
  });
}
