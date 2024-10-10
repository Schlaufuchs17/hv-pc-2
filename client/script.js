'use strict'; // Modo estricto

import { io, Socket } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

/* 01. Añadimos el retorno promise (porque async siempre devuelve promise) y le indicamos que es un string. 
Se podria evitar poner "promise" y Typescript lo entenderia igual, pero para mantener las buenas practicas 
es bueno indicarlo*/
const getUsername = async ()=> { 
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

// 02. Tipamos el socket como un objeto "Socket" de socket.io
const socket = io({
    auth: {
        token: '123',
        username: 'adrian',
        serverOffset: 0
    }
});

/* 03. Indicamos que "form" e "input" son de tipo Element. Si no se 
especifica, Typescript entendera que son de tipo HTMLElement, que no
sigue las buenas practicas porque tiene menos propiedades*/

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages'); 

// 04. Indicamos el tipo de datos que son "msg", "serverOffset" y "username"
socket.on('chat message', (msg, serverOffset, username) => {
    const item = `
        <li>
            <p>${msg}</p>
            <small>${username}</small>
        </li>`;
    messages.insertAdjacentHTML('beforeend', item);
    socket.auth.serverOffset = serverOffset; 
    messages.scrollTop = messages.scrollHeight; 
});

// 05. Indicamos que el evento "e" es un evento
form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    if (input.value) { 
        socket.emit('mensaje de chat', input.value); 
        input.value = ''; 
    }
});}