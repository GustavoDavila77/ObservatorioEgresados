//implementación de sockets
module.exports = io => {
    console.log('holi sockets');

    //se abre la conección 
    io.on('connection', socket => {
        console.log('new user connect');

        
        // se escucha los eventos de parte del cliente
        socket.on('publicacion', data => {
            console.log(data);
            //line_history.push(data.line); //se almacena en el arreglo
            //draw_line es diferente al draw_line emitido por el cliente
            //io.emit('draw_line', { line: data.line }); //se emite a todos los usuarios
        });
    }); 
};