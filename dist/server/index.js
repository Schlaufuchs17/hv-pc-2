var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import path from 'node:path';
dotenv.config();
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000');
const app = express();
app.use(express.static(path.join(__dirname, 'client'))); // Añadido para ejecutar archivos estáticos (css)
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});
const db = createClient({
    url: 'libsql://crucial-huntara-ssk17.turso.io',
    authToken: process.env.DB_TOKEN
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.execute(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            user TEXT
        )
    `);
}))();
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('El usuario se ha conectado');
    socket.on('disconnect', () => {
        console.log('El usuario se ha desconectado');
    });
    socket.on('chat message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let result;
        const username = (_a = socket.handshake.auth.username) !== null && _a !== void 0 ? _a : 'anonymous';
        console.log({ username });
        try {
            result = yield db.execute({
                sql: 'INSERT INTO messages(content, user) VALUES (:msg, :username)',
                args: { msg, username }
            });
            // Verificamos si lastInsertRowid existe
            if (result.lastInsertRowid) {
                io.emit('chat message', msg, result.lastInsertRowid.toString(), username);
            }
            else {
                console.error('Error: lastInsertRowid is undefined');
            }
        }
        catch (e) {
            console.error(e);
            return;
        }
        io.emit('chat message', msg, (_b = result.lastInsertRowid) === null || _b === void 0 ? void 0 : _b.toString(), username);
    }));
    console.log('auth');
    console.log(socket.handshake.auth);
    if (!socket.recovered) {
        try {
            const results = yield db.execute({
                sql: 'SELECT id, content, user FROM messages WHERE id > ?',
                args: [(_a = socket.handshake.auth.serverOffset) !== null && _a !== void 0 ? _a : 0]
            });
            results.rows.forEach((row) => {
                socket.emit('chat message', row.content, row.id.toString(), row.user);
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}));
app.use(logger('dev'));
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});
server.listen(port, () => {
    console.log(`El servidor está conectado al puerto ${port}`);
});
