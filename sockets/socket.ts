import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (client: Socket, io:socketIO.Server) => {
    const usuario = new Usuario(client.id);
    usuariosConectados.agregar(usuario);
    
}


export const desconectar = (client: Socket, io: socketIO.Server) => {
    client.on('disconnect', () => {
        usuariosConectados.borrarUsuario(client.id);

        io.emit('usuarios-activos', usuariosConectados.getLista());
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

        io.emit('usuarios-activos', usuariosConectados.getLista());
        callbasck({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        })
        
    })
}

export const obtenerUsuarios= (client: Socket, io: socketIO.Server) => {
    client.on('obtener-usuarios', () => {

        io.to( client.id ).emit('usuarios-activos', usuariosConectados.getLista()  );
        
    });
}

