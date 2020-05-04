
const express = require('express');
const router = express.Router(); //para creación de rutas

//const SuperUser = require('../models/superuser');
const Egresado = require('../models/Egresado');

const { isAuthenticated } = require('../helpers/auth');

router.get('/egresados/signup', (req, res) => {
    res.render('egresados/signup');
});

router.get('/egresados/home', (req, res) => {
  res.render('egresados/home');
});
 
// TODO validar proximamente que el correo ingresado no este ni en superusuario ni en admin 
router.post('/egresados/signup', async (req, res) => {
    console.log(req.body);
    //res.send('ok');
    const { name, lastname, dni, email, password, confirm_password, country} = req.body;
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
        errors.push({text: 'Please Insert your city'});
    }
    if(errors.length > 0){ 
      res.render('egresados/signup', {errors, lastname, name, dni, email, password, confirm_password, tipouser});
    } else {
        //res.send('fine');
      // Look for email coincidence - hay un user registrado con el mismo correo?
      //let pruebase = SuperUser.find();
      //console.log(pruebase);
      const useregresado = await Egresado.findOne({email: email});
      //console.log(dnisearch);
      if(useregresado) {
        req.flash('error_msg', 'El email ya esta en uso');
        res.redirect('/egresados/signup');
      } else{
        console.log('antes de crear');
        // name,lastname,email,password,tipouser
        const newEgresado = new Egresado({name, lastname,email,password,dni,country,tipouser});
        console.log('despues de crear');
        newEgresado.password = await newEgresado.encryptPassword(password); //se remplaza la contrase por la encriptada
        console.log('despues de encryptar'); 
        await newEgresado.save();  
        console.log('Te has registrado!');
        req.flash('success_msg', 'You are registered.');
        res.redirect('/');      
      }       
    
    } 
});
module.exports = router;