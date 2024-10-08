import express, { Request, Response } from 'express'; 
import logger from 'morgan';  
import dotenv from 'dotenv';  
import { createClient } from '@libsql/client';  
import { Server } from 'socket.io';  
import { createServer } from 'node:http'; 
import path from 'node:path';  

dotenv.config();

const port: number = parseInt(process.env.PORT ?? '3000'); 

const app = express();  
app.use(express.static(path.join(__dirname, 'client'))); // Añadido para ejecutar archivos estáticos (css)

const server = createServer(app); 

const io = new Server(server, {  
    connectionStateRecovery: {}
});

const db = createClient({
    url: 'libsql://crucial-huntara-ssk17.turso.io',
    authToken: process.env.DB_TOKEN as string  
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

io.on('connection', async (socket: any) => {  
    console.log('El usuario se ha conectado');

    socket.on('disconnect', () => {
        console.log('El usuario se ha desconectado');
    });

    socket.on('chat message', async (msg: string) => {  
        let result;
        const username = socket.handshake.auth.username ?? 'anonymous';
        console.log({ username });

        try {
        result = await db.execute({
            sql: 'INSERT INTO messages(content, user) VALUES (:msg, :username)',
            args: { msg, username }
        });

        // Verificamos si lastInsertRowid existe
        if (result.lastInsertRowid) {
            io.emit('chat message', msg, result.lastInsertRowid.toString(), username);
        } else {
            console.error('Error: lastInsertRowid is undefined');
        }
    } catch (e) {
            console.error(e);
            return;
        }
        io.emit('chat message', msg, result.lastInsertRowid?.toString(), username);
    });

    console.log('auth');
    console.log(socket.handshake.auth);

    if (!socket.recovered) {
        try {
            const results = await db.execute({
                sql: 'SELECT id, content, user FROM messages WHERE id > ?',
                args: [socket.handshake.auth.serverOffset ?? 0]
            });

            results.rows.forEach((row: any) => {  
                socket.emit('chat message', row.content, row.id.toString(), row.user);
            });
        } catch (e) {
            console.error(e);
        }
    }
});

app.use(logger('dev'));

app.get('/', (req: Request, res: Response) => {  
    res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(port, () => {
    console.log(`El servidor está conectado al puerto ${port}`);
});
