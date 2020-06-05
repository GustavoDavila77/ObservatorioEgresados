//implementación de sockets
//io representa la conexión con todos los sockets
module.exports = function(io) {
    io.on('connection', socket => {
        console.log('new connection of sockets', socket.id);
    
        //el servidor escucha los eventos
        socket.on('send message',  function (data) {
            console.log(data);
            io.sockets.emit('new message', data); //se emita a los clientes
        });
    });
}
