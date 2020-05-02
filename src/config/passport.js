const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/superuser'); //traemos el esquema de User de la db
const UserEgresado = require('../models/Egresado');

// se define la estrategia de 
//se utiliza el callback 'done' para avisar cuando se termina
// TODO arreglar problema de autenticacion de egresados https://mjvolk.com/implement-multiple-local-user-authentication-strategies-in-passport-js/
passport.use(new LocalStrategy({
    usernameField: 'email' //campo con el que se va a autenticar 
}, async (email, password, done) => { //campos a recibir
    const user = await User.findOne({email: email});
    //next(); 
    const useregresado = await UserEgresado.findOne({email: email});

    if(user){
        const match = await user.matchPassword(password); //se ejecuta metodo definido en el modelo para verificar contraseña
        if(match) {
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
    else if(useregresado){
        const match = await useregresado.matchPassword(password); //se ejecuta metodo definido en el modelo para verificar contraseña
        if(match) {
            return done(null, useregresado);
        }else{
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
    else{
        return done(null, false, {message: 'Not User found'}); //este callback sirve para terminar el proceso de autenticación -- (error, user, mensaje)
    }
    
}));

// Aqui se guardaran las sesiones //video 2:42
//done(error, user, optiones)
passport.serializeUser((user, done) => {
    done(null, user.id); //cuando el user se logge se guarda el id para no tener que volver a pedirlo cuando pase a otra pag
}); 

//en este proceso inverso al anterior, se toma el id y se genera un usuario para poder usar sus datos
passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) =>{
        done(err, user);
    }); 
    
}); 

/*
// passport original
passport.use(new LocalStrategy({
    usernameField: 'email' //campo con el que se va a autenticar 
}, async (email, password, done) => { //campos a recibir
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, {message: 'Not User found'}); //este callback sirve para terminar el proceso de autenticación -- (error, user, mensaje)
    } else {
        const match = await user.matchPassword(password); //se ejecuta metodo definido en el modelo para verificar contraseña
        if(match) {
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
}));
*/