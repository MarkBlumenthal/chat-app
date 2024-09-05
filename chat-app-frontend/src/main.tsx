import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // For custom styles
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const messageForm = document.getElementById('messageForm') as HTMLFormElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const messageList = document.getElementById('messageList') as HTMLElement;

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = {
    username: 'User1', // Change this to the logged-in user in a real app
    text: messageInput.value,
  };
  socket.emit('sendMessage', message);
  messageInput.value = '';
});

socket.on('message', (message) => {
  const messageElement = document.createElement('li');
  messageElement.classList.add('list-group-item');
  messageElement.textContent = `${message.username}: ${message.text}`;
  messageList.appendChild(messageElement);
});
