/////// Archivo Principal sirve para iniciarlizar el servidor
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash'); //envio de mensajes entre vistas
const passport = require('passport');
// se instalan estos modulos para permiter el acceso a las propiedades de una instancia en handlebars que por defecto no estan permitidas 
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const morgan = require('morgan'); //visualización de peticiones por consola
const multer = require('multer'); //cargar imagenes
const { v4: uuid} = require('uuid'); // versión 4 para generar id random para imagenes
const { format } = require('timeago.js'); //permite dar un formato más legible a la fecha

///////Initialation
const app = express();
require('./database');
require('./config/passport')(passport);
require('dotenv').config({ path: './src/variables.env'});  

/////// Settings

app.set('port', process.env.PORT || 5000); //si un servicio en la nube me ofrece un puerto utilicelo sino utilice el 3000
app.set('views', path.join(__dirname, 'views')); //se indica al servidor donde se encuentra views, dirname devuelve el directorio donde es ejecutado y join une directorios
//configuración de handlebars, el main nos permite reutilizar código como el header, el footer, colores etc
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //se indica la dirección donde se encuentra el main
    partialsDir: path.join(app.get('views'), 'partials'), //reutilizar pedazos de codigo(formularios, cards)
    //partialsDir: path.join(app.get('views'), 'superuser'), Access has been denied to resolve the property "name"
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: '.hbs' 
}));
 
//se establece el motor de plantillas (handlebars) 
app.set('view engine', '.hbs');

/////// Middlewares
app.use(express.urlencoded({extended: false}) ); //para recibir datos de los formularios, false para no recibir img u otros formatos, para eso esta multer
app.use(methodOverride('_method')); //para que los formularios puedan enviar metodos como put and delete, el metodo oculto lo haremos con '_method
app.use(session({ //para guardar los datos de inicio de los usuarios
    secret: 'pechesapp', //palabra secreta
    resave: true,
    saveUninitialized: true
}));
app.use(morgan('dev'));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/images/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname)); //almacenar con identificador unico y con la extensión de la imagen
    }
});
app.use(multer({ storage: storage }).single('image'));
//app.use(multer({dest: path.join(__dirname, 'public/images/uploads')}).single('image')); //donde se van a guardar las images, solo una, que venga del server con nombre image

//config de passport
app.use(passport.initialize());
app.use(passport.session()); //para que use session - definido en los middlewares
app.use(flash()); 


//////// Global Variables
// se hace uso de flash, para mostrar mensajes de exito en todas las vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'); //si se utiliza flash con 'success_msg' imprimira un aviso de exito
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //para mostrar errores de passport
    res.locals.user = req.user || null; //cuando un user se autentica passport guarda la info en req, si no esta autenticado su valor es null
    next(); //para que continue con el resto de codigo  
}); 

//hacer uso de la fecha
app.use((req, res, next) =>{
    app.locals.format = format; 
    next();
});
 
////////Routes
app.use(require('./routes/authentication'));
app.use(require('./routes/superuser'));  
app.use(require('./routes/forgotpassword'));
app.use(require('./routes/egresados'));
app.use(require('./routes/administradores'));  
 
//////// Static Files
app.use('/static', express.static(path.join(__dirname, 'public')));

//leer localhost de variables y puerto
const host = process.env.HOST || '0.0.0.0'; //heroku cambia el host 0.0.0.0
const port = process.env.PORT || 5000;
////////Server listening con port y host
app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});

/*
//app.listen original, funciona bien
app.listen(app.get('port'), () => {
    console.log('Server escuchando en puerto', app.get('port'));
}); */ 
 