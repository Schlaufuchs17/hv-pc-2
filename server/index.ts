/* 01. Instalamos typescript: npm install typescript
       Iniciamos typescript: px tsc --init para crear una archivo json
       Cambiamos la extension del archivo a .ts para indicar que es typescript
*/

import express, { Request, Response } from 'express';  // 02. Importamos express y añadimos los tipos para request y response

/*Esto se importa igual que en javascript*/
import logger from 'morgan';  
import dotenv from 'dotenv';  
import { createClient } from '@libsql/client';  
import { Server } from 'socket.io';  
import { createServer } from 'node:http'; 
import { format } from 'node:path';  

dotenv.config();

const port: number = parseInt(process.env.PORT ?? '3000');  // 03. Indicamos en typescript que "port" es un numero

/*Todo igual que en javascript, no tocar const*/
const app = express();  
const server = createServer(app); 

const io = new Server(server, {  
    connectionStateRecovery: {}
});

const db = createClient({
    url: 'libsql://crucial-huntara-ssk17.turso.io',
    authToken: process.env.DB_TOKEN as string  // 04. Indicamos que "authToken" es un string
});

/* 05. Para que await funciones con typescript tiene que estar dentro
    de una funcion asincrona*/
(async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            user TEXT
        )
    `);
})();

// 06. Tipamos la función de conexión de socket.io
io.on('connection', async (socket: any) => {  // 07. Indicamos que el socket puede ser cualquiera. Indica vsc que lo correcto seria "socket:any", pero quiza seria mejor "socket: Socket"
    console.log('El usuario se ha conectado');

    socket.on('disconnect', () => {
        console.log('El usuario se ha desconectado');
    });

    socket.on('chat message', async (msg: string) => {  // 08. Indicamos que el mensaje es un string
        let result;
        const username = socket.handshake.auth.username ?? 'anonymous';
        console.log({ username });

        try {
            result = await db.execute({
                sql: 'INSERT INTO message(content, user) VALUES (:msg, :username)',
                args: { msg, username }
            });
        } catch (e) {
            console.error(e);
            return;
        }
        io.emit('chat message', msg, result.lastInsertRowid.toString(), username);
    });

    console.log('auth');
    console.log(socket.handshake.auth);

    if (!socket.recovered) {
        try {
            const results = await db.execute({
                sql: 'SELECT id, content, user FROM messages WHERE id > ?',
                args: [socket.handshake.auth.serverOffset ?? 0]
            });

            results.row.forEach((row: any) => {  // 09. Indicamos que "row" puede ser de cualquier tipo, quiza quedaria mejor algo tipo "{id: number, content: string}"
                socket.emit('chat message', row.content, row.id.toString(), row.user);
            });
        } catch (e) {
            console.error(e);
        }
    }
});

app.use(logger('dev'));

/* 10.Hay que indicar que "req" es tipo request y "res" es tipo response*/
app.get('/', (req: Request, res: Response) => {  
    res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(port, () => {
    console.log(`El servidor está conectado al puerto ${port}`);
});
