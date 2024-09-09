// username:testuser
// password: password123


import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; 
import { login, register, logout, checkIfLoggedIn } from './auth';
import { setupMessageForm, displayReceivedMessage } from './chat';
import { updateUIOnLogin, resetUIOnLogout } from './ui';


const messageForm = document.getElementById('messageForm') as HTMLFormElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const messageList = document.getElementById('messageList') as HTMLElement;
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const registerUsername = document.getElementById('registerUsername') as HTMLInputElement;
const registerPassword = document.getElementById('registerPassword') as HTMLInputElement;
const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

// Check if a token already exists (user is logged in)
window.addEventListener('load', () => {
  const storedToken = checkIfLoggedIn();

  if (storedToken) {
    updateUIOnLogin(loginForm, registerForm, logoutButton);
    setupMessageForm(storedToken, messageForm, messageInput);
    displayReceivedMessage(messageList);
  }
  
  // Handle login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      login(loginUsername.value, loginPassword.value, (token) => {
        updateUIOnLogin(loginForm, registerForm, logoutButton);
        setupMessageForm(token, messageForm, messageInput);
        displayReceivedMessage(messageList);
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
        registerForm.reset(); // Clear the form
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
}); 

