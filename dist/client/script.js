'use strict'; // Modo estricto
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// Función para obtener el nombre de usuario
const getUsername = () => __awaiter(void 0, void 0, void 0, function* () {
    const username = localStorage.getItem('username');
    if (username) {
        console.log(`El usuario ya existe ${username}`);
        return username;
    }
    const res = yield fetch('https://random-data-api.com/api/users/random_user');
    const { username: randomUsername } = yield res.json();
    console.log('random, randomUsername');
    localStorage.setItem('username', randomUsername);
    return randomUsername;
});
// Tipamos el socket como un objeto "CustomSocket"
const socket = io({
    auth: {
        token: '123',
        username: 'adrian',
        serverOffset: 0
    }
});
// Obtención de elementos del DOM
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
// Validar que el elemento messages existe
if (!messages) {
    console.error('El elemento messages no existe en el DOM');
}
// Escucha el evento de 'chat message'
socket.on('chat message', (msg, serverOffset, username) => {
    const item = `
        <li>
            <p>${msg}</p>
            <small>${username}</small>
        </li>`;
    messages.insertAdjacentHTML('beforeend', item);
    if (socket.auth) {
        socket.auth.serverOffset = serverOffset;
    }
    else {
        console.warn('El objeto auth no está definido en el socket');
    }
    messages.scrollTop = messages.scrollHeight;
});
// Manejo del evento de envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
        socket.emit('mensaje de chat', input.value.trim());
        input.value = '';
    }
});
