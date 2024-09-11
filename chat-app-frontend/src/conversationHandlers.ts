import { fetchMessagesForConversation, setupMessageForm, startConversation, fetchUserConversations } from './chat';

const conversationList = document.getElementById('conversationList') as HTMLElement;
const messageList = document.getElementById('messageList') as HTMLElement;
const messageForm = document.getElementById('messageForm') as HTMLFormElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;

export async function handleConversations(token: string) {
  // Fetch and display user conversations
  const conversations = await fetchUserConversations(token);
  conversationList.innerHTML = '';
  
  conversations.forEach((conversation: any) => {
    const conversationElement = document.createElement('li');
    conversationElement.textContent = `Chat with ${conversation.user1.username} and ${conversation.user2.username}`;
    
    conversationElement.addEventListener('click', async () => {
      const messages = await fetchMessagesForConversation(token, conversation.id);
      messageList.innerHTML = '';  // Clear previous messages
      messages.forEach((message: any) => {
        const messageElement = document.createElement('li');
        messageElement.textContent = `${message.username}: ${message.text}`;
        messageList.appendChild(messageElement);
      });

      // Setup message form to send messages in this conversation
      setupMessageForm(token, conversation.id, messageForm, messageInput);
    });

    conversationList.appendChild(conversationElement);
  });
}

// Handle starting a new conversation
export function setupStartConversationHandler(token: string) {
  const startConversationForm = document.getElementById('startConversationForm') as HTMLFormElement;
  const friendUsernameInput = document.getElementById('friendUsername') as HTMLInputElement;

  if (startConversationForm) {
    startConversationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const friendUsername = friendUsernameInput.value;
      const conversation = await startConversation(token, friendUsername);

      if (conversation) {
        const messages = await fetchMessagesForConversation(token, conversation.id);
        messageList.innerHTML = '';  // Clear previous messages
        messages.forEach((message: any) => {
          const messageElement = document.createElement('li');
          messageElement.textContent = `${message.username}: ${message.text}`;
          messageList.appendChild(messageElement);
        });

        setupMessageForm(token, conversation.id, messageForm, messageInput);
      }
    });
  }
}
