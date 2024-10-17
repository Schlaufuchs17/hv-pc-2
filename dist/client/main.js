import './style.css';
import { io } from './node_modules/socket.io-client';
const socket = io('http://localhost:3000');
const app = document.querySelector('#app');
app.innerHTML = `
  <div class="chat-container">
    <ul id="messages"></ul>
    <form id="chat-form">
      <input id="chat-input" type="text" autocomplete="off" />
      <button>Enviar</button>
    </form>
  </div>
`;
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.value) {
        socket.emit('chat message', chatInput.value);
        chatInput.value = '';
    }
});
socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    const messagesContainer = document.getElementById('messages');
    messagesContainer?.appendChild(li);
    messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
});
