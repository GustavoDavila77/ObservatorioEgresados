const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/SuperUser'); //traemos el esquema de User de la db
const UserEgresado = require('../models/Egresado');
const UserAdmin = require('../models/Administradores');

// se define la estrategia de 
//se utiliza el callback 'done' para avisar cuando se termina
// TODO arreglar problema de autenticacion de egresados https://mjvolk.com/implement-multiple-local-user-authentication-strategies-in-passport-js/

// implementacion que funcioanaba pero no permitia guardar sesion de egresados
passport.use(new LocalStrategy({
    usernameField: 'email' //campo con el que se va a autenticar 
}, async (email, password, done) => { //campos a recibir
    const user = await User.findOne({email: email});
    //next(); 
    const useregresado = await UserEgresado.findOne({email: email});
    const useradmin = await UserAdmin.findOne({email: email});

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
    else if(useradmin){
        const match = await useradmin.matchPassword(password); //se ejecuta metodo definido en el modelo para verificar contraseña
        if(match) {
            return done(null, useradmin);
        }else{
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
    else{
        return done(null, false, {message: 'Not User found'}); //este callback sirve para terminar el proceso de autenticación -- (error, user, mensaje)
    }
    
}));

/*
module.exports = function(passport){
    
    passport.use('local-super-login', new LocalStrategy({
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

    passport.use('local-egresado-login', new LocalStrategy({
        usernameField: 'email' //campo con el que se va a autenticar 
    }, async (email, password, done) => { //campos a recibir
        const useregresado = await UserEgresado.findOne({email: email});
        if(!useregresado){
            return done(null, false, {message: 'Not User found'}); //este callback sirve para terminar el proceso de autenticación -- (error, user, mensaje)
        } else {
            const match = await user.matchPassword(password); //se ejecuta metodo definido en el modelo para verificar contraseña
            if(match) {
                return done(null, useregresado);
            }else{
                return done(null, false, {message: 'Incorrect Password'});
            }
        }
    }   
    ));
}   */

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

*/

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