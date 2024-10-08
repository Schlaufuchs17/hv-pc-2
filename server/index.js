"use strict";
/* 01. Instalamos typescript: npm install typescript
       Iniciamos typescript: px tsc --init para crear una archivo json
       Cambiamos la extension del archivo a .ts para indicar que es typescript
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // 02. Importamos express y añadimos los tipos para request y response
/*Esto se importa igual que en javascript*/
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv")); //import dotenv from 'dotenv';  
const client_1 = require("@libsql/client");
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
dotenv.config();
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000'); // 03. Indicamos en typescript que "port" es un numero
/*Todo igual que en javascript, no tocar const*/
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    connectionStateRecovery: {}
});
const db = (0, client_1.createClient)({
    url: 'libsql://crucial-huntara-ssk17.turso.io',
    authToken: process.env.DB_TOKEN // 04. Indicamos que "authToken" es un string
});
/* 05. Para que await funciones con typescript tiene que estar dentro
    de una funcion asincrona*/
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.execute(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            user TEXT
        )
    `);
}))();
// 06. Tipamos la función de conexión de socket.io
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
app.use((0, morgan_1.default)('dev'));
/* 10.Hay que indicar que "req" es tipo request y "res" es tipo response*/
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});
server.listen(port, () => {
    console.log(`El servidor está conectado al puerto ${port}`);
});
