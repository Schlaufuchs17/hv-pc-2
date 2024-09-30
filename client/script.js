'use strict'; // Activado modo estricto

import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'; // Importamos la biblioteca desde el cliente desde socket.io

const getUsername = async () => {
    const username = localStorage.getItem('username');
    if (username) {
        console.log(`El usuario ya existe ${username}`);
        return username;
    }

    const res = await fetch('https://random-data-api.com/api/users/random_user');
    const { username: randomUsername } = await res.json(); //Recibe la respuesta y la convierte en json

    console.log('random, randomUsername');

    localStorage.setItem('username', randomUsername); //Guarda el usuario
    return randomUsername; //Devuelve el usuario
}

const socket = io({ /*19*/ // Creamos el socket co io
    auth: {
        token: '123',
        username: 'adrian',
        serverOffset: 0 //Podemos saber donde se ha quedado el usuario (el ultimo mensaje guardado)
    }
});
/*21*/ // Hacer que hable el cliente y el servidor
const form = document.getElementById('form'); //Traemos el formulario
const input = document.getElementById('input'); // Traemos el inputy para poder leer el emnsaje
/*24*/ const messages = document.getElementById('messages'); /* Donde se guardan los mensajes*/

/*25*/ // Cuando en el socket se reciba un mensaje cree un nuevo item lista (li) con un mensaje
socket.on('chat message', (msg, serverOffset, username) => {
    const item = `<li>
        <p>${msg}</p>
        <small>${username}</small>
    </li>`;
    messages.insertAdjacentHTML('beforeend', item);
    socket.auth.serverOffset = serverOffset; // Se actualiza cada vez que se envia un mensaje
    messages.scrollTop = messages.scrollHeight; // Scroll de los mensajes
});

/*21*/
form.addEventListener('submit', (e) => { //Escuchamos que cuando se haga submit evite el comportamiento por defecto
    e.preventDefault();

    if (input.value) { // Si hay algun valor en el input se emite un mensaje de chat y le pasamos el input.value (el valor) al servidor
        socket.emit('mensaje de chat', input.value);
        input.value = ''; //Reseteamos el valro para que no se quede el mensaje ahi
    }
});
