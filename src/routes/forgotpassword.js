/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas
const SuperUser = require('../models/SuperUser');
const nodemailer = require('nodemailer');


function generar(){
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<8; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

router.get('/', (req, res) => {
    res.render('forgotPass'); 
});

router.post('/forgotpassword/getdata', async (req, res) =>  {
    const {email, cedula} = req.body;
    const emailUser = await SuperUser.findOne({email: email});
    const dnibd = emailUser.dni;
    const claves = generar();
    console.log(emailUser);
    contentHTML = '<h2>Nueva clave</h2><ul><li>Clave:  '+claves+'</li></ul>';
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
        to: ' '+email+' ',
        subject: 'Cambio de contraseña',
        html: contentHTML
    };

    if(emailUser) {
        if(cedula == dnibd){
            await transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email enviado: ' + info.response);
                }
            });
            await emailUser.updateOne({password: await emailUser.encryptPassword(claves)});
            await emailUser.save();
            res.redirect('/');
        }else{
            req.flash('error_msg', 'El DNI es incorrecto intente nuevamente');
            res.redirect('/forgotpassword');
        }
    }else{
        req.flash('error_msg', 'El correo es incorrecto o el DNI es incorrecto intente nuevamente');
        res.redirect('/forgotpassword');
    }
    
}); 


module.exports = router;