/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas
const passport = require('passport');

router.get('/', (req, res) => {
    //res.send('authentications');
    res.render('index'); //como ya se realizo la config no es necesario colocar index.hbs
});

/*
router.post('/', passport.authenticate('local', {
    successRedirect: '/superuser/home',
    failureRedirect: '/',
    failureFlash: true //para enviar mensajes flash, lo hace con la var user en index
})); */

router.post('/', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
    }), function(req, res){
        //res.redirect('/superuser/home');
        // TODO evitar que una vez autenticado se pueda accedar a rutas de admin o superuser
        console.log(req.user.tipouser);
        let tipouser = req.user.tipouser;
        if(tipouser == 'superusuario'){
            res.redirect('/superuser/home');
        }
        if(tipouser == 'egresado'){
            res.redirect('/egresados/home'); 
        }    
}); 

router.get('/signup', (req, res) => {
    res.render('signup');
});

//close sesion
router.get('/logout', (req,res) =>{
    req.logout();
    res.redirect('/');
})
module.exports = router;