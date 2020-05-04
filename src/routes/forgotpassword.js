/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas
const SuperUser = require('../models/superuser');
const nodemailer = require('nodemailer');


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
    contentHTML = '<h2>Nueva clave</h2><ul><li>Clave:  '+generar()+'</li></ul>';
    //Creamos el objeto de transporte
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
                user: 'projectslabegresados@gmail.com',
                pass: 'Niko_orozco'
            }
    });

    var mailOptions = {
        from: 'projectslabegresados@gmail.com',
        to: {email},
        subject: 'Recuperar contraseña',
        html: contentHTML
    };

    if(emailUser /*&& DNIUser*/) {
        await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });
        res.redirect('/');
    }else{
        req.flash('error_msg', 'El correo es incorrecto o el DNI es incorrecto intente nuevamente');
        res.redirect('/forgotpassword');
    }
    
}); 


module.exports = router;