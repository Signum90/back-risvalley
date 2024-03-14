// ############################################
// ######### RUTAS: AUTH ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Express Validator ◄■:
const { check, body, param } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const authCTR = require('../controllers/auth.controller');
const CustomMessages = require('../helpers/customMessages');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');
const { validateExistId } = require('../helpers/helpers');
const customMessages = CustomMessages.getValidationMessages();

//■► Instancia controlador:  ◄■:
const authController = new authCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.post("/login", [
  check(["correo", "password"], "empty").not().isEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await authController.login(req, res));

router.post("/logout", Middlewares.validateJWTMiddleware, Middlewares.logoutMiddleware, async (req, res) => await authController.logout(req, res));

router.post("/validar-usuario", [
  body('idUser').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  check('codigo').trim().notEmpty().isString(),
  Middlewares.scan_errors
], async (req, res) => await authController.validateUser(req, res));

router.post("/forgot-password", [
  body('correo').notEmpty().withMessage(customMessages.required).isEmail().withMessage(customMessages.email),
  Middlewares.scan_errors
], async (req, res) => await authController.updateStateUserForgotPassword(req, res));

router.post("/reenviar-codigo", [
  body('idUser').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await authController.reSendCodeValidate(req, res));

router.post("/update-password/primer-ingreso", Middlewares.firstEntryMiddleware, [
  check('password').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await authController.updatePasswordFirstEntry(req, res));

router.get("/:idUser/validar-confirmacion", [
  param('idUser').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await authController.validateUserConfirm(req, res));

router.get("/validar-admin", Middlewares.validateAdminMiddleware, async (req, res) => {
  res.status(200).json({ data: true, msg: 'success' });
});


module.exports = router;