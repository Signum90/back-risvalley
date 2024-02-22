const { Router } = require('express');
const { body, param, check, validationResult, query } = require('express-validator');
const entidadesCTR = require('../controllers/entidades.controller');
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');
const CustomMessages = require('../helpers/customMessages');

//■► Instancia controlador:  ◄■:
const entidadesController = new entidadesCTR();
const customMessages = CustomMessages.getValidationMessages();
//■► Router:  ◄■:
const router = Router();

const validations = {
  'nombre': body('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 120 }).withMessage(customMessages.length),
  'descripcion': body('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage(customMessages.length),
  'sigla': body('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 10 }).withMessage(customMessages.length),
  'tipo': body('value').notEmpty().withMessage(customMessages.required).isInt({ min: 1, max: 3 }),
  'idTipoNaturalezaJuridica': body('value').notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int),
  'contactoNombre': body('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 70 }).withMessage(customMessages.length),
  'contactoCargo': body('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 70 }).withMessage(customMessages.length),
  'contactoCorreo': body('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  'contactoTelefono': body('value').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).isLength({ max: 11 }).withMessage(customMessages.length),
  'direccion': body('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  'urlDominio': body('value').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  'urlFacebook': body('value').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  'urlTwitter': body('value').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  'urlLinkedin': body('value').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
}

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await entidadesController.getEntidades(req, res));

router.get("/select", Middlewares.validateJWTMiddleware, async (req, res) => await entidadesController.getSelectEntidades(req, res));

router.post("/create", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }).custom(async (nombre) => {
    const exists = await validateFieldUnique('entidad', 'nombre', nombre)
    if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
  }),
  check('descripcion').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  check('sigla').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 10 }).withMessage(customMessages.length),
  check('tipo').notEmpty().withMessage(customMessages.required).isInt({ min: 1, max: 3 }).withMessage(customMessages.int),
  check('idTipoNaturalezaJuridica').notEmpty().isInt().custom(async (tipo) => {
    const exists = await validateExistId('tipo', tipo)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  check('email').trim().notEmpty().isString().isLength({ max: 80 }),
  check('telefono').trim().notEmpty().isInt().isLength({ max: 11 }),
  check('direccion').trim().notEmpty().isString().isLength({ max: 80 }),
  check('urlDominio').trim().isString().isLength({ max: 80 }),
  check('urlFacebook').trim().isString().isLength({ max: 80 }),
  check('urlTwitter').trim().isString().isLength({ max: 80 }),
  check('urlLinkedin').trim().isString().isLength({ max: 80 }),
  Middlewares.scan_errors
], entidadesController.saveEntidad);

router.post("/create/dashboard", Middlewares.validateAdminMiddleware, multerConfig.upload.single('logo'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }).custom(async (nombre) => {
    const exists = await validateFieldUnique('entidad', 'nombre', nombre)
    if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
  }),
  check('idUser').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 80 }),
  check('sigla').trim().notEmpty().isString().isLength({ max: 10 }),
  check('tipo').notEmpty().isInt({ min: 1, max: 3 }),
  check('idTipoNaturalezaJuridica').notEmpty().isInt().custom(async (tipo) => {
    const exists = await validateExistId('tipo', tipo)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  check('email').trim().notEmpty().isString().isLength({ max: 80 }),
  check('telefono').trim().notEmpty().isInt().isLength({ max: 11 }),
  check('direccion').trim().notEmpty().isString().isLength({ max: 80 }),
  check('urlDominio').trim().isString().isLength({ max: 80 }),
  check('urlFacebook').trim().isString().isLength({ max: 80 }),
  check('urlTwitter').trim().isString().isLength({ max: 80 }),
  check('urlLinkedin').trim().isString().isLength({ max: 80 }),
  Middlewares.scan_errors
], entidadesController.saveEntidad);

router.put("/:idEntidad/update", Middlewares.validateJWTMiddleware, [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('entidad', id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  body('keydata').trim().notEmpty().withMessage(customMessages.required),
  //validacion dinamica dependiendo del campo que se va a editar
  body('value').notEmpty().custom(async (id, { req }) => {
    const validate = validations[req.body.campo]
    if (!validate) return Promise.reject('Campo no válido');
    //ejecuta la validacion encontrada
    await validate.run(req);
    const errors = validationResult(req);
    //comprueba si hay errores y los retorna
    if (!errors.isEmpty()) return Promise.reject('error');
  }),
  Middlewares.scan_errors
], async (req, res) => await entidadesController.updateFieldEntidad(req, res))

router.put("/:idEntidad/update-logo", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('entidad', id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  check('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await entidadesController.updateLogoEntidad(req, res));

router.delete("/:idEntidad/delete", Middlewares.validateJWTMiddleware, [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('entidad', id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  query('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await entidadesController.deleteEntidad(req, res))

module.exports = router;