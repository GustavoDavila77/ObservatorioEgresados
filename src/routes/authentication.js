/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas
const passport = require('passport');

router.get('/', (req, res) => {
    //res.send('authentications');
    res.render('index'); //como ya se realizo la config no es necesario colocar index.hbs
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/superuser/home',
    failureRedirect: '/',
    failureFlash: true //para enviar mensajes flash
})); 

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;