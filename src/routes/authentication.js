/// Aqui estan las rutas para autenticarse
const express = require('express');
const router = express.Router(); //para creación de rutas

router.get('/', (req, res) => {
    res.send('authentications');
});

router.get('/signup', (req, res) => {
    res.send('Registro');
});

module.exports = router;