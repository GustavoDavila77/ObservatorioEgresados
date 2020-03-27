/////// Archivo Principal sirve para iniciarlizar el servidor
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');

///////Initialation 
const app = express();
require('./database');

/////// Settings 

app.set('port', process.env.PORT || 3000); //si un servicio en la nube me ofrece un puerto utilicelo sino utilice el 3000
app.set('views', path.join(__dirname, 'views')); //se indica al servidor donde se encuentra views, dirname devuelve el directorio donde es ejecutado y join une directorios
//configuración de handlebars, el main nos permite reutilizar código como el header, el footer, colores etc
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //se indica la dirección donde se encuentra el main
    partialsDir: path.join(app.get('views'), 'partials'), //reutilizar pedazos de codigo(formularios, cards)
    extname: '.hbs'
}));

//se establece el motor de plantillas (handlebars)
app.set('view engine', '.hbs');

/////// Middlewares
app.use(express.urlencoded({extended: false}) ); //para recibir datos de los formularios, false para no recibir img u otros formatos
app.use(methodOverride('_method')); //para que los formularios puedan enviar metodos como put and delete, el metodo oculto lo haremos con '_method
app.use(session({ //para guardar los datos de inicio de los usuarios
    secret: 'pechesapp', //palabra secreta
    resave: true,
    saveUninitialized: true
}));
//////// Global Variables

////////Routes 
app.use(require('./routes/authentication'));
app.use(require('./routes/superuser'));

//////// Static Files 
app.use(express.static(path.join(__dirname, 'public')));
////////Server listening
app.listen(app.get('port'), () => {
    console.log('Server escuchando en puerto', app.get('port'));
});