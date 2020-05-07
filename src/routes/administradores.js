const express = require('express');
const router = express.Router(); //para creación de rutas

//const SuperUser = require('../models/superuser');
const Administrador = require('../models/Administradores');

const { isAuthenticated } = require('../helpers/auth');


router.get('/admin/setpass', (req, res) => {
    res.render('admin/ChangePasswd');
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
  
router.get('/admin/home', (req, res) => {
    res.render('admin/home');
});

module.exports = router;