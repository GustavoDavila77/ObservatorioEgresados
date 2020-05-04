/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas
const nodemailer = require('nodemailer');
const SuperUser = require('../models/superuser');
const { content } = require('googleapis/build/src/apis/content');


function generar()
{
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<8; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

router.get('/', (req, res) => {
    res.render('forgotPass'); 
});

router.post('/forgotpassword/getdata', async (req, res) =>  {
    const {email, dni } = req.body;
    const emailUser = await SuperUser.findOne({email: email});
    const DNIUser = await SuperUser.findOne({dni: dni});
    contentHTML = '<h2>Nueva clave</h2>'+
    '<ul><li>Clave:'+generar()+'</li></ul>';
    //nodemailer.createTransport({})
    if(emailUser /*&& DNIUser*/) {
        console.log(contentHTML);
        res.redirect('/');
    }else{
        req.flash('error_msg', 'El correo es incorrecto o');
        req.flash('error_msg', ' el DNI es incorrecto intente nuevamente');
        res.redirect('/forgotpassword');
    }
    
}); 


module.exports = router;