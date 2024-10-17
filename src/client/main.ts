const { io } = await import(
  "https://cdn.jsdelivr.net/npm/socket.io-client@4.8.0/dist/socket.io.esm.min.js"
);

const socket = io('http://localhost:3000');

const app = document.querySelector<HTMLDivElement>('#app')!; 

app.innerHTML = `
  <div class="chat-container">
    <ul id="messages"></ul>
    <form id="chat-form">
      <input id="chat-input" type="text" autocomplete="off" />
      <button>Enviar</button>
    </form>
  </div>
`;

const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const chatInput = document.getElementById('chat-input') as HTMLInputElement;

chatForm.addEventListener('submit', (e: Event) => {
  e.preventDefault(); 

  if (chatInput.value) { 
    socket.emit('chat message', chatInput.value); 
    chatInput.value = ''; 
  }
});

socket.on('chat message', (msg: string) => {
  const li = document.createElement('li'); 
  li.textContent = msg;

  const messagesContainer = document.getElementById('messages'); 
  messagesContainer?.appendChild(li); 

  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
});

export { };