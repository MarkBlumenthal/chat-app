import { login, register, logout, checkIfLoggedIn } from './auth';
import { updateUIOnLogin, resetUIOnLogout } from './ui';
import { fetchUserConversations } from './chat';
import { handleConversations } from './conversationHandlers';

// DOM Elements
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const registerUsername = document.getElementById('registerUsername') as HTMLInputElement;
const registerPassword = document.getElementById('registerPassword') as HTMLInputElement;
const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

export function setupAuthHandlers() {
  // Check if user is logged in
  const token = checkIfLoggedIn();
  if (token) {
    updateUIOnLogin(loginForm, registerForm, logoutButton);
    handleConversations(token);
  }

  // Handle login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      login(loginUsername.value, loginPassword.value, async (token) => {
        updateUIOnLogin(loginForm, registerForm, logoutButton);
        handleConversations(token);
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
}
