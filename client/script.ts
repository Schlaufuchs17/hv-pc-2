'use strict'; // Modo estricto

import { io, Socket } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

interface CustomSocket extends Socket {
    auth: {
        token: string;
        username: string;
        serverOffset?: number;
    };
     //Incluir el modo emit para que mas abajo no de problemas
    on(event: 'chat message', callback: (msg: string, serverOffset: number, username: string) => void): this;
    emit(event: 'mensaje de chat', msg: string): this;


    //Definir el evento para que no de error en --socket.on('chat message'...)--
    on(event: 'chat message', callback: (msg: string, serverOffset: number, username: string) => void): this; 
}

// Función para obtener el nombre de usuario
const getUsername = async (): Promise<string> => { 
    const username = localStorage.getItem('username'); 
    if (username) {
        console.log(`El usuario ya existe ${username}`);
        return username;
    }

    const res = await fetch('https://random-data-api.com/api/users/random_user'); 
    const { username: randomUsername } = await res.json(); 

    console.log('random, randomUsername');
    localStorage.setItem('username', randomUsername); 
    return randomUsername; 
};

// Tipamos el socket como un objeto "CustomSocket"
const socket: CustomSocket = io({
    auth: {
        token: '123',
        username: 'adrian',
        serverOffset: 0
    }
});

// Obtención de elementos del DOM
const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;
const messages = document.getElementById('messages') as HTMLElement; 

// Validar que el elemento messages existe
if (!messages) {
    console.error('El elemento messages no existe en el DOM');
}

// Escucha el evento de 'chat message'
socket.on('chat message', (msg: string, serverOffset: number, username: string) => {
    const item = `
        <li>
            <p>${msg}</p>
            <small>${username}</small>
        </li>`;
    messages.insertAdjacentHTML('beforeend', item);
    
    if (socket.auth) {
        socket.auth.serverOffset = serverOffset; 
    } else {
        console.warn('El objeto auth no está definido en el socket');
    }
    
    messages.scrollTop = messages.scrollHeight; 
});

// Manejo del evento de envío del formulario
form.addEventListener('submit', (e: Event) => {
    e.preventDefault(); 

    if (input.value.trim()) { 
        socket.emit('mensaje de chat', input.value.trim()); 
        input.value = ''; 
    }
});
