const express = require('express');
const router = express.Router(); //para creación de rutas

//const SuperUser = require('../models/superuser');
const Administrador = require('../models/Administradores');
const Noticia =  require('../models/Noticia');

const { isAuthenticated } = require('../helpers/auth');

router.get('/admin/setpass', isAuthenticated, (req, res) => {
  if(req.user.tipouser == 'administrador'){
    res.render('admin/ChangePasswd');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
    
  });
  
router.post('/admin/setpass', async (req, res) => {
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
      res.render('admin/ChangePasswd', {email, password, confirm_password});
    } else {
      const emailUser = await Administrador.findOne({email: email});
      if(emailUser) {
        await emailUser.updateOne({password: await emailUser.encryptPassword(password)});
        await emailUser.save();
        console.log('Has cambiado tu clave');
        req.flash('success_msg', 'Cambio de clave exitoso. ingrese nuevamente');
        res.redirect('/');
      } else{
        req.flash('error_msg', 'El correo no pertenece a ningun super usuario');
        res.redirect('/admin/ChangePasswd');
      }
          
    } 
});

router.get('/admin/home', isAuthenticated,(req, res) => {
  if(req.user.tipouser == 'administrador'){
    res.render('admin/home');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
    
});

router.get('/admin/crearcontenido', /*isAuthenticated,*/ (req,res) => {
    res.render('admin/crearcontenido');
});

router.post('/admin/crearcontenido', /*isAuthenticated,*/ (req,res) => {
    console.log(req.file);
    //const { title, description, image} = req.body;
    const image = new Noticia();
    //title = req.body.titlepost;
    res.send('post created');
});

//ruta para mostrar una noticia y ahí editarla o eliminarla
router.get('/admin/noticia/:id', /*isAuthenticated,*/ (req,res) => {
  if(req.user.tipouser == 'administrador'){
    res.send('Perfil de la noticia');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
  
});

router.get('/admin/noticia/:id/delete', /*isAuthenticated,*/ (req,res) => {
  if(req.user.tipouser == 'administrador'){
    res.send('noticia borrada');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
  
});

module.exports = router;