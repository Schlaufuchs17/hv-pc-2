# 🇪🇸 [Chat en Tiempo Real](#chat-en-tiempo-real-)
# 🇬🇧 [Real-Time Chat](#real-time-chat-)

# Chat en Tiempo Real 🇪🇸 

Este proyecto es una aplicación web que demuestra la integración de **Socket.IO** con **TypeScript** para implementar comunicación en tiempo real entre un cliente y un servidor.

Utiliza **Express** como servidor web para servir una página HTML básica, y **Socket.IO** para gestionar la interacción en tiempo real, permitiendo que el cliente y el servidor intercambien mensajes de forma instantánea.

## Funcionalidades Principales:
- **Servidor Express**: Servidor HTTP que maneja peticiones y sirve contenido estático (HTML, CSS, JavaScript).
- **Comunicación en Tiempo Real**: Uso de Socket.IO para establecer conexiones WebSocket entre el cliente y el servidor.
  - El cliente puede enviar mensajes al servidor.
  - El servidor responde con mensajes de vuelta al cliente en tiempo real.
- **Front-End Interactivo**: Una interfaz de usuario simple donde el cliente puede iniciar la conexión con el servidor y recibir respuestas instantáneas.
  
## Tecnologías Utilizadas:
- **TypeScript**: Capa superior de JavaScript que añade tipado estático, mejorando la robustez del código.
- **Node.js**: Entorno de ejecución del servidor.
- **Express**: Framework de servidor web ligero y eficiente.
- **Socket.IO**: Biblioteca para comunicación en tiempo real basada en WebSockets.
- **HTML y CSS**: Página web sencilla con un botón para interactuar con el servidor.

## Estructura del Proyecto:
- **`/src/client`**: Contiene los archivos de la interfaz de usuario (HTML, CSS, TypeScript).
- **`/src/server`**: Código fuente del servidor que maneja las conexiones y los eventos de WebSockets.
- **`/dist`**: Carpeta donde se almacena el código compilado listo para producción.

## Cómo Ejecutar el Proyecto:

1. Clonar este repositorio en una máquina local.
   
2. Instalar las dependencias:
   ```bash
   npm install
3. Compilar el proyecto:

   ```bash
    npm run build
4. Iniciar el servidor:
   ```bash
    npm start
5. Abrir un navegador y visitar http://localhost:3000 para interactuar con el cliente.

## Requisitos:

    Node.js y npm instalados.

##

# Real-Time Chat 🇬🇧

This project is a web application that demonstrates the integration of **Socket.IO** with **TypeScript** to implement real-time communication between a client and a server.

It uses **Express** as a web server to serve a basic HTML page and **Socket.IO** to manage real-time interaction, allowing the client and server to exchange messages instantly.

## Main Features:
- **Express Server**: HTTP server that handles requests and serves static content (HTML, CSS, JavaScript).
- **Real-Time Communication**: Use of Socket.IO to establish WebSocket connections between the client and server.
  - The client can send messages to the server.
  - The server responds with messages back to the client in real time.
- **Interactive Front-End**: A simple user interface where the client can initiate the connection with the server and receive instant responses.

## Technologies Used:
- **TypeScript**: A superset of JavaScript that adds static typing, improving code robustness.
- **Node.js**: Server-side runtime environment.
- **Express**: Lightweight and efficient web server framework.
- **Socket.IO**: Library for real-time communication based on WebSockets.
- **HTML and CSS**: Simple web page with a button to interact with the server.

## Project Structure:
- **`/src/client`**: Contains the user interface files (HTML, CSS, TypeScript).
- **`/src/server`**: Source code of the server that handles connections and WebSocket events.
- **`/dist`**: Folder where the compiled code ready for production is stored.

## How to Run the Project:

1. Clone this repository to a local machine.
   
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open a browser and visit http://localhost:3000 to interact with the client.

## Requirements:

    Node.js and npm installed.
