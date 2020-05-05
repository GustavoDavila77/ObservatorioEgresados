const express = require('express');
const router = express.Router(); //para creación de rutas

//const SuperUser = require('../models/superuser');
const Administrador = require('../models/Administradores');

const { isAuthenticated } = require('../helpers/auth');

router.get('/admin/home', (req, res) => {
    res.render('admin/home');
});

module.exports = router;