import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuarioLista();

export const conectarCliente = (client: Socket) => {
    const usuario = new Usuario(client.id);

    usuariosConectados.agregar(usuario);
}


export const desconectar = (client: Socket) => {
    client.on('disconnect', () => {
        usuariosConectados.borrarUsuario(client.id);
    })
}

export const mensaje= (client: Socket, io: socketIO.Server) => {
    client.on('mensaje', (payload: { de: string, cuerpo: string }) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    })
}

export const configurarUsuario= (client: Socket, io: socketIO.Server) => {
    client.on('configurar-usuario', (payload: {nombre: string}, callbasck: Function) => {
        usuariosConectados.actualizarNombre(client.id, payload.nombre);

        callbasck({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        })
        
    })
}