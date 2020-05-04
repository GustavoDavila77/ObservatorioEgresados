/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas
const passport = require('passport');
const SuperUser = require('../models/superuser');

router.get('/', (req, res) => {
    res.render('forgotPass'); 
});

router.post('/forgotpassword/getdata', async (req, res) =>  {
    const {email, dni } = req.body;
    const emailUser = await SuperUser.findOne({email: email/*, dni: dni*/});
    //aqui generar passwd
    if(emailUser){
        
        //enviar passwd al correo
        //await SuperUser.updateOne();
        console.log('si funciona');
        res.redirect('/');
    }else{
        console.log('no funciona');
    }
}); 

/*
router.post('/forgotpassword/getdata', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/forgotpassword/getdata',
    failureFlash: true //para enviar mensajes flash, lo hace con la var user en index
})); 
*/

module.exports = router;