const { Router } = require('express');
const Middlewares = require('../middlewares/middlewares');
const CursosSesionesCTR = require('../controllers/cursosSesiones.controller');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');
const { body, param, validationResult } = require('express-validator');

const cursosSesionesController = new CursosSesionesCTR();
const customMessages = CustomMessages.getValidationMessages();
const router = Router();
const validations = {
  'nombre': body('value').trim().notEmpty().withMessage(customMessages.required)
    .isString().withMessage(customMessages.string)
    .isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
  'estado': body('value').notEmpty().isInt({ min: 0, max: 1 }).withMessage('El estado debe ser un valor entre 0 y 1')
}

router.get("/:idCurso/sesiones", Middlewares.validateJWTMiddleware, [
  body('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('curso', id)
    if (!exists) return Promise.reject('Id curso no válido');
  }),
], async (req, res) => await cursosSesionesController.getSessionsCourse(req, res));

router.post("/sesiones", Middlewares.validateJWTMiddleware, [
  body('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('curso', id)
    if (!exists) return Promise.reject('Id curso no válido');
  }),
  body('nombre').trim().notEmpty().withMessage(customMessages.required)
    .isString().withMessage(customMessages.string)
    .isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
  Middlewares.scan_errors
], async (req, res) => await cursosSesionesController.postSessionCourse(req, res));

router.put("/sesiones/:idSesion/update", Middlewares.validateJWTMiddleware, [
  param('idSesion').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('sesion', id)
    if (!exists) return Promise.reject('Id sesion no válido');
  }),
  body('value').custom(async (id, { req }) => {
    const validate = validations[req.body.campo]
    if (!validate) return Promise.reject('Campo no válido');
    //ejecuta la validacion encontrada
    await validate.run(req);
    const errors = validationResult(req);
    //comprueba si hay errores y los retorna
    if (!errors.isEmpty()) return Promise.reject('error');
  }),
  Middlewares.scan_errors
], async (req, res) => await cursosSesionesController.updateSessionCourse(req, res))

router.delete("/sesiones/:idSesion/eliminar", Middlewares.validateJWTMiddleware, [
  param('idSesion').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('sesion', id)
    if (!exists) return Promise.reject('Id sesion no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await cursosSesionesController.deleteSessionCourse(req, res));
module.exports = router;