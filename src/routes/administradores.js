const express = require('express');
const router = express.Router(); //para creación de rutas
//const io = require('../sockets');
//const SuperUser = require('../models/superuser');
const Administrador = require('../models/Administradores');
const Noticia =  require('../models/Noticia');

const { isAuthenticated } = require('../helpers/auth');
var timeago = require('timeago.js');
const path = require('path');
//const { unlink } = require('fs-extra');
const fs = require('fs');

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

router.get('/admin/home', isAuthenticated, async (req, res) => {
  if(req.user.tipouser == 'administrador'){
    const noticias = await Noticia.find();
    //console.log(noticias);
    //console.log(timeago(new Date('2/10/1994')));
    res.render('admin/home', {noticias});
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
  
});

router.get('/admin/crearcontenido', isAuthenticated, (req,res) => {
  if(req.user.tipouser == 'administrador'){
    res.render('admin/crearcontenido');
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
    
});

router.post('/admin/crearcontenido', async (req,res) => {
    //console.log(req.file);
    //TODO Poner mensaje cuando se cargue una imagen 
    //const { title, description, image} = req.body;
    //TODO poner condicional en caso que no se suba una imagen
    const noticia = new Noticia();
    noticia.title = req.body.titlepost;
    noticia.description = req.body.description;
    noticia.filenameimg =  req.file.filename;
    noticia.pathimg = 'images/uploads/'+ req.file.filename;
    noticia.originalnameimg =  req.file.originalname;
    noticia.mimetype =  req.file.mimetype;
    noticia.sizeimg =  req.file.size;
    //console.log(noticia); 
    await noticia.save();
    res.redirect('/admin/home');
});


//ruta para mostrar una noticia y ahí editarla o eliminarla
router.get('/admin/noticia/:id', isAuthenticated, async (req,res) => {
  if(req.user.tipouser == 'administrador'){
    const { id } = req.params;
    const noticia = await Noticia.findById(id);
    console.log(noticia);
    res.render('admin/noticiaprofile', {noticia});
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  }
});

router.get('/admin/noticia/:id/delete', isAuthenticated, async (req,res) => {
  if(req.user.tipouser == 'administrador'){
    //console.log(req.params.id);
    const {id} = req.params;
    const noticia = await Noticia.findByIdAndDelete(id); //al eliminar la img nos devuelve un objeto de esa img
    //console.log(path.resolve());
    //await unlink('/static/' + noticia.pathimg);
    fs.unlink("src/public/"+noticia.pathimg,function(err){
      if(err) throw err;
        console.log('File deleted!');
    });
    res.redirect('/admin/home'); 
  }
  else{
    req.flash('error_msg', 'Error');
    res.redirect('/');
  } 
  
});

router.post('/admin/publicarcontenido', (req,res) =>{
  //req.flash('success_msg', 'msm Posteado');
  //res.redirect('/admin/crearcontenido');
  //res.send('en construcción');
  //console.log('publicando pru...');
  //socket.emit('publicacion', {title: 'concierto'});
})
module.exports = router;