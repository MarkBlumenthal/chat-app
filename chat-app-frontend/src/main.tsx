// chat-app-frontend/src/main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { setupAuthHandlers } from './authHandlers';
import { setupStartConversationHandler } from './conversationHandlers';
import { checkIfLoggedIn } from './auth';

// Initialize authentication handlers
setupAuthHandlers();

// After login, set up the conversation handler
const token = checkIfLoggedIn();
if (token) {
  setupStartConversationHandler(token);
}
