import './style.css'; 
import { io } from 'socket.io-client'; // Importa Socket.io para que la comunicacion sea en tiempo real

const socket = io('http://localhost:3000'); // Conecta al servidor de websocket en el puerto 3000

/* Asegura que la aplicacion pueda manipular el elemento div con id app, para que se pueda
insertar el contenido html en la interfaz y lo coja typescript*/
const app = document.querySelector<HTMLDivElement>('#app')!;

// Inserta el contenido html en el div con id app para la interfaz básica del chat
app.innerHTML = `
  <div class="chat-container">
    <ul id="messages"></ul> <!-- Lista donde se mostraran los mensajes -->
    <form id="chat-form">
      <input id="chat-input" type="text" autocomplete="off" /> <!-- Campo de texto para escribir el mensaje -->
      <button>Enviar</button> <!-- Boton para enviar el mensaje -->
    </form>
  </div>
`;

// Coje los elementos del formulario y del texto de entrada
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const chatInput = document.getElementById('chat-input') as HTMLInputElement;

// Escucha el evento submit en el formulario
chatForm.addEventListener('submit', (e: Event) => {
  e.preventDefault(); // Previene que el formulario se envie cada vez y recargue la pagina
  
  if (chatInput.value) { // Verifica que el campo de texto no este vacio
    socket.emit('chat message', chatInput.value); // Envía el mensaje de chat al servidor usando socket.io
    chatInput.value = ''; // Despues de enviar un mensaje se "limpia"
  }
});

// Escucha los mensajes desde el servidor cada vez que un usuario envia un mensaje
socket.on('chat message', (msg: string) => {
  const li = document.createElement('li'); // Cada vez que se manda un mensaje crea un elemento "li"
  li.textContent = msg; 

  // Selecciona el contenedor donde se mostraran los mensajes que se vayan enviando
  const messagesContainer = document.getElementById('messages'); 
  messagesContainer?.appendChild(li); // Cada mensaje que se mande se añade al final

  // Desplaza el contenedor de mensajes automaticamente al final para mostrar el último mensaje
  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
});
