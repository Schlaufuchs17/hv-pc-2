import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import { Server } from 'socket.io'; // Si se importan juntos ambos es mas eficiente de cara a Typescript
import { createServer } from 'node:http';
dotenv.config();
const port = parseInt(process.env.PORT ?? '3000');
const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});
// Validacion explicita de authToken para que no se intente conectar a la base de datos sin un token (es mas seguro)
const authToken = process.env.DB_TOKEN;
console.log('Auth Token:', authToken); //Verificar que el token se ha recuperado correctamente y funciona
if (!authToken) {
    throw new Error('Falta el token de autenticacion para la base de datos');
}
const db = createClient({
    url: 'libsql://crucial-huntara-ssk17.turso.io',
    authToken: process.env.DB_TOKEN,
});
(async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            user TEXT
        )
    `);
})();
io.on('connection', async (socket) => {
    console.log('El usuario se ha conectado');
    socket.on('disconnect', () => {
        console.log('El usuario se ha desconectado');
    });
    socket.on('chat message', async (msg) => {
        let result;
        const username = socket.handshake.auth.username ?? 'anonymous';
        console.log({ username });
        try {
            result = await db.execute({
                sql: 'INSERT INTO messages(content, user) VALUES (:msg, :username)',
                args: { msg, username }
            });
            io.emit('chat message', msg, result.lastInsertRowid?.toString(), username);
        }
        catch (e) {
            console.error('Error al insertar el mensaje en la base de datos:', e);
        }
    });
    console.log('auth');
    console.log(socket.handshake.auth);
    // Verificacion para que serverOffset es un numero (mas seguro)
    const serverOffset = socket.handshake.auth.serverOffset ?? 0;
    if (!Number.isInteger(serverOffset)) {
        console.warn('Offset no valido:', serverOffset);
        return;
    }
    if (!socket.recovered) {
        try {
            const results = await db.execute({
                sql: 'SELECT id, content, user FROM messages WHERE id > ?',
                args: [serverOffset]
            });
            // Verificar si results.rows existe y es un array
            if (Array.isArray(results.rows)) {
                results.rows.forEach((row) => {
                    // Verificamos si el objeto row tiene las propiedades que necesitamos
                    if (row.id && row.content && row.user) {
                        socket.emit('chat message', row.content, row.id.toString(), row.user);
                    }
                    else {
                        console.warn('El objeto row no tiene las propiedades esperadas:', row);
                    }
                });
            }
            else {
                console.error('La propiedad "rows" no existe');
            }
        }
        catch (e) {
            console.error('Error al recuperar mensajes:', e);
        }
    }
});
app.use(logger('dev'));
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});
server.listen(port, () => {
    console.log(`El servidor está conectado al puerto ${port}`);
});
