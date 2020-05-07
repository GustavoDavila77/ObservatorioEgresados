///aqui estan las rutas para el superusuario

const express = require('express');
const router = express.Router(); //para creación de rutas

const SuperUser = require('../models/SuperUser');
const Admins = require('../models/Administradores');
const nodemailer = require('nodemailer');
const { isAuthenticated } = require('../helpers/auth');

function generar(){
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<8; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

function generarid(){
  var alfabeto = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ";
  var contra = "";
  for (i=0; i<8; i++) contra += alfabeto.charAt(Math.floor(Math.random()*alfabeto.length));
  return contra;
}

router.get('/superuser/setpass', (req, res) => {
  res.render('superuser/ChangePasswd');
});

router.post('/superuser/setpass', async (req, res) => {
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
    res.render('superuser/ChangePasswd', {email, password, confirm_password});
  } else {
    const emailUser = await SuperUser.findOne({email: email});
    if(emailUser) {
      await emailUser.updateOne({password: await emailUser.encryptPassword(password)});
      await emailUser.save();
      console.log('Has cambiado tu clave');
      req.flash('success_msg', 'Cambio de clave exitoso. ingrese nuevamente');
      res.redirect('/');
    } else{ 
      req.flash('error_msg', 'El correo no pertenece a ningun super usuario');
      res.redirect('/superuser/ChangePasswd');
    }
        
  } 
});

router.get('/superuser/secret_signup', (req, res) => {
    res.render('superuser/secretSignup');
});

//aqui va el post del registro
router.post('/superuser/secret_signup', async (req, res) => {
    const { name, lastname, dni, email, password, confirm_password, tipouser} = req.body;
    const superhabilidado = true;
    let errors = []; 
    
    if(name.length <= 0){
        errors.push({text: 'Please Insert your Name'});
    }
    if(lastname.length <= 0){
        errors.push({text: 'Please Insert your LastName'});
    }
    if(dni.length <= 0){
      errors.push({text: 'Please Insert your DNI'});
    }
    if(email.length <= 0){
      errors.push({text: 'Please Insert your email'});
    }

    if(password != confirm_password) {
      errors.push({text: 'Passwords do not match.'});
    }
    if(password.length < 4) {
      errors.push({text: 'Passwords must be at least 4 characters.'});
    }
    if(tipouser.length <= 0){
      errors.push({text: 'Please Insert your tipo de user'});
    }
    if(errors.length > 0){
      res.render('superuser/secretSignup', {errors, lastname, name, dni, email, password, confirm_password, tipouser});
    } else {
      const emailUser = await SuperUser.findOne({email: email});
      if(emailUser) {
        req.flash('error_msg', 'El correo ya esta en uso');
        res.redirect('/superuser/secret_signup');
      } else{
        const newUser = new SuperUser({name,lastname,dni,email,password,superhabilidado, tipouser});
        newUser.password = await newUser.encryptPassword(password); //se remplaza la contrase por la encriptada
        console.log('pase encryptación');
        await newUser.save();
        console.log('Te has registrado');
        req.flash('success_msg', 'You are registered.');
        res.redirect('/');
      }
          
    } 
  });

router.get('/superuser/home', isAuthenticated, async (req, res) => {
    res.render('superuser/home');
});

router.get('/superuser/crearadmin', isAuthenticated, async (req, res) => {
  res.render('admin/signup');
});

router.post('/superuser/crearadmin', async (req, res) => {
  const { name, lastname, dni, email, address, tipouser, country, city} = req.body;
  const adminhabilidado = true;
  const password = generar();
  let errors = []; 
  contentHTML = '<h2>Nueva clave</h2><ul><li>Clave: '+password+'</li></ul>';
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
      subject: 'Contraseña temporal',
      html: contentHTML
  };

  if(name.length <= 0){
      errors.push({text: 'Please Insert your Name'});
  }
  if(lastname.length <= 0){
      errors.push({text: 'Please Insert your LastName'});
  }

  if(dni.length <= 0){
    errors.push({text: 'Please Insert your DNI'});
  }

  if(email.length <= 0){
    errors.push({text: 'Please Insert your email'});
  }
  if(address <= 0) {
    errors.push({text: 'Please Insert your address.'});
  }
  if(tipouser.length <= 0){
    errors.push({text: 'Please Insert your tipo de user'});
  }
  if(errors.length > 0){
    res.render('superuser/crearadmin', { name, lastname, dni, email, address});
  } else {
    const emailUser = await Admins.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'El correo ya esta en uso');
      res.redirect('/superuser/crearadmin');
    } else{
      await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
      });
      const newUser = new Admins({name,lastname,dni,email, address, country, city, tipouser, password, adminhabilidado});
      newUser.password = await newUser.encryptPassword(password); //se remplaza la contrase por la encriptada
      console.log('pase encryptación');
      await newUser.save();
      console.log('Te has registrado');
      req.flash('success_msg', 'You are registered.');
      res.redirect('/');
    }
        
  }
  console.log(req.body);
});

router.get('/superuser/consultaradmins', /*isAuthenticated,*/ async (req, res) => {
  let admins = await Admins.find({});
  //console.log(admins);
  //console.log('despues query');
  
  if(admins){
    console.log('lo encontre');
    //console.log(admins);
  }
  else{
    console.log('algo falla');
  }
  admins.forEach(admin => {
    admin.tipouser = generarid();
  });
  console.log(admins);
  res.render('admin/adminlist',{admins}); 
});
module.exports = router;