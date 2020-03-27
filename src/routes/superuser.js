///aqui estan las rutas para el superusuario

const express = require('express');
const router = express.Router(); //para creación de rutas

router.get('/superuser/home', (req, res) => {
    res.render('superuser/home');
});

module.exports = router;