const { Router } = require('express');
const express = require('express');
const path = require('path');
const router = Router();
const Middlewares = require('../middlewares/middlewares');

//■► RUTEO: ===================================== ◄■:
router.use("/", Middlewares.validateJWTMiddleware, express.static(path.join(__dirname, '../public/files')));

module.exports = router;