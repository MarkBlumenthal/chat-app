// username:testuser
// password: password123


import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // For custom styles
import io from 'socket.io-client';

// WebSocket connection
const socket = io('http://localhost:4000');

// DOM Elements
const messageForm = document.getElementById('messageForm') as HTMLFormElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const messageList = document.getElementById('messageList') as HTMLElement;
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;

let token = ''; // To store the JWT token after login

// Login user and fetch token
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const loginData = {
      username: loginUsername.value,
      password: loginPassword.value,
    };

    // Make login request to backend
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
  
    if (response.ok) {
      token = result.token; // Save JWT token
      console.log('Logged in! Token:', token);
    } else {
      console.error('Login failed:', result.error);
    }
  });
}

// Sending message through WebSocket
if (messageForm) {
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!token) {
      console.error('You must be logged in to send a message');
      return;
    }

    const message = {
      username: loginUsername.value, // This should be the logged-in user's username
      text: messageInput.value,
      token: token,  // Include the JWT token with the message
    };

    socket.emit('sendMessage', message); // Send message via WebSocket
    messageInput.value = ''; // Clear input field
  });
}

// Listen for new messages from the server
socket.on('message', (message) => {
  const messageElement = document.createElement('li');
  messageElement.classList.add('list-group-item');
  messageElement.textContent = `${message.username}: ${message.text}`;
  messageList.appendChild(messageElement);
});

const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const registerUsername = document.getElementById('registerUsername') as HTMLInputElement;
const registerPassword = document.getElementById('registerPassword') as HTMLInputElement;

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const registrationData = {
      username: registerUsername.value,
      password: registerPassword.value,
    };

    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('User registered successfully. Please log in.');
      registerForm.reset(); // Clear the form
    } else {
      console.error('Registration failed:', result.error);
    }
  });
}


const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    token = ''; // Clear the token
    localStorage.removeItem('jwtToken'); // Optionally remove the token from localStorage if you're storing it
    location.reload(); // Reload the page to reset the UI
  });
}


if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginData = {
      username: loginUsername.value,
      password: loginPassword.value,
    };

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

    if (response.ok) {
      token = result.token; // Save JWT token
      localStorage.setItem('jwtToken', token); // Optionally store it in localStorage
      console.log('Logged in! Token:', token);

      // Hide login and registration forms
      loginForm.style.display = 'none';
      registerForm.style.display = 'none';

      // Show the logout button
      logoutButton.style.display = 'block';
    } else {
      console.error('Login failed:', result.error);
    }
  });
}


window.addEventListener('load', () => {
  const storedToken = localStorage.getItem('jwtToken');
  
  if (storedToken) {
    token = storedToken;

    // Hide login and registration forms
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';

    // Show logout button
    logoutButton.style.display = 'block';
  }
});
