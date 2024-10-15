import express from 'express';
import { createServer } from 'http'; // Importa el modulo http para crear un servidor http
import { Server } from 'socket.io'; // Importa Socket.io para que la comunicacion sea en tiempo real

// Inicia express
const app = express();

// Crea un servidor http utilizando express
const httpServer = createServer(app);

// Crea una socket.io y la enlaza al servidor http
// Configuracion de cors para permitir conexiones desde el localhost y permitir los métodos GET y POST.
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// La conexion se activa cuando un usuario se conecta
io.on('connection', (socket) => {
  console.log('A user connected'); // Muestra en la consola cuando un usuario se conecta

   // Escucha el mensaje de chat enviado desde el usuario
  // Cuando un mensaje es recibido, el servidor lo retransmite a todos los usuarios conectados
  socket.on('chat message', (msg: string) => {
    io.emit('chat message', msg); // Emite el mensaje a todos los usuarios conectados (broadcasting)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Define el puerto
const PORT = 3000;

/* Inicia el servidor http y lo pone a escuchar en el primer puerto que este disponible o en el puerto 3000
  y lo muestra por consola*/
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});