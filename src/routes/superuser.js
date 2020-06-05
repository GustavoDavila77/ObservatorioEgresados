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

//funciona
router.get('/superuser/setpass', isAuthenticated, (req, res) => {
  if(req.user.tipouser == 'superusuario'){
    res.render('superuser/ChangePasswd');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
  
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

router.get('/superuser/secret_signup', isAuthenticated, (req, res) => {
  if(req.user.tipouser == 'superusuario'){
    res.render('superuser/secretSignup');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
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
  // esto se hace para evitar que un usuario una vez autenticado, salte entre rutas
    if(req.user.tipouser == 'superusuario'){
      res.render('superuser/home');
    }
    else{
      req.flash('error_msg', 'Error');
      res.redirect('/');
    }
    
}); 

router.get('/superuser/crearadmin', isAuthenticated, async (req, res) => {
  // esto se hace para evitar que un usuario una vez autenticado, salte entre rutas
  if(req.user.tipouser == 'superusuario'){
    res.render('admin/signup');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
  
});

router.post('/superuser/crearadmin', async (req, res) => {
  const { name, lastname, dni, email, address, country, city} = req.body;
  const tipouser = 'administrador';
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

  if(dni <= 0){
    errors.push({text: 'Por favor inserte un DNI positivo'});
  }

  if(email.length <= 0){
    errors.push({text: 'Please Insert your email'});
  }
  if(address <= 0) {
    errors.push({text: 'Please Insert your address.'});
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

router.get('/superuser/consultaradmins', isAuthenticated, async (req, res) => {
  // esto se hace para evitar que un usuario una vez autenticado, salte entre rutas
  if(req.user.tipouser == 'superusuario'){
    let admins = await Admins.find({});
    admins.forEach(admin => {
      admin.tipouser = generarid();
    });
    res.render('admin/adminlist',{admins});
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
   
});


router.post('/superuser/consultaradmins', async (req, res) => {
  const {name} = req.body;
  var existen = 0;
  let admins = await Admins.find({name: name});
  let Alladmins = await Admins.find({});
  Alladmins.forEach(Alladmin => {
    Alladmin.tipouser = generarid();
  });
  admins.forEach(admin => {
    admin.tipouser = generarid();
    Alladmins.forEach(Alladmin => {
      if(admin.name == Alladmin.name){
        existen = existen + 1;
      }
    });
  });
  console.log('aqui funciona');
  console.log(admins);
  if(existen > 0){
    res.render('admin/adminlist',{admins});
  }
  else{
    console.log('no encontrado');
    req.flash('error_msg', 'Usuario no encontrado');
    res.redirect('/superuser/consultaradmins');
  }
});

module.exports = router;