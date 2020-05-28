const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/SuperUser'); //traemos el esquema de User de la db
const UserEgresado = require('../models/Egresado');
const UserAdmin = require('../models/Administradores');

// se define la estrategia de 
//se utiliza el callback 'done' para avisar cuando se termina

//se crea un constructor se session debido a que hay multiples usuarios
function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
}

module.exports = function(passport) {
    //identificar que tipo de usuario es, y usar el passport correspondiente?
    passport.serializeUser(function (userObject, done){
        // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
        let userGroup = "model1";
        let userPrototype =  Object.getPrototypeOf(userObject);

        //se identifica el tipo de usuario y se asigna a un grupo, model1, model2, model3
        if (userPrototype === User.prototype) {
            userGroup = "model1";
          } else if (userPrototype === UserAdmin.prototype) {
            userGroup = "model2"; 
          }
          else if (userPrototype === UserEgresado.prototype) {
            userGroup = "model3"; 
            }

        //luego de haber identificado se crea la sesion y es enviado al callback done
        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);

    });

    //para la deserializacion se recibe el constructor guardado en la sesión
    passport.deserializeUser(function (sessionConstructor, done) {
        //se identifica el tipo de usuario y se realiza el cierre de sesión
        if (sessionConstructor.userGroup == 'model1') {
            User.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err, user);
            });
          } else if (sessionConstructor.userGroup == 'model2') {
            UserAdmin.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err, user);
            });
          } 
          else if (sessionConstructor.userGroup == 'model3') {
            UserEgresado.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err, user);
            });
          }
      
    });

    //se crea una sola estrategia de authenticación llamada local-user
    passport.use('local-users', new LocalStrategy({ 
        usernameField: 'email' //campo con el que se va a autenticar 
    }, async (email, password, done) => { //campos a recibir
        const user = await User.findOne({email: email});
        //next(); 
        const useregresado = await UserEgresado.findOne({email: email});
        const useradmin = await UserAdmin.findOne({email: email});
    
        
        if(user){
            const match = await user.matchPassword(password); //se ejecuta metodo definido en el modelo para verificar contraseña
            if(match) {
                return done(null, user); //se envia el usuario al serializador
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
}