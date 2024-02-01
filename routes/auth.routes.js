// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Express Validator ◄■:
const { check } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const authCTR = require('../controllers/auth.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');

//■► Instancia controlador:  ◄■:
const authController = new authCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.post("/login", [
    check(["correo", "password"], "empty").not().isEmpty(),
    Middlewares.scan_errors
], async (req, res) => await authController.login(req, res));

router.post("/logout", Middlewares.validateJWTMiddleware, Middlewares.logoutMiddleware, async (req, res) => await authController.logout(req, res));

module.exports = router;