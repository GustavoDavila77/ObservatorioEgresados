/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas
const SuperUser = require('../models/SuperUser');
const Admin = require('../models/Administradores');
const Egresado = require('../models/Egresado');
const nodemailer = require('nodemailer');


function generar(){
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<8; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

async function sendEmail (transporter,mailOptions, emailUser, claves){
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
    await emailUser.updateOne({password: await emailUser.encryptPassword(claves)});
    await emailUser.save();
}

/*
router.get('/', (req, res) => {
    res.render('forgotPass'); 
}); */

router.post('/forgotpassword/getdata', async (req, res) =>  {
    const {email, cedula} = req.body;
    const emailSuper = await SuperUser.findOne({email: email});
    const emailAdmin = await Admin.findOne({email: email});
    const emailEgresado = await Egresado.findOne({email: email});
    //const dnibd = emailUser.dni;
    //const dnibd_admin = emailAdmin.dni;
    const claves = generar();
    //console.log(emailSuper);
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

    if(emailSuper) {
        if(cedula == emailSuper.dni){
            sendEmail(transporter,mailOptions,emailSuper,claves);
            req.flash('success_msg', 'Password Changed');
            res.redirect('/');
        }
        else{
            console.log('No se encontro el dni del super');
            req.flash('error_msg', 'cédula not founded');
            res.redirect('/forgotpassword');
        }
    }
    else if(emailAdmin){
        if(cedula == emailAdmin.dni){
            sendEmail(transporter,mailOptions,emailAdmin,claves);
            req.flash('success_msg', 'Password Changed');
            res.redirect('/');
        }
        else{
            console.log('no se encontro el dni del admin');
            req.flash('error_msg', 'cédula not founded');
            res.redirect('/forgotpassword');
        }
    }
    else if(emailEgresado){
        if(cedula == emailEgresado.dni){
            sendEmail(transporter,mailOptions,emailEgresado,claves);
            req.flash('success_msg', 'Password Changed');
            res.redirect('/');
        }
        else{
            console.log('no se encontro el dni del egresado');
            req.flash('error_msg', 'cédula not founded');
            res.redirect('/forgotpassword');
        }
    }else{
        req.flash('error_msg', 'User not founded');
        res.redirect('/forgotpassword');
    }
    
}); 


module.exports = router;

/*
//funciona para superuser 
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
*/