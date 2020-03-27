/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas

router.get('/', (req, res) => {
    //res.send('authentications');
    res.render('index'); //como ya se realizo la config no es necesario colocar index.hbs
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;