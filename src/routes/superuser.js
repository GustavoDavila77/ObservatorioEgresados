///aqui estan las rutas para el superusuario

const express = require('express');
const router = express.Router(); //para creación de rutas

router.get('/superuser', (req, res) => {
    res.send('Home superusuario');
});

module.exports = router;