import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';

export default class Server {
    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server; 

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        
        

        this.io=require("socket.io")(this.httpServer, {
            cors: {
                origin: true,
                credentials: true
              },            
          });
        this.escucharSocket();;
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private escucharSocket() {
        this.io.on('connection', client => {
            //Conectar cliente 
            socket.conectarCliente(client, this.io);
            //configurar usuario
            socket.configurarUsuario(client, this.io);

            //Obtener usuarios activos
            socket.obtenerUsuarios(client, this.io);

            socket.mensaje(client, this.io);
            //Desconectar
            socket.desconectar(client, this.io);
            
        })
    }

    start( callback:any ) {
        this.httpServer.listen( this.port, callback);
    }
}