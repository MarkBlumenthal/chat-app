// chat-frontend/src/App.tsx
import { Chat } from './components/Chat';
import './styles/chat.css';

function App() {
  return (
    <div className="container">
      <h1>Chat with the Bot</h1>
      <Chat />
    </div>
  );
}

export default App;

