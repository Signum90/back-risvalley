// ############################################
// ######### RUTAS: AUTH ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Express Validator ◄■:
const { check, body } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const authCTR = require('../controllers/auth.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');
const { validateExistId } = require('../helpers/helpers');

//■► Instancia controlador:  ◄■:
const authController = new authCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.post("/login", [
  check(["correo", "password"], "empty").not().isEmpty(),
  Middlewares.scan_errors
], async (req, res) => await authController.login(req, res));

router.post("/validar-usuario", [
  body('idUser').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  check('codigo').trim().notEmpty().isString(),
  Middlewares.scan_errors
], async (req, res) => await authController.validateUser(req, res));

router.post("/logout", Middlewares.validateJWTMiddleware, Middlewares.logoutMiddleware, async (req, res) => await authController.logout(req, res));

module.exports = router;