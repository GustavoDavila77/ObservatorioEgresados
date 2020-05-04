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
    failureFlash: true //para enviar mensajes flash, lo hace con la var user en index
})); 

router.get('/forgotpassword', (req, res) => {
    res.render('forgotPass');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/logout', (req,res) =>{
    req.logout();
    res.redirect('/');
})
module.exports = router;