
const express = require('express');
const router = express.Router(); //para creación de rutas

const BDvalidation = require('../models/BDValidation');
const Egresado = require('../models/Egresado');
const Noticia =  require('../models/Noticia');
const nodemailer = require('nodemailer');

const { isAuthenticated } = require('../helpers/auth');

router.get('/egresados/signup', (req, res) => {
    res.render('egresados/signup');
});


router.get('/egresados/home', async (req, res) => {
  if(req.user.tipouser == 'egresado'){
    // Filtro de noticias según el interes del egresado
    const interestsuser = req.user.interests;  //es un array 
    console.log(interestsuser);
    //hacer un query donde se obtengan solo las noticias con esos intereses
    const noticias = await Noticia.find({interest: { $in: interestsuser}});
    console.log('***** Noticias con filtro *******');
    console.log(noticias);
    //const noticias = await Noticia.find();
    res.render('egresados/home', {noticias}); 
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  } 
});

router.get('/egresados/setpass', isAuthenticated, (req, res) => {
  if(req.user.tipouser == 'egresado'){
    res.render('egresados/ChangePasswd');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
  
});

router.post('/egresados/setpass', async (req, res) => {
  const {email, password, confirm_password} = req.body;
  let errors = []; 
  
  if(email.length <= 0){
    errors.push({text: 'Please Insert your email'});
  }
  if(password != confirm_password) {
    errors.push({text: 'Passwords do not match.'});
  }
  if(password.length < 4) {
    errors.push({text: 'Passwords must be at least 4 characters.'});
  }
  if(errors.length > 0){
    res.render('egresados/ChangePasswd', {email, password, confirm_password});
  } else {
    const emailUser = await Egresado.findOne({email: email});
    if(emailUser) {
      await emailUser.updateOne({password: await emailUser.encryptPassword(password)});
      await emailUser.save();
      console.log('Has cambiado tu clave');
      req.flash('success_msg', 'Cambio de clave exitoso. ingrese nuevamente');
      res.redirect('/egresados/home');
    } else{
      req.flash('error_msg', 'El correo no pertenece a ningun super usuario');
      res.redirect('/egresados/ChangePasswd');
    }
        
  } 
});

router.post('/egresados/signup', async (req, res) => { 
    console.log(req.body);
    //res.send('ok');
    const { name, lastname, dni, email, password, confirm_password, country, city, interests, age, gender} = req.body;
    const getValidation = await BDvalidation.findOne({email: email});
    console.log(getValidation);
    const dnibd = getValidation.dni;
    const tipouser = 'egresado';
    let errors = []; 
     
    if(name.length <= 0){
        errors.push({text: 'Please Insert your Name'});
    }
    if(lastname.length <= 0){
        errors.push({text: 'Please Insert your LastName'});
    }
    if(dni.length <= 0){
        errors.push({text: 'Please Insert your dni'});
    }
    if(dni <= 0){
      errors.push({text: 'Please Insert correct dni'});
    }
    if(email.length <= 0){
        errors.push({text: 'Please Insert your email'});
    } 
    if(password != confirm_password) {
      errors.push({text: 'Passwords do not match.'});
    }
    if(password.length < 4) {
      errors.push({text: 'Passwords must be at least 4 characters.'})
    }    
    if(country == 'null'){
        errors.push({text: 'Please Insert your country'});
    }
    if(city == 'null'){
      errors.push({text: 'Please Insert your city'});
    }
    if(interests == 'null'){
      errors.push({text: 'Please Insert your interests'});
    }
    if(age.length <= 0){
      errors.push({text: 'Please Insert your age'});
    }
    if(age <= 14 ){
      errors.push({text: 'Incorrect age'});
    }   
    if(gender == 'null'){ 
      errors.push({text: 'Please Insert your gender'});
    }
    if(errors.length > 0){ 
      res.render('egresados/signup', {errors, name,lastname, dni, email, password, age});
    } else {
      // Look for email coincidence - hay un user registrado con el mismo correo?
      //let pruebase = Egresado.find();
      //console.log(pruebase);
      const useregresado = await Egresado.findOne({email: email});
      //console.log(dnisearch);
      if(useregresado) {
        if(useregresado.dni == dni){
          req.flash('error_msg', 'El email o el DNI ya esta en uso');
          res.redirect('/egresados/signup');
        }else{
          req.flash('error_msg', 'El DNI ya esta en uso o no existe en la base de datos de la utp');
          res.redirect('/egresados/signup');
        }     
      } else{
        if(getValidation){
          if(String(dni) == String(dnibd)){
            console.log('antes de crear');
            // name,lastname,email,password,tipouser
            const newEgresado = new Egresado({name, lastname,email,password,dni,country,city,interests,age,gender,tipouser});
            console.log('despues de crear');
            newEgresado.password = await newEgresado.encryptPassword(password); //se remplaza la contrase por la encriptada
            console.log('********* Info Egresado a registrar *********')
            console.log(newEgresado); 
            await newEgresado.save();  
            console.log('Te has registrado!');
            req.flash('success_msg', 'You are registered.');
            res.redirect('/');    
          }else{
            req.flash('error_msg', 'El DNI no coincide con el de la base de datos de la UTP');
            res.redirect('/egresados/signup');
          }
        }else{
          req.flash('error_msg', 'El correo es incorrecto intente nuevamente');
          res.redirect('/egresados/preregistro');
        }  
      }          
    } 
});

router.get('/egresados/preregistro', (req, res) => {
  res.render('egresados/preregistro');
});

router.post('/egresados/preregistro', async (req, res) => {
    const {dni, email } = req.body;
    const getValidation = await BDvalidation.findOne({email: email});
    const dnibd = (getValidation == null) ? "33" : getValidation.dni;
    contentHTML = '<h2>Validacion exitosa, puede continuar con su registro</h2><ul><li>Registro:  <a href= "https://quiet-eyrie-58675.herokuapp.com/egresados/signup">Para registrarte clickea sobre este vinculo</a> </li></ul>';
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
        subject: 'ingrese a el siguiente enlace para completar su registro',
        html: contentHTML
    };
    if(getValidation) {
        if(String(dni) == String(dnibd)){
            await transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email enviado: ' + info.response);
                    req.flash('success_msg', 'Message Sent');
                    res.redirect('/');
                }
            });
            res.redirect('/');
        }else{
            req.flash('error_msg', 'El DNI es incorrecto intente nuevamente');
            res.redirect('/egresados/preregistro');
        }
    }else{
        req.flash('error_msg', 'El correo es incorrecto intente nuevamente');
        res.redirect('/egresados/preregistro');
    }
});

router.get('/egresados/chat', (req, res) => {
  res.render('egresados/chat');
});

module.exports = router;