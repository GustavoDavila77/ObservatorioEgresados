//console.log('sockets2 work');
// este socket es todo el codigo del frontend que va a permitir enviar
// los eventos al servidor

function init(){
const socket = io()

// DOM elements
let title = document.getElementById('titlepost');
let messagepost = document.getElementById('messagepost');
let btn = document.getElementById('sendpost');

let titleoutput = document.getElementById('titleoutput');
let postoutput = document.getElementById('postoutput');


btn.addEventListener('click', function() {
    //console.log('click');
    //console.log(title.value, messagepost.value); 
    
    //se emiten los datos al servidor
    socket.emit('post:message', {
        title: title.value,
        message: messagepost.value
    });
    
    //se escucha los datos del servidor
    socket.on('post:message2', function(data){
        console.log(data);
        titleoutput.innerHTML += `<p>
        <strong>${data.title}</strong>: ${data.message}
        </p>` 
    });
}); 
}

// TODO sol la pagina el postear se recarga de inmediati
document.addEventListener('DOMContentLoaded', init); //para saber si la pag ya cargo