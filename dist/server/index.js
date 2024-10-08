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
const express = require('express'); // CommonJS para express
const logger = require('morgan');
const dotenv = require('dotenv');
const { createClient } = require('@libsql/client');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { format } = require('path');
dotenv.config();
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000');
const app = express();
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
        var _a;
        let result;
        const username = (_a = socket.handshake.auth.username) !== null && _a !== void 0 ? _a : 'anonymous';
        console.log({ username });
        try {
            result = yield db.execute({
                sql: 'INSERT INTO message(content, user) VALUES (:msg, :username)',
                args: { msg, username }
            });
        }
        catch (e) {
            console.error(e);
            return;
        }
        if (result.lastInsertRowid !== undefined) {
            io.emit('chat message', msg, result.lastInsertRowid.toString(), username);
        }
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
export {};
