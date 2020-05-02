
const express = require('express');
const router = express.Router(); //para creación de rutas

const Users = require('../models/users');
const { isAuthenticated } = require('../helpers/auth');

router.get('/egresados/signup', (req, res) => {
    res.render('egresados/signup');
});

router.post('/egresados/signup', async (req, res) => {
    console.log(req.body);
    //res.send('ok');
    const { name, lastname, dni, email, password, confirm_password, country } = req.body;
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
      res.render('egresados/signup', {errors, lastname, name, dni, email, password, confirm_password});
    } else {
        //res.send('fine');
      // Look for email coincidence - hay un user registrado con el mismo correo?
      //let pruebase = SuperUser.find();
      //console.log(pruebase);
      const dnisearch = await Users.findOne({egresados: {dni: dni}});
      //console.log(dnisearch);
      if(dnisearch) {
        req.flash('error_msg', 'El dni ya esta en uso');
        res.redirect('/egresados/signup');
      } else{
        console.log('antes de crear');
        const newUser = new Users({egresados: {email,password,dni, personaldata: {name,lastname,country}}});
        console.log('despues de crear');
        newUser.egresados.password = await newUser.encryptPassword(password); //se remplaza la contrase por la encriptada
        console.log('despues de encryptar'); 
        console.log(newUser); 
        // TODO Corregir problema con creación de egresados
        await newUser.save();  
        console.log('Te has registrado!');
        req.flash('success_msg', 'You are registered.');
        res.redirect('/');     
      }      
    
    } 
});
module.exports = router;