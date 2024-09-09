// username:testuser
// password: password123


import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';  // Custom styles
import { login, register, logout, checkIfLoggedIn } from './auth';  // Authentication functions
import { fetchMessagesForConversation, fetchUserConversations, setupMessageForm } from './chat';  // Chat functions
import { updateUIOnLogin, resetUIOnLogout } from './ui';  // UI handling

// DOM Elements
const messageForm = document.getElementById('messageForm') as HTMLFormElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const messageList = document.getElementById('messageList') as HTMLElement;
const conversationList = document.getElementById('conversationList') as HTMLElement;  // For conversations
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const registerUsername = document.getElementById('registerUsername') as HTMLInputElement;
const registerPassword = document.getElementById('registerPassword') as HTMLInputElement;
const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

// Check if the user is logged in and load conversations
window.addEventListener('load', async () => {
  const storedToken = checkIfLoggedIn();

  if (storedToken) {
    updateUIOnLogin(loginForm, registerForm, logoutButton);

    // Fetch and display user conversations
    const conversations = await fetchUserConversations(storedToken);
    conversations.forEach((conversation: any) => {
      const conversationElement = document.createElement('li');
      conversationElement.textContent = `Chat with ${conversation.user1.username} and ${conversation.user2.username}`;
      conversationElement.addEventListener('click', async () => {
        const messages = await fetchMessagesForConversation(storedToken, conversation.id);
        messageList.innerHTML = '';  // Clear previous messages
        messages.forEach((message: any) => {
          const messageElement = document.createElement('li');
          messageElement.textContent = `${message.username}: ${message.text}`;
          messageList.appendChild(messageElement);
        });

        // Setup message form to send messages in this conversation
        setupMessageForm(storedToken, conversation.id, messageForm, messageInput);
      });
      conversationList.appendChild(conversationElement);
    });
  }
});

// Handle login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    login(loginUsername.value, loginPassword.value, async (token) => {
      updateUIOnLogin(loginForm, registerForm, logoutButton);

      // Fetch and display user conversations
      const conversations = await fetchUserConversations(token);
      conversations.forEach((conversation: any) => {
        const conversationElement = document.createElement('li');
        conversationElement.textContent = `Chat with ${conversation.user1.username} and ${conversation.user2.username}`;
        conversationElement.addEventListener('click', async () => {
          const messages = await fetchMessagesForConversation(token, conversation.id);
          messageList.innerHTML = '';
          messages.forEach((message: any) => {
            const messageElement = document.createElement('li');
            messageElement.textContent = `${message.username}: ${message.text}`;
            messageList.appendChild(messageElement);
          });

          setupMessageForm(token, conversation.id, messageForm, messageInput);
        });
        conversationList.appendChild(conversationElement);
      });
    }, (error) => {
      console.error('Login failed:', error);
    });
  });
}

// Handle registration
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    register(registerUsername.value, registerPassword.value, () => {
      alert('User registered successfully. Please log in.');
      registerForm.reset();
    }, (error) => {
      console.error('Registration failed:', error);
    });
  });
}

// Handle logout
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    logout();
    resetUIOnLogout(loginForm, registerForm, logoutButton);
  });
}



