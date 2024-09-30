/*00*//*
        - Instalar => npm install -y
        - Iniciar y crear json => npm init -y
        - Instalar dependencias (express) => npm install express -E
        - Crear carpeta server y dentro index.js
*/

/*01*/ import express from 'express' //importamos la dependencia express que hemos instalado. Para que funcionen los imports
/*09*/ import logger from 'morgan'  //Importamos el logger de Morgan
/*28*/ import dotenv from 'dotenv' // Importamos dotenv para leer las variables de entorno
/*29*/ import {createClient} from '@libsql/client' // Crear el cliente utlizando libsql/client
/*02*/ //En package.json hay que poner que el tipo de imprtaciones serán module:  "type": "module",
/*13*/ import {Server} from 'socket.io' // Importamos socket.io despues de instalarlo
/*14*/ import {createServer} from 'node:http' // Crear servidores http
/*31*/ dotenv.config() // Utilizamos el dotenv
import { format } from 'node:path'
/*03*/ const port = process.env.PORT ?? 3000 //Crear una constante para el puerto, por defecto el puerto 3000

/*04*/ const app = express () // Inicializamos la aplicacion llamando a express
/*15*/ const server = createServer(app) // Creamos un servidor http
/*26*/
/*16*/ const io =  new Server (server,{  /* Crear servidor socket io y le pasamos el servidor http -(server)-*/
    connectionStateRecovery:  {}
})

/*30*/ const db = createClient ({
    url:  'libsql://crucial-huntara-ssk17.turso.io', //Poner la url que viene en turso
    authToken : process.env.DB_TOKEN //Hay que llamar el token de turso desde el archivo .env
})

/*32*/ // Iniciar un crear una tabla
await db.execute (`
    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT
    )
`)
/*17*/ // Cuando el socket io tenga una conexion se ejecuta este callback
io.on('connection', async (socket) =>{
    console.log('El usuario se ha conectado')

    /*20*/ // Ver cuando un usuario se desconecta
    socket.on('disconnect', ()=>{ 
        console.log ('El usuario se ha desconectado')
    })

    /*22*/ // Socket para cuando reciba un evento de "mensaje de chat", haga algo en respuesta
    socket.on ('chat message', async (msg) =>{ // Para ver que le llega el mensaje
        /*33*/ let result  //Cada vez que llegue un mensaje se grabara en la base de datos (persistencia)
        const username = socket.handshake.auth.username ?? 'anonymous'
        console.log({username})
        try{      
            result = await db.execute({
                sql: 'INSERT INTO message(content, user) VALUES (:msg, :username)',
                args : {msg, username} // Con args prevenimos la inyeccion de sql
            })
        }catch(e){
            console.error(e)
            return
        }
        io.emit('chat message', msg, result.lastInsertRowid.toString(), username) // Emitimos un mensaje para todo el mundo (Broadcast) y al devolverlo, lo hace en formato string
    })

    consoles.log('auth')
    console.log(socket.handshake.auth)

    if (!socket.recovered){ // Recupera mensajes sin conexion
        try{
            const results = await db.execute({
                sql:'SELECT id, content, user FROM messages WHERE id > ?',
                args: [socket.handshake.auth.serverOffset ?? 0]
            })

            results.row.forEach (row =>{
                socket.emit('chat message', row.content, row.id.toString(), row.user )
            })
        } catch (e) {
            console.error(e)
        }
    }
}) 

/*10*/ app.use(logger('dev')) // Morgan funciona a nivel de request para express
/*11 Crear archivo index.html en la carpeta "client" */

/*05*/ app.get ('/', (req, res) => { // Mensaje de bienvenida cuando el usuario acceda al chat
    res.sendFile(process.cwd() + '/client/index.html') /* Servimos como mensaje un archivo concreto, -cwd- es la carpeta donde se ha inicilalizado el proceso*/
})

/*06*/ /*inicializar el servidor, que estará escuchando. 
        Ésto se hace para tenerlo todo en un solo servidor*/
    server.listen(port,() => { 
    console.log(`El servidor esta conectado al puerto ${port}`)
})
/*07*/ /* En package.json copiamos - "dev": "node --watch ./server/index.js", - 
        en la parte de scripts para hacerlo automaticamente con "npm run dev" 
        y acceder "http://localhost:3000"*/

/*08*/ /* Para saber el estado del servidor, si tarda mucho o da respuestas 
        incorrectas, mejoramos el login instalando otra dependencia - npm install morgan -E - (con
        la E para que ponga las dependencias exactas).
        Morgan es un logger, una herramienta que guarda una traza de algo*/

/*12*/ /* Crear el websocket -> socket.io: "npm install socket.io -E*/ 
/*27*/ // Instalar dependendias de turso (servidor sql), - curl -sSfL https://get.tur.so/install.sh | bash - 
