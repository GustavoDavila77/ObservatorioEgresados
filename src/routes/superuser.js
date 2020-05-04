///aqui estan las rutas para el superusuario

const express = require('express');
const router = express.Router(); //para creación de rutas

const SuperUser = require('../models/superuser');
const { isAuthenticated } = require('../helpers/auth');

router.get('/superuser/secret_signup', (req, res) => {
    res.render('superuser/secretSignup');
});

//aqui va el post del registro
router.post('/superuser/secret_signup', async (req, res) => {
    console.log(req.body);
    //res.send('ok');
    const { name, lastname, dni, email, password, confirm_password } = req.body;
    let errors = []; 
    
    //TODO set all validations 
    if(name.length <= 0){
        errors.push({text: 'Please Insert your Name'});
    }
    if(lastname.length <= 0){
        errors.push({text: 'Please Insert your LastName'});
    }
    if(dni.length <= 0){
      errors.push({text: 'Please Insert your DNI'});
  }
    if(password != confirm_password) {
      errors.push({text: 'Passwords do not match.'});
    }
    if(password.length < 4) {
      errors.push({text: 'Passwords must be at least 4 characters.'})
    }
    if(errors.length > 0){
      res.render('superuser/secretSignup', {errors, lastname, name, dni, email, password, confirm_password});
    } else {
      // Look for email coincidence - hay un user registrado con el mismo correo?
      //let pruebase = SuperUser.find();
      //console.log(pruebase);
      const emailUser = await SuperUser.findOne({email: email});
      if(emailUser) {
        req.flash('error_msg', 'El correo ya esta en uso');
        res.redirect('/superuser/secret_signup');
      } else{
        const newUser = new SuperUser({name,lastname,dni,email,password});
        newUser.password = await newUser.encryptPassword(password); //se remplaza la contrase por la encriptada
        await newUser.save();
        console.log('Te has registrado');
        req.flash('success_msg', 'You are registered.');
        res.redirect('/superuser/home');   
      }
          
    } 
  });

router.get('/superuser/home', isAuthenticated, async (req, res) => {
    res.render('superuser/home');
});

module.exports = router;